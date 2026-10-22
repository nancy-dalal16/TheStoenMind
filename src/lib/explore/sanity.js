import "server-only";

/**
 * Sanity Content Lake client for /explore - plain `fetch` against the GROQ HTTP API, so no
 * extra packages are needed. Everything is normalised into the same shape as demo.js.
 *
 * .env.local:
 *   SANITY_PROJECT_ID      (required to switch on - from sanity.io/manage)
 *   SANITY_DATASET         default "production"
 *   SANITY_API_VERSION     default "2025-02-19"
 *   SANITY_API_READ_TOKEN  only for a private dataset (reads through the live API instead of the CDN)
 *
 * The matching Studio schema is in /sanity/schemaTypes.
 */

const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const apiVersion = process.env.SANITY_API_VERSION || "2025-02-19";
const token = process.env.SANITY_API_READ_TOKEN;

export const sanityConfigured = Boolean(projectId);

/** Seconds a response is reused before Next.js fetches it again. */
export const REVALIDATE = 60;

async function query(groq, params = {}) {
  const host = token ? "api.sanity.io" : "apicdn.sanity.io";
  const search = new URLSearchParams({ query: groq, perspective: "published" });
  for (const [name, value] of Object.entries(params)) search.set(`$${name}`, JSON.stringify(value ?? null));

  const response = await fetch(`https://${projectId}.${host}/v${apiVersion}/data/query/${dataset}?${search}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    next: { revalidate: REVALIDATE, tags: ["explore"] },
  });
  if (!response.ok) throw new Error(`Sanity ${response.status}: ${await response.text()}`);
  return (await response.json()).result;
}

/* ── GROQ ────────────────────────────────────────────────────────────── */

const IMAGE = `{
  "src": asset->url,
  "width": asset->metadata.dimensions.width,
  "height": asset->metadata.dimensions.height,
  hotspot, alt, caption, credit
}`;

const CARD = `
  _id, title, "slug": slug.current, dek, publishedAt, featured, editorsPick, coverFit,
  "topic": topic->{ title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, role, bio },
  "cover": coverImage ${IMAGE},
  "coverNight": coverImageNight ${IMAGE},
  "words": length(string::split(pt::text(body), " "))
`;

const LIVE = `_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;

/* ── Normalisers ─────────────────────────────────────────────────────── */

const position = (hotspot) =>
  hotspot ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` : undefined;

const variant = (image) =>
  image?.src ? { src: image.src, width: image.width, height: image.height, position: position(image.hotspot) } : null;

function normaliseImage(image, night, fit = "cover") {
  const light = variant(image);
  if (!light) return null;
  return { alt: image.alt ?? "", fit: fit === "contain" ? "contain" : "cover", light, dark: variant(night) };
}

function normalisePost(doc) {
  if (!doc) return null;
  const image = normaliseImage(doc.cover, doc.coverNight, doc.coverFit);
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    dek: doc.dek ?? "",
    topic: doc.topic ?? null,
    author: doc.author ?? null,
    publishedAt: doc.publishedAt,
    featured: Boolean(doc.featured),
    pick: Boolean(doc.editorsPick),
    cover: image ? { ...image, caption: doc.cover?.caption ?? "", credit: doc.cover?.credit ?? "" } : null,
    words: doc.words ?? 0,
    body: doc.body
      ? doc.body.map((block) =>
          block._type === "image"
            ? { _type: "image", _key: block._key, ...normaliseImage(block, block.night, block.fit), caption: block.caption }
            : block,
        )
      : undefined,
  };
}

/* ── Queries ─────────────────────────────────────────────────────────── */

export async function getTopics() {
  const topics = await query(
    `*[_type == "topic" && defined(slug.current)] | order(coalesce(order, 99) asc, title asc){ title, "slug": slug.current, description }`,
  );
  return topics ?? [];
}

export async function getPosts({ topic = null } = {}) {
  const posts = await query(
    `*[${LIVE} && ($topic == null || topic->slug.current == $topic)] | order(publishedAt desc){ ${CARD} }`,
    { topic },
  );
  return (posts ?? []).map(normalisePost);
}

export async function getPost(slug) {
  const post = await query(
    `*[${LIVE} && slug.current == $slug][0]{
      ${CARD},
      body[]{
        ...,
        _type == "image" => { ..., "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height,
          "night": night{ "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height } }
      }
    }`,
    { slug },
  );
  return normalisePost(post);
}
