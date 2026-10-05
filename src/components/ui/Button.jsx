import Link from "next/link";
import Icon from "./Icon";

const VARIANTS = {
  primary:
    "border border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover hover:shadow-[0_10px_24px_-12px_var(--color-primary)]",
  inverse: "bg-inverse text-on-inverse hover:bg-inverse-hover hover:shadow-[0_10px_24px_-14px_rgb(0_0_0/0.35)]",
};

const SIZES = {
  md: "min-h-14 px-6 py-4",
  sm: "px-5 py-2",
};

/**
 * Figma button: Inter 16/20, 0.04em tracking; 4px radius (site-wide --radius-ui).
 * `icon` sits before the label, `iconEnd` after it (e.g. "arrow-right").
 * Renders a Next.js <Link> when `href` is given, otherwise a <button>.
 */
export default function Button({
  href,
  variant = "primary",
  size = "md",
  icon,
  iconEnd,
  fullWidth = false,
  className = "",
  children,
  ...props
}) {
  const classes = [
    "group/btn inline-flex items-center justify-center gap-2 rounded-ui font-sans text-base leading-5 tracking-[0.04em] whitespace-nowrap",
    "transition-[color,background-color,border-color,box-shadow,translate] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0",
    VARIANTS[variant],
    SIZES[size],
    icon ? "pl-5" : "",
    iconEnd ? "pr-5" : "",
    fullWidth ? "w-full" : "",
    className,
  ].join(" ");

  const content = (
    <>
      {icon ? <Icon name={icon} /> : null}
      {children}
      {iconEnd ? (
        <Icon name={iconEnd} className="transition-transform duration-300 ease-out group-hover/btn:translate-x-0.5" />
      ) : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  );
}
