import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import * as shopify from "@/lib/shop/shopify";

/**
 * Cart proxy for the Shopify Storefront Cart API. The cart id lives in an httpOnly cookie;
 * the browser only ever sees the normalised cart (lib/shop/shopify.js → normaliseCart).
 *
 *   GET                                 → current cart (or null)
 *   POST { action: "add",    lines: [{ merchandiseId, quantity }] }
 *   POST { action: "update", lines: [{ id, quantity }] }
 *   POST { action: "remove", lineIds: [id] }
 *
 * In preview mode (no Shopify env vars) the cart lives in the browser instead (CartProvider).
 */
export const dynamic = "force-dynamic";

const COOKIE = "stoen-cart";
const MAX_AGE = 60 * 60 * 24 * 14; // Shopify carts last about 10 days of inactivity

function respond(cart) {
  const response = NextResponse.json({ cart });
  if (cart?.id) {
    response.cookies.set(COOKIE, cart.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: MAX_AGE,
    });
  }
  return response;
}

export async function GET() {
  if (!shopify.shopifyConfigured) return NextResponse.json({ cart: null, mode: "preview" });
  const cartId = (await cookies()).get(COOKIE)?.value;
  if (!cartId) return NextResponse.json({ cart: null });
  try {
    return respond(await shopify.getCart(cartId));
  } catch (error) {
    console.error(error);
    return NextResponse.json({ cart: null });
  }
}

export async function POST(request) {
  if (!shopify.shopifyConfigured) {
    return NextResponse.json({ error: "Shopify is not configured" }, { status: 503 });
  }

  const body = await request.json().catch(() => ({}));
  const cartId = (await cookies()).get(COOKIE)?.value;

  const valid = (n) => Number.isInteger(n) && n >= 0 && n <= 99;

  try {
    switch (body.action) {
      case "add": {
        const lines = (body.lines ?? [])
          .filter((l) => typeof l.merchandiseId === "string" && valid(l.quantity) && l.quantity > 0)
          .map(({ merchandiseId, quantity }) => ({ merchandiseId, quantity }));
        if (!lines.length) return NextResponse.json({ error: "Nothing to add" }, { status: 400 });
        // An expired cart makes cartLinesAdd fail - start a fresh one in that case.
        if (cartId) {
          try {
            return respond(await shopify.addLines(cartId, lines));
          } catch (error) {
            console.warn("Cart expired, creating a new one:", error.message);
          }
        }
        return respond(await shopify.createCart(lines));
      }
      case "update": {
        if (!cartId) return NextResponse.json({ cart: null });
        const lines = (body.lines ?? [])
          .filter((l) => typeof l.id === "string" && valid(l.quantity))
          .map(({ id, quantity }) => ({ id, quantity }));
        return respond(await shopify.updateLines(cartId, lines));
      }
      case "remove": {
        if (!cartId) return NextResponse.json({ cart: null });
        const lineIds = (body.lineIds ?? []).filter((id) => typeof id === "string");
        return respond(await shopify.removeLines(cartId, lineIds));
      }
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "We couldn't update your bag. Please try again." }, { status: 502 });
  }
}
