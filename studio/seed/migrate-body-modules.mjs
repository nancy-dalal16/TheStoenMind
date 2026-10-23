/**
 * One-off: turns story bodies written as one long text (Portable Text) into the module list
 * the Studio now uses - runs of paragraphs become a "Text" module, everything else (pictures,
 * quotes, prompts, breaks…) becomes its own module. Safe to run again: stories already in
 * modules are skipped.
 *
 *   npx sanity exec studio/seed/migrate-body-modules.mjs --with-user-token
 */
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-02-19" });
const key = () => Math.random().toString(36).slice(2, 12);

export function toModules(body = []) {
  const out = [];
  for (const block of body) {
    if (block._type === "block") {
      const prev = out.at(-1);
      if (prev?._type === "textBlock") prev.content.push(block);
      else out.push({ _type: "textBlock", _key: key(), content: [block] });
    } else if (block._type === "image") {
      out.push({ ...block, _type: "picture" });
    } else {
      out.push(block);
    }
  }
  return out;
}

const docs = await client.fetch(`*[_type == "post" && count(body[_type == "block"]) > 0]{ _id, _rev, body }`, {}, { perspective: "raw" });
if (!docs.length) {
  console.log("Nothing to do - every story already uses modules.");
} else {
  const tx = client.transaction();
  for (const doc of docs) tx.patch(doc._id, (p) => p.ifRevisionId(doc._rev).set({ body: toModules(doc.body) }));
  await tx.commit({ visibility: "async" });
  console.log(`Converted ${docs.length} ${docs.length === 1 ? "story" : "stories"} to modules.`);
}
