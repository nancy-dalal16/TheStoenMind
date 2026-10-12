"use client";

import Icon from "@/components/ui/Icon";
import { openCart, useCart } from "./cartStore";

/** Header bag button: a quiet circle beside the theme toggle, with a count that pops in. */
export default function CartButton({ className = "" }) {
  const { cart, open } = useCart();
  const count = cart.totalQuantity;

  return (
    <button
      type="button"
      onClick={openCart}
      aria-haspopup="dialog"
      aria-expanded={open}
      className={`bag-button relative inline-flex size-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-fg/15 bg-bg text-fg shadow-[0_6px_20px_-12px_rgb(0_0_0/0.35)] transition-[border-color,transform] duration-300 hover:border-fg/35 active:scale-95 ${className}`}
    >
      <Icon name="handbag" className="bag-glyph" />
      <span className="sr-only">{count ? `Bag, ${count} ${count === 1 ? "item" : "items"}` : "Bag, empty"}</span>
      {count ? (
        <span key={count} aria-hidden="true" className="bag-count">
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </button>
  );
}
