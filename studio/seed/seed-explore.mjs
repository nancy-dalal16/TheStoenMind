/**
 * Loads the demo Explore content (16 stories, 5 topics, 4 authors and the Explore page
 * settings) into Sanity, uploading the site's own pictures from /public as it goes.
 *
 *   npx sanity exec studio/seed/seed-explore.mjs --with-user-token
 *
 * Safe to run again: documents keep fixed ids (createOrReplace) and Sanity stores each
 * picture only once. It overwrites edits made to these demo documents in the Studio, so only
 * re-run it on purpose.
 */
import { createReadStream, readFileSync } from "node:fs";
import path from "node:path";
import { getCliClient } from "sanity/cli";

const client = getCliClient({ apiVersion: "2025-02-19" });
const root = process.cwd();
const docs = JSON.parse(readFileSync(path.join(root, "studio/seed/explore-demo.json"), "utf8"));

// 1. Upload every picture once
const files = [...new Set(JSON.stringify(docs).match(/"_upload":"([^"]+)"/g).map((m) => m.slice(11, -1)))];
const assets = new Map();
for (const [i, file] of files.entries()) {
  const local = path.join(root, "public", file);
  const asset = await client.assets.upload("image", createReadStream(local), { filename: path.basename(local) });
  assets.set(file, asset._id);
  console.log(`picture ${i + 1}/${files.length}  ${file}`);
}

// 2. Swap the placeholders for asset references
const withAssets = (value) => {
  if (Array.isArray(value)) return value.map(withAssets);
  if (value && typeof value === "object") {
    if (value._upload) return { _type: "reference", _ref: assets.get(value._upload) };
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, withAssets(v)]));
  }
  return value;
};

// 3. Write all documents in one transaction (published straight away)
const tx = client.transaction();
for (const doc of docs) tx.createOrReplace(withAssets(doc));
await tx.commit({ visibility: "async" });
console.log(`Done: ${docs.length} documents and ${files.length} pictures are in the "${client.config().dataset}" dataset.`);
