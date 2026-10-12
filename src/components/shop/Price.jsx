import { formatMoney } from "@/lib/shop/money";

/** Price with an optional struck-through compare-at price. */
export default function Price({ price, compareAtPrice, size = "sm", className = "" }) {
  const large = size === "lg";
  return (
    <p
      className={`flex items-baseline gap-2 tabular-nums ${className}`}
      aria-hidden={size === "sm" ? "true" : undefined}
    >
      <span
        className={
          large ? "font-serif text-[1.75rem] leading-none text-fg" : "font-sans text-sm tracking-[0.04em] text-fg"
        }
      >
        {formatMoney(price)}
      </span>
      {compareAtPrice ? (
        <s className={`font-sans text-fg-muted/70 ${large ? "text-base" : "text-xs"}`}>
          <span className="sr-only">was </span>
          {formatMoney(compareAtPrice)}
        </s>
      ) : null}
    </p>
  );
}
