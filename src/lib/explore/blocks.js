/**
 * Tiny builders for Portable Text, used by the demo posts (demo.js) so they have exactly the
 * shape Sanity returns. Once Sanity is connected these aren't needed - the body comes straight
 * from the API and goes through the same <PortableText /> renderer.
 *
 * Inline markup in strings: *emphasis*, **strong**, [label](https://link).
 */

/** Typographer's quotes and apostrophes for the demo copy ("it's" → "it’s"). */
export const smart = (text) =>
  text
    .replace(/(^|[\s(\[—–-])"/g, "$1“")
    .replace(/"/g, "”")
    .replace(/(^|[\s(\[—–-])'/g, "$1‘")
    .replace(/'/g, "’");

// Fields that hold prose (everything else - slugs, paths, keys, dates - is left alone)
const PROSE = new Set(["title", "dek", "text", "caption", "heading", "attribution", "alt", "bio", "description"]);

/** Applies `smart` to every prose field in a demo document, however deeply nested. */
export function smarten(value, key) {
  if (typeof value === "string") return PROSE.has(key) ? smart(value) : value;
  if (Array.isArray(value)) return value.map((item) => smarten(item, key));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, smarten(v, k)]));
  }
  return value;
}

let seq = 0;
const key = () => `d${(seq++).toString(36)}`;

const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function parse(text) {
  const markDefs = [];
  const children = text
    .split(INLINE)
    .filter(Boolean)
    .map((part) => {
      if (part.startsWith("**")) return { _type: "span", _key: key(), text: part.slice(2, -2), marks: ["strong"] };
      if (part.startsWith("*")) return { _type: "span", _key: key(), text: part.slice(1, -1), marks: ["em"] };
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const def = { _type: "link", _key: key(), href: link[2] };
        markDefs.push(def);
        return { _type: "span", _key: key(), text: link[1], marks: [def._key] };
      }
      return { _type: "span", _key: key(), text: part, marks: [] };
    });
  return { children, markDefs };
}

const block = (style, text, extra = {}) => ({ _type: "block", _key: key(), style, ...parse(text), ...extra });

export const p = (text) => block("normal", text);
export const h2 = (text) => block("h2", text);
export const h3 = (text) => block("h3", text);
export const quote = (text) => block("blockquote", text);
export const list = (items, type = "bullet") => items.map((text) => block("normal", text, { listItem: type, level: 1 }));

/** Large centred quote that breaks the column. */
export const pull = (text, attribution) => ({ _type: "pullQuote", _key: key(), text, attribution });
/** "A prompt to carry with you" card - a journalling prompt set apart from the text. */
export const prompt = (heading, text) => ({ _type: "prompt", _key: key(), heading, text });
/** A small cloud between sections. */
export const pause = () => ({ _type: "sectionBreak", _key: key() });
/** An inline illustration with a caption. `image` is { light, dark?, alt, width, height }. */
export const figure = (image, caption, size = "column") => ({ _type: "picture", _key: key(), ...image, caption, size });
