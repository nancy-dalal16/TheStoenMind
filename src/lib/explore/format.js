/** "20 October 2026" (Indian English reads day-first, as the rest of the site does). */
export function formatDate(iso, { short = false } = {}) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: short ? "short" : "long",
    year: "numeric",
    timeZone: "Asia/Kolkata",
  }).format(new Date(iso));
}

/** Words in a Portable Text body (text blocks, pull quotes and prompts). */
export function wordCount(body = []) {
  const text = body
    .map((block) => {
      if (block._type === "block") return block.children?.map((c) => c.text ?? "").join("") ?? "";
      if (block._type === "pullQuote") return block.text ?? "";
      if (block._type === "prompt") return `${block.heading ?? ""} ${block.text ?? ""}`;
      return "";
    })
    .join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

/** Minutes at an unhurried 200 words a minute; never less than one. */
export const readingTime = (words) => Math.max(1, Math.round(words / 200));
