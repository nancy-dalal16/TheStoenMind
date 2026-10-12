"use client";

import { useSyncExternalStore } from "react";
import { multiplyMoney } from "@/lib/shop/money";

/**
 * Bag state, shared by the header button, the drawer and every "Add to bag" button.
 * An external store (read with useSyncExternalStore) so the server render and first
 * client render agree on an empty bag, and the real one arrives without a re-render loop.
 *
 *   mode "shopify"  → /api/cart (Storefront Cart API, id in an httpOnly cookie)
 *   mode "preview"  → localStorage, until the Shopify env vars are set
 */

const STORAGE_KEY = "stoen-bag";
const EMPTY = { lines: [], totalQuantity: 0, subtotal: null, checkoutUrl: null };

let mode = "preview";
let started = false;
let state = { cart: EMPTY, open: false, pending: false, error: null, ready: false };
const SERVER_STATE = state;
const listeners = new Set();

function set(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

export function configureCart(nextMode) {
  if (!started) mode = nextMode;
}

/* ── Preview (browser) cart ────────────────────────────────── */

function summarise(lines) {
  const totalQuantity = lines.reduce((sum, l) => sum + l.quantity, 0);
  const currencyCode = lines[0]?.price.currencyCode ?? "INR";
  const subtotal = lines.length
    ? { amount: String(lines.reduce((sum, l) => sum + Number(l.price.amount) * l.quantity, 0)), currencyCode }
    : null;
  return { lines, totalQuantity, subtotal, checkoutUrl: null };
}

function readLocal() {
  try {
    const lines = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return summarise(Array.isArray(lines) ? lines : []);
  } catch {
    return EMPTY;
  }
}

function writeLocal(lines) {
  const withTotals = lines.map((l) => ({ ...l, total: multiplyMoney(l.price, l.quantity) }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withTotals));
  } catch {
    /* private mode / storage full: the bag still works for this page view */
  }
  set({ cart: summarise(withTotals) });
}

/* ── Shopify cart ──────────────────────────────────────────── */

async function callApi(init) {
  const response = await fetch("/api/cart", {
    ...init,
    headers: { "Content-Type": "application/json" },
  });
  const json = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(json.error || "We couldn't update your bag. Please try again.");
  return json.cart ?? EMPTY;
}

async function run(task) {
  set({ pending: true, error: null });
  try {
    await task();
  } catch (error) {
    set({ error: error.message });
  } finally {
    set({ pending: false });
  }
}

/* ── Lifecycle ─────────────────────────────────────────────── */

function start() {
  started = true;
  if (mode === "preview") {
    set({ cart: readLocal(), ready: true });
    // Keep open tabs in step
    window.addEventListener("storage", (event) => {
      if (event.key === STORAGE_KEY) set({ cart: readLocal() });
    });
    return;
  }
  callApi({ method: "GET" })
    .then((cart) => set({ cart, ready: true }))
    .catch(() => set({ ready: true }));
}

function subscribe(listener) {
  listeners.add(listener);
  if (!started) queueMicrotask(start);
  return () => listeners.delete(listener);
}

export function useCart() {
  return useSyncExternalStore(subscribe, () => state, () => SERVER_STATE);
}

/* ── Actions ───────────────────────────────────────────────── */

export const openCart = () => set({ open: true });
export const closeCart = () => set({ open: false, error: null });
export const cartMode = () => mode;

/** `product` and `variant` in the catalogue shape (lib/shop/sample.js). */
export function addToCart({ product, variant, quantity = 1 }) {
  return run(async () => {
    if (mode === "preview") {
      const lines = [...state.cart.lines];
      const existing = lines.findIndex((l) => l.id === variant.id);
      if (existing >= 0) {
        lines[existing] = { ...lines[existing], quantity: Math.min(99, lines[existing].quantity + quantity) };
      } else {
        lines.push({
          id: variant.id,
          variantId: variant.id,
          quantity,
          price: variant.price,
          variantTitle: variant.selectedOptions.map((o) => o.value).join(" / "),
          image: variant.image ?? product.images[0] ?? null,
          product: { handle: product.handle, title: product.title, collection: product.collection?.handle ?? "all" },
        });
      }
      writeLocal(lines);
    } else {
      const cart = await callApi({
        method: "POST",
        body: JSON.stringify({ action: "add", lines: [{ merchandiseId: variant.id, quantity }] }),
      });
      set({ cart });
    }
    set({ open: true });
  });
}

export function updateQuantity(lineId, quantity) {
  if (quantity <= 0) return removeLine(lineId);
  return run(async () => {
    if (mode === "preview") {
      writeLocal(state.cart.lines.map((l) => (l.id === lineId ? { ...l, quantity: Math.min(99, quantity) } : l)));
    } else {
      set({
        cart: await callApi({ method: "POST", body: JSON.stringify({ action: "update", lines: [{ id: lineId, quantity }] }) }),
      });
    }
  });
}

export function removeLine(lineId) {
  return run(async () => {
    if (mode === "preview") {
      writeLocal(state.cart.lines.filter((l) => l.id !== lineId));
    } else {
      set({ cart: await callApi({ method: "POST", body: JSON.stringify({ action: "remove", lineIds: [lineId] }) }) });
    }
  });
}
