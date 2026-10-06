/**
 * Monochrome icons exported from Figma, rendered as CSS masks so they take
 * `currentColor`. One SVG file therefore serves every theme - set the colour
 * with a text utility (e.g. `text-icon`) on the icon or any parent.
 */
const ICONS = {
  moon: { src: "/images/icons/moon.svg", width: 24, height: 24 },
  sun: { src: "/images/icons/sun.svg", width: 24, height: 24 },
  handbag: { src: "/images/icons/handbag.svg", width: 24, height: 24 },
  notebook: { src: "/images/icons/notebook.svg", width: 40, height: 42 },
  user: { src: "/images/icons/user.svg", width: 40, height: 40 },
  file: { src: "/images/icons/file.svg", width: 36, height: 42 },
  cookie: { src: "/images/icons/cookie.svg", width: 42, height: 42 },
  "cookie-blob": { src: "/images/icons/cookie-blob.svg", width: 38.8095, height: 40.1463 },
  // "the STOEN mind" lettering traced from the brand logo (public/images/shared/logo.png),
  // so it matches the logo exactly. The brand typefaces (Haboro + Libre Baskerville Italic)
  // aren't self-hostable here, and the logo's letterforms are custom-proportioned anyway.
  "arrow-right": { src: "/images/icons/arrow-right.svg", width: 24, height: 24 },
  "caret-down": { src: "/images/icons/caret-down.svg", width: 24, height: 24 },
  check: { src: "/images/icons/check.svg", width: 24, height: 24 },
  mail: { src: "/images/icons/mail.svg", width: 40, height: 40 },
  "book-open": { src: "/images/icons/book-open.svg", width: 40, height: 40 },
  "shopping-bag": { src: "/images/icons/shopping-bag.svg", width: 40, height: 40 },
  "map-pin": { src: "/images/icons/map-pin.svg", width: 40, height: 40 },
  "mail-blob": { src: "/images/icons/mail-blob.svg", width: 40, height: 40 },
  "book-open-blob": { src: "/images/icons/book-open-blob.svg", width: 40, height: 40 },
  "shopping-bag-blob": { src: "/images/icons/shopping-bag-blob.svg", width: 40, height: 40 },
  "map-pin-blob": { src: "/images/icons/map-pin-blob.svg", width: 40, height: 40 },
  wordmark: { src: "/images/shared/wordmark.svg", width: 187, height: 26 },
};

export default function Icon({ name, width, height, className = "", style }) {
  const icon = ICONS[name];
  if (!icon) throw new Error(`Unknown icon "${name}"`);

  return (
    <span
      aria-hidden="true"
      className={`icon-mask ${className}`}
      style={{
        "--icon-src": `url(${icon.src})`,
        width: width ?? icon.width,
        height: height ?? icon.height,
        ...style,
      }}
    />
  );
}
