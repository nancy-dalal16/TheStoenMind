"use client";

import { set, unset } from "sanity";
import { FONT_FAMILIES, fontSizePx, TEXT_COLORS, textColorSwatch } from "../../../src/lib/explore/editorOptions";

/*
 * Pieces for the story text editor: toolbar icons, and how the extra styles, decorators and
 * annotations (font size, colour, typeface) look while you write - close to the live site.
 */

const glyph = (label, style) =>
  function Glyph() {
    return (
      <span aria-hidden="true" style={{ display: "inline-block", minWidth: "1.1em", fontSize: 15, lineHeight: 1, fontWeight: 600, textAlign: "center", ...style }}>
        {label}
      </span>
    );
  };

/* ── Toolbar icons ───────────────────────────────────────────────────── */

export const SupIcon = glyph(
  <>
    x<sup style={{ fontSize: "0.65em" }}>2</sup>
  </>,
);
export const SubIcon = glyph(
  <>
    x<sub style={{ fontSize: "0.65em" }}>2</sub>
  </>,
);
export const SmallCapsIcon = glyph("Aᴀ", { fontWeight: 500 });
export const TypefaceIcon = glyph("Ff", { fontFamily: "Georgia, serif", fontWeight: 400, fontSize: 17 });

export function FontSizeIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <path d="M5 18.5 9.2 7h1.6l4.2 11.5M6.5 14.5h7" stroke="currentColor" strokeWidth="1.2" />
      <path d="M15.5 18.5 17.9 12h1.2l2.4 6.5M16.4 16.3h4.2" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  );
}

export function TextColorIcon() {
  return (
    <svg width="1em" height="1em" viewBox="0 0 25 25" fill="none" aria-hidden="true">
      <path d="M8 16 12 5.5h1L17 16M9.3 12.5h6.4" stroke="currentColor" strokeWidth="1.2" />
      <rect x="6" y="18.5" width="13" height="2.5" rx="1" fill="#6e9a9f" />
    </svg>
  );
}

/* ── Decorators, as seen in the editor ───────────────────────────────── */

export const HighlightMark = ({ children }) => (
  <mark style={{ background: "rgb(244 223 141 / 0.6)", color: "inherit", borderRadius: 2, padding: "0 1px" }}>{children}</mark>
);
export const SupMark = ({ children }) => <sup>{children}</sup>;
export const SubMark = ({ children }) => <sub>{children}</sub>;
export const SmallCapsMark = ({ children }) => <span style={{ fontVariant: "small-caps", letterSpacing: "0.04em" }}>{children}</span>;

/* ── Annotations, as seen in the editor ──────────────────────────────── */

// The editor's own text is ~16 px; big sizes are scaled down a little so lines stay readable.
const editorSize = (px) => (px > 40 ? 40 + (px - 40) * 0.35 : px);

export function FontSizeMark(props) {
  const px = fontSizePx(props.value);
  return (
    <span style={px ? { fontSize: `${editorSize(px)}px`, lineHeight: 1.25 } : undefined} title={px ? `${px} px` : undefined}>
      {props.renderDefault(props)}
    </span>
  );
}

export function TextColorMark(props) {
  const color = textColorSwatch(props.value);
  return <span style={color ? { color } : undefined}>{props.renderDefault(props)}</span>;
}

export function TypefaceMark(props) {
  const family = FONT_FAMILIES.find((f) => f.value === props.value?.family)?.studio;
  return <span style={family ? { fontFamily: family } : undefined}>{props.renderDefault(props)}</span>;
}

/* ── Paragraph styles, as seen in the editor ─────────────────────────── */

export const LeadStyle = ({ children }) => <p style={{ fontSize: "1.25em", lineHeight: 1.5, margin: 0 }}>{children}</p>;
export const SmallStyle = ({ children }) => <p style={{ fontSize: "0.85em", lineHeight: 1.5, margin: 0, opacity: 0.85 }}>{children}</p>;
export const DisplayStyle = ({ children }) => (
  <p style={{ fontFamily: "'Abhaya Libre', Georgia, serif", fontSize: "2.4em", lineHeight: 1.1, margin: 0 }}>{children}</p>
);
export const LabelStyle = ({ children }) => (
  <p style={{ fontSize: "0.78em", letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600, margin: 0, color: "#6e8488" }}>{children}</p>
);

/* ── Colour picker (swatches) for the text-colour annotation ─────────── */

export function ColorSwatchInput(props) {
  const { value, onChange, readOnly } = props;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {TEXT_COLORS.map((c) => {
        const active = value === c.value;
        return (
          <button
            key={c.value}
            type="button"
            disabled={readOnly}
            onClick={() => onChange(active ? unset() : set(c.value))}
            title={c.title}
            aria-pressed={active}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 10px 6px 6px",
              borderRadius: 999,
              border: `1px solid ${active ? "#03446a" : "#d1dfe2"}`,
              background: active ? "#e0eaeb" : "#fff",
              font: "inherit",
              fontSize: 13,
              cursor: "pointer",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background: c.swatch ?? "conic-gradient(#e57373, #ffd54f, #81c784, #64b5f6, #ba68c8, #e57373)",
                boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.12)",
              }}
            />
            {c.title}
          </button>
        );
      })}
    </div>
  );
}
