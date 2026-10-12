"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import { cartCopy } from "@/lib/shop/copy";
import { formatMoney } from "@/lib/shop/money";
import QuantityStepper from "./QuantityStepper";
import { closeCart, configureCart, removeLine, updateQuantity, useCart } from "./cartStore";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]"; // same drawer curve as the site menu

const subscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

/**
 * The bag: a panel that slides in from the right, built like <SiteMenu /> (portal on <body>,
 * modal dialog, focus trap, Escape / scrim to close, page scroll locked, `inert` when closed).
 * Rendered once from the root layout; `mode` comes from the server (lib/shop/catalog.js).
 */
export default function CartDrawer({ mode }) {
  configureCart(mode);
  const { cart, open, pending, error } = useCart();
  const isClient = useIsClient();
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const returnFocus = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    returnFocus.current = document.activeElement;

    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeCart();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
      returnFocus.current?.focus?.({ preventScroll: true });
    };
  }, [open]);

  if (!isClient) return null;

  const empty = cart.lines.length === 0;

  return createPortal(
    <div
      inert={!open}
      className={`fixed inset-0 z-50 ${
        open
          ? "visible"
          : "pointer-events-none invisible transition-[visibility] duration-700 motion-reduce:transition-none"
      }`}
    >
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`absolute inset-0 bg-scrim backdrop-blur-[3px] transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-busy={pending}
        className={`absolute inset-y-0 right-0 flex w-full flex-col overflow-x-clip bg-linear-to-b from-drawer-from to-drawer-to text-fg shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.35)] transition-transform duration-[700ms] motion-reduce:transition-none sm:w-[460px] sm:rounded-l-[28px] ${EASE} ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top row - lines up with the header */}
        <div className="relative flex h-[88px] shrink-0 items-center justify-between px-6 sm:px-10 md:h-[110px]">
          <h2
            id={titleId}
            className="flex items-baseline gap-3 font-sans text-xs font-medium tracking-[0.22em] text-eyebrow uppercase"
          >
            {cartCopy.title}
            {cart.totalQuantity ? <span className="tabular-nums">({cart.totalQuantity})</span> : null}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={closeCart}
            className="group/close inline-flex h-12 cursor-pointer items-center gap-3 rounded-ui border border-fg/15 pr-4 pl-5 transition-[border-color,background-color] duration-300 hover:border-fg/35 hover:bg-fg/[0.04]"
          >
            <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase">Close</span>
            <span
              aria-hidden="true"
              className="relative size-4 transition-transform duration-500 group-hover/close:rotate-90"
            >
              <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
              <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
            </span>
          </button>
        </div>

        {empty ? (
          <div className="relative flex flex-1 flex-col items-center justify-center px-8 pb-24 text-center">
            <Artwork
              className={`relative mb-8 -ml-[150px] aspect-[701/212] w-[260px] transition-[opacity,translate] delay-200 duration-[1200ms] motion-reduce:transition-none ${EASE} ${
                open ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
              }`}
              light={{ src: "/images/about/cloud-drift.png" }}
              dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
              sizes="260px"
            />
            <p className="font-serif text-card text-fg">{cartCopy.emptyTitle}</p>
            <p className="mt-3 max-w-[30ch] text-body">{cartCopy.emptyBody}</p>
            <Button href="/shop" onClick={closeCart} className="mt-8">
              Browse the shop
            </Button>
          </div>
        ) : (
          <>
            <ul className="relative flex-1 overflow-y-auto overscroll-contain px-6 sm:px-10">
              {cart.lines.map((line, index) => (
                <li
                  key={line.id}
                  style={{ transitionDelay: open ? `${140 + index * 60}ms` : "0ms" }}
                  className={`flex gap-5 border-b border-divider py-6 transition-[opacity,translate] duration-700 first:pt-2 motion-reduce:transition-none ${EASE} ${
                    open ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
                  }`}
                >
                  <Link
                    href={`/shop/${line.product.collection}/${line.product.handle}`}
                    onClick={closeCart}
                    className="shop-thumb relative block aspect-[4/5] w-[84px] shrink-0 overflow-hidden rounded-ui"
                    tabIndex={-1}
                    aria-hidden="true"
                  >
                    {line.image ? (
                      <Image src={line.image.src} alt="" fill sizes="84px" className="object-contain p-2.5" />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <Link
                          href={`/shop/${line.product.collection}/${line.product.handle}`}
                          onClick={closeCart}
                          className="link-draw font-serif text-lg leading-6 text-fg"
                        >
                          {line.product.title}
                        </Link>
                        {line.variantTitle ? (
                          <p className="mt-1 font-sans text-xs tracking-[0.06em] text-fg-muted">{line.variantTitle}</p>
                        ) : null}
                      </div>
                      <p className="shrink-0 font-sans text-sm tracking-[0.04em] text-fg tabular-nums">
                        {formatMoney(line.total ?? line.price)}
                      </p>
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4">
                      <QuantityStepper
                        size="sm"
                        value={line.quantity}
                        disabled={pending}
                        label={line.product.title}
                        onChange={(quantity) => updateQuantity(line.id, quantity)}
                      />
                      <button
                        type="button"
                        disabled={pending}
                        onClick={() => removeLine(line.id)}
                        className="link-draw cursor-pointer font-sans text-xs tracking-[0.08em] text-fg-muted transition-colors hover:text-fg disabled:opacity-50"
                      >
                        Remove<span className="sr-only"> {line.product.title}</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="relative shrink-0 border-t border-divider px-6 pt-6 pb-8 sm:px-10 sm:pb-10">
              <div className="flex items-baseline justify-between">
                <p className="font-sans text-xs font-medium tracking-[0.22em] text-fg uppercase">Subtotal</p>
                <p className="font-serif text-2xl text-fg tabular-nums">{formatMoney(cart.subtotal)}</p>
              </div>
              <p className="mt-2 font-sans text-xs tracking-[0.04em] text-fg-muted">{cartCopy.note}</p>

              {error ? (
                <p role="alert" className="mt-4 font-sans text-sm text-[#b4534b] dark:text-[#f2b8b0]">
                  {error}
                </p>
              ) : null}

              {mode === "shopify" && cart.checkoutUrl ? (
                <Button href={cart.checkoutUrl} fullWidth className="mt-6" iconEnd="arrow-right" prefetch={false}>
                  {cartCopy.checkout}
                </Button>
              ) : (
                <>
                  <Button
                    fullWidth
                    className="mt-6 cursor-not-allowed opacity-60 hover:translate-y-0"
                    disabled
                    aria-describedby={`${titleId}-preview`}
                  >
                    {cartCopy.checkout}
                  </Button>
                  <p
                    id={`${titleId}-preview`}
                    className="mt-3 text-center font-sans text-xs tracking-[0.04em] text-fg-muted"
                  >
                    {cartCopy.previewNote}
                  </p>
                </>
              )}

              <button
                type="button"
                onClick={closeCart}
                className="mx-auto mt-4 block cursor-pointer font-sans text-sm tracking-[0.04em] text-fg-muted transition-colors hover:text-fg"
              >
                Continue wandering
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
}
