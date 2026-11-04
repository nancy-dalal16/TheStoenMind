/**
 * Options shared by the Studio (schema + editor previews) and the site (renderers):
 * text sizes, colours and typefaces for the text editor, and the size presets for pictures,
 * GIFs, videos and embeds. Plain JS so both sides can import it.
 */

/* ── Text editor ─────────────────────────────────────────────────────── */

/** Font sizes offered in the text editor, in px (the body text is about 20 px). */
export const FONT_SIZES = [10, 12, 14, 16, 18, 20, 22, 24, 28, 32, 36, 40, 48, 56, 64, 72, 88, 96, 120];

const FONT_SIZE_NAMES = { 12: "tiny", 14: "small", 16: "small", 20: "body", 24: "large", 32: "heading", 48: "big", 72: "display" };

export const FONT_SIZE_LIST = [
  ...FONT_SIZES.map((px) => ({ title: `${px} px${FONT_SIZE_NAMES[px] ? ` · ${FONT_SIZE_NAMES[px]}` : ""}`, value: String(px) })),
  { title: "Custom…", value: "custom" },
];

/** px for a font-size annotation ({ size, custom }), or null. */
export function fontSizePx(mark) {
  const px = mark?.size === "custom" ? Number(mark?.custom) : Number(mark?.size);
  return Number.isFinite(px) && px > 0 ? Math.min(Math.max(px, 6), 240) : null;
}

/**
 * CSS font-size for a px value. Small sizes are fixed (in rem, so browser zoom still works);
 * from 28 px up they shrink on phones (down to 60 %) and reach the chosen size on wide screens.
 */
export function fontSizeCss(px) {
  if (!px) return undefined;
  const rem = (n) => `${+(n / 16).toFixed(4)}rem`;
  if (px < 28) return rem(px);
  return `clamp(${rem(Math.max(px * 0.6, 22))}, ${+((px / 1440) * 100).toFixed(3)}vw + ${rem(px * 0.25)}, ${rem(px)})`;
}

/** Text colours follow the site's palette, so they also work in night mode. */
export const TEXT_COLORS = [
  { title: "Ink (headings)", value: "ink", css: "var(--fg)", swatch: "#333333" },
  { title: "Body grey", value: "body", css: "var(--fg-body)", swatch: "#4d4d4d" },
  { title: "Earth", value: "earth", css: "var(--fg-muted)", swatch: "#615b51" },
  { title: "Slate blue", value: "slate", css: "var(--eyebrow)", swatch: "#6e8488" },
  { title: "Teal", value: "teal", css: "var(--ex-text-teal)", swatch: "#6e9a9f" },
  { title: "Sky", value: "sky", css: "var(--palette-sky)", swatch: "#9bbabf" },
  { title: "Tide blue", value: "tide", css: "var(--ex-text-tide)", swatch: "#205a79" },
  { title: "Custom colour…", value: "custom", css: null, swatch: null },
];

const HEX = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

/** CSS colour for a text-colour annotation ({ color, custom }), or undefined. */
export function textColorCss(mark) {
  if (mark?.color === "custom") return HEX.test(mark?.custom ?? "") ? mark.custom : undefined;
  return TEXT_COLORS.find((c) => c.value === mark?.color)?.css ?? undefined;
}

/** Swatch for the Studio editor preview. */
export function textColorSwatch(mark) {
  if (mark?.color === "custom") return HEX.test(mark?.custom ?? "") ? mark.custom : undefined;
  return TEXT_COLORS.find((c) => c.value === mark?.color)?.swatch ?? undefined;
}

export const FONT_FAMILIES = [
  { title: "Serif (Abhaya Libre)", value: "serif", css: "var(--font-serif)", studio: "'Abhaya Libre', Georgia, serif" },
  { title: "Sans serif (Inter)", value: "sans", css: "var(--font-sans)", studio: "Inter, system-ui, sans-serif" },
  { title: "Typewriter (monospace)", value: "mono", css: "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace", studio: "ui-monospace, Menlo, Consolas, monospace" },
];

export const fontFamilyCss = (mark) => FONT_FAMILIES.find((f) => f.value === mark?.family)?.css;

export const TEXT_ALIGNS = [
  { title: "Left", value: "left" },
  { title: "Centre", value: "center" },
  { title: "Right", value: "right" },
  { title: "Justify", value: "justify" },
];

export const LINE_SPACINGS = [
  { title: "Tight", value: "tight", css: 1.3 },
  { title: "Normal", value: "normal", css: undefined },
  { title: "Airy", value: "airy", css: 1.9 },
];

/* ── Picture / video sizes ───────────────────────────────────────────── */

/**
 * Fixed sizes are frames of exactly that many CSS pixels (they shrink to fit on small phones);
 * "column", "wide" and "full" follow the page layout and keep the picture's own shape.
 */
export const MEDIA_SIZES = [
  { title: "200 × 200 px · very small square", value: "200x200", w: 200, h: 200 },
  { title: "200 × 300 px · very small portrait", value: "200x300", w: 200, h: 300 },
  { title: "300 × 200 px · very small landscape", value: "300x200", w: 300, h: 200 },
  { title: "320 × 180 px · very small widescreen (16:9)", value: "320x180", w: 320, h: 180 },
  { title: "300 × 300 px · small square", value: "300x300", w: 300, h: 300 },
  { title: "300 × 400 px · small portrait", value: "300x400", w: 300, h: 400 },
  { title: "400 × 300 px · small landscape", value: "400x300", w: 400, h: 300 },
  { title: "480 × 270 px · small widescreen (16:9)", value: "480x270", w: 480, h: 270 },
  { title: "400 × 400 px · medium square", value: "400x400", w: 400, h: 400 },
  { title: "400 × 500 px · medium portrait", value: "400x500", w: 400, h: 500 },
  { title: "500 × 375 px · medium landscape", value: "500x375", w: 500, h: 375 },
  { title: "640 × 360 px · medium widescreen (16:9)", value: "640x360", w: 640, h: 360 },
  { title: "600 × 600 px · large square", value: "600x600", w: 600, h: 600 },
  { title: "600 × 400 px · large landscape", value: "600x400", w: 600, h: 400 },
  { title: "800 × 450 px · large widescreen (16:9)", value: "800x450", w: 800, h: 450 },
  { title: "Text width", value: "column" },
  { title: "Wide", value: "wide" },
  { title: "Full width", value: "full" },
  { title: "Custom size…", value: "custom" },
];

export const MEDIA_SIZE_LIST = MEDIA_SIZES.map(({ title, value }) => ({ title, value }));

export const MEDIA_ALIGNS = [
  { title: "Centre", value: "center" },
  { title: "Left", value: "left" },
  { title: "Right", value: "right" },
  { title: "Left, text flows around it", value: "wrapLeft" },
  { title: "Right, text flows around it", value: "wrapRight" },
];

/** True for sizes that need a frame size (presets and custom). */
export const isFixedSize = (size) => Boolean(size) && !["column", "wide", "full", "auto"].includes(size);

/**
 * The frame for a fixed size: { w, h? } in px (h missing = keep the picture's own shape),
 * or null for column / wide / full.
 */
export function mediaBox({ size, customWidth, customHeight } = {}) {
  if (size === "custom") {
    const w = Number(customWidth);
    if (!Number.isFinite(w) || w <= 0) return null;
    const h = Number(customHeight);
    return { w: Math.round(w), h: Number.isFinite(h) && h > 0 ? Math.round(h) : undefined };
  }
  const preset = MEDIA_SIZES.find((s) => s.value === size && s.w);
  return preset ? { w: preset.w, h: preset.h } : null;
}

/* ── Picture shapes (aspect ratios) ──────────────────────────────────── */

/**
 * The frame's shape. "auto" keeps what each spot does today (cards follow their layout, the
 * cover is 16:10, pictures in a story keep their own shape); "original" always uses the
 * picture's own proportions; "custom" reads a W:H the editor types (e.g. 5:4 or 1200x800).
 */
export const MEDIA_SHAPES = [
  { title: "Default for this spot", value: "auto" },
  { title: "The picture's own shape (no crop)", value: "original" },
  { title: "Square · 1:1", value: "1:1" },
  { title: "Portrait · 4:5", value: "4:5" },
  { title: "Portrait · 3:4", value: "3:4" },
  { title: "Portrait · 2:3", value: "2:3" },
  { title: "Tall · 9:16 (phone screen)", value: "9:16" },
  { title: "Landscape · 5:4", value: "5:4" },
  { title: "Landscape · 4:3", value: "4:3" },
  { title: "Landscape · 3:2", value: "3:2" },
  { title: "Landscape · 16:10", value: "16:10" },
  { title: "Widescreen · 16:9", value: "16:9" },
  { title: "Panorama · 2:1", value: "2:1" },
  { title: "Cinema · 21:9", value: "21:9" },
  { title: "Banner · 3:1", value: "3:1" },
  { title: "Custom shape…", value: "custom" },
];

export const MEDIA_SHAPE_LIST = MEDIA_SHAPES.map(({ title, value }) => ({ title, value }));

/** "5:4", "5/4", "1200x800" or "1200 × 800" → { w, h } (or null). */
export function parseShape(text) {
  const m = String(text ?? "").trim().match(/^(\d+(?:\.\d+)?)\s*[:/x×]\s*(\d+(?:\.\d+)?)$/i);
  if (!m) return null;
  const w = Number(m[1]);
  const h = Number(m[2]);
  if (!(w > 0 && h > 0) || w / h > 10 || h / w > 10) return null;
  return { w, h };
}

/**
 * CSS aspect-ratio for a node's shape ({ shape, customShape }), or undefined for "auto".
 * `natural` is the picture's own "w / h" (used by "original").
 */
export function shapeRatio({ shape, customShape } = {}, natural) {
  if (!shape || shape === "auto") return undefined;
  if (shape === "original") return natural;
  const parsed = shape === "custom" ? parseShape(customShape) : parseShape(shape);
  return parsed ? `${parsed.w} / ${parsed.h}` : undefined;
}

/* ── Cover sizes (top of a story) ────────────────────────────────────── */

/**
 * Featured image on story cards: "auto" fills the card's picture frame (as before); a fixed or
 * custom size makes the picture exactly that big inside the card (never wider than the card).
 */
export const CARD_SIZE_LIST = [
  { title: "Fill the card (standard)", value: "auto" },
  ...MEDIA_SIZES.filter((s) => s.w).map(({ title, value }) => ({ title, value })),
  { title: "Custom size…", value: "custom" },
];

/** Same values as MEDIA_SIZES (so mediaBox works), but "wide" is the 1120 px cover width. */
export const COVER_SIZE_LIST = [
  { title: "Wide · up to 1120 px (standard)", value: "wide" },
  { title: "Text width · up to 672 px", value: "column" },
  { title: "Full bleed · edge to edge", value: "full" },
  ...MEDIA_SIZES.filter((s) => s.w).map(({ title, value }) => ({ title, value })),
  { title: "Custom size…", value: "custom" },
];
