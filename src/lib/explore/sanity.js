import "server-only";
import { mediaBox } from "./editorOptions";

/**
 * Sanity Content Lake client for /explore - plain `fetch` against the GROQ HTTP API, so no
 * extra packages are needed. Everything is normalised into the same shape as demo.js.
 *
 * .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID  default "wlwey37b" (the thestoenmind project; or SANITY_PROJECT_ID)
 *   NEXT_PUBLIC_SANITY_DATASET     default "production"
 *   SANITY_API_VERSION             default "2025-02-19"
 *   SANITY_API_READ_TOKEN  only for a private dataset (reads through the live API instead of the CDN)
 *
 * The Studio (schema, menu, dashboard) is in /studio and runs at /studio on the site.
 */

// Not a secret - built in so the live site reads the Studio without extra Vercel settings
const projectId = process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "wlwey37b";
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

// An image asset with its size; `mime` tells GIF/SVG apart (they skip Next's optimiser).
const ASSET = `"src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, "mime": asset->mimeType, hotspot`;
// A "picture": the day image, its optional night version, fit, size and words
const PICTURE = `{ ${ASSET}, alt, caption, credit, fit, size, customWidth, customHeight, align, "night": night{ ${ASSET} } }`;
const FILE = `{ "src": asset->url, "mime": asset->mimeType, "size": asset->size }`;
const VIDEO = `{ "file": file${FILE}, "poster": poster{ ${ASSET} }, playback, title, caption, size, customWidth, customHeight, align }`;

const CARD = `
  _id, title, "slug": slug.current, dek, publishedAt, featured, editorsPick,
  "topic": topic->{ title, "slug": slug.current },
  "author": author->{ name, "slug": slug.current, role, bio, "photo": photo{ ${ASSET}, alt } },
  "featuredImage": featuredImage${PICTURE},
  "cover": cover${PICTURE},
  // Story text lives in Text modules (older stories: straight in the body)
  "words": length(string::split(pt::text(body[_type == "textBlock"].content[]), " ")) + length(string::split(pt::text(body), " "))
`;

const FULL = `
  ${CARD},
  seoTitle, seoDescription, "shareImage": shareImage{ ${ASSET} },
  "coverVideo": coverVideo${VIDEO},
  body[]{
    ...,
    _type == "textBlock" => { "content": content[]{ ..., markDefs[]{ ... } } },
    _type == "picture" => ${PICTURE},
    _type == "gallery" => { ..., "images": images[]{ _key, ${ASSET}, alt, caption } },
    _type == "video" => ${VIDEO},
    _type == "audio" => { ..., "file": file${FILE}, "artwork": artwork{ ${ASSET} } },
    _type == "imageText" => { ..., "image": image{ ${ASSET}, alt }, "night": night{ ${ASSET} } },
    _type == "productLink" => { ..., "image": image{ ${ASSET}, alt } },
    _type == "imagePair" => { ..., "images": images[]{ _key, ${ASSET}, alt, caption } },
    _type == "gif" => { ..., ${ASSET} },
    _type == "storyLink" => { ..., "story": story->{ ${CARD} } },
    markDefs[]{ ... }
  }
`;

const LIVE = `_type == "post" && defined(slug.current) && defined(publishedAt) && publishedAt <= now()`;

/* ── Normalisers ─────────────────────────────────────────────────────── */

const position = (hotspot) =>
  hotspot ? `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%` : undefined;

/** One image variant: { src, width, height, position?, animated? } */
const variant = (image) =>
  image?.src
    ? {
        src: image.src,
        width: image.width,
        height: image.height,
        position: position(image.hotspot),
        // GIFs keep their animation and SVGs stay vector: both skip Next's image optimiser
        unoptimized: image.mime === "image/gif" || image.mime === "image/svg+xml" || /\.(gif|svg)(\?|$)/i.test(image.src),
      }
    : null;

/** Size fields → { size, box, align }: box = { w, h? } for the fixed / custom sizes. */
const sizing = (node, fallback) => {
  const box = mediaBox(node);
  return { size: box ? "fixed" : ["column", "wide", "full"].includes(node.size) ? node.size : fallback, box, align: node.align ?? "center" };
};

/** A picture → { alt, fit, size, box, align, light, dark, caption, credit } (null without an image) */
export function normalisePicture(picture, fallbackFit = "cover") {
  const light = variant(picture);
  if (!light) return null;
  return {
    alt: picture.alt ?? "",
    fit: (picture.fit ?? fallbackFit) === "contain" ? "contain" : "cover",
    ...sizing(picture, "column"),
    light,
    dark: variant(picture.night),
    caption: picture.caption ?? "",
    credit: picture.credit ?? "",
  };
}

function normaliseVideo(video) {
  if (!video?.file?.src) return null;
  return {
    src: video.file.src,
    mime: video.file.mime ?? "video/mp4",
    poster: variant(video.poster),
    loop: video.playback === "loop",
    title: video.title ?? "",
    caption: video.caption ?? "",
    ...sizing(video, "wide"),
  };
}

function normaliseBlock(block) {
  switch (block._type) {
    case "picture": {
      const image = normalisePicture(block);
      return image ? { _type: "picture", _key: block._key, ...image } : null;
    }
    case "gallery":
      return {
        _type: "gallery",
        _key: block._key,
        columns: block.columns ?? 2,
        caption: block.caption ?? "",
        images: (block.images ?? []).map((image) => ({ _key: image._key, ...normalisePicture(image) })).filter((i) => i.light),
      };
    case "video": {
      const video = normaliseVideo(block);
      return video ? { _type: "video", _key: block._key, ...video } : null;
    }
    case "audio":
      return block.file?.src
        ? {
            _type: "audio",
            _key: block._key,
            src: block.file.src,
            mime: block.file.mime ?? "audio/mpeg",
            title: block.title ?? "",
            subtitle: block.subtitle ?? "",
            artwork: variant(block.artwork),
            transcript: block.transcript ?? "",
          }
        : null;
    case "imageText":
      return {
        ...block,
        image: block.image?.src ? normalisePicture({ ...block.image, night: block.night, fit: "cover" }) : null,
      };
    case "gif": {
      const image = normalisePicture({ ...block, fit: "cover" });
      return image ? { _type: "picture", _key: block._key, ...image } : null;
    }
    case "embed":
      return { ...block, ...sizing(block, "wide") };
    case "imagePair":
      return {
        ...block,
        images: (block.images ?? []).map((image) => ({ _key: image._key, ...normalisePicture({ ...image, fit: "cover" }) })).filter((i) => i.light),
      };
    case "productLink":
      return { ...block, image: variant(block.image), alt: block.image?.alt ?? "" };
    case "storyLink": {
      const story = block.story ? normalisePost(block.story) : null;
      return story ? { ...block, story: { ...story, readingTime: Math.max(1, Math.round((story.words || 0) / 200)) } } : null;
    }
    default:
      return block;
  }
}

/** Explore page "Extra sections" → the shapes components/explore/ExploreSections.jsx renders. */
function normaliseSection(section) {
  switch (section._type) {
    case "pictureSection":
      return { ...section, picture: normalisePicture(section.picture) };
    case "storiesSection":
      return {
        ...section,
        stories: (section.stories ?? []).filter(Boolean).map((p) => {
          const post = normalisePost(p);
          return { ...post, readingTime: Math.max(1, Math.round((post.words || 0) / 200)) };
        }),
      };
    case "ctaSection":
      return { ...section, image: variant(section.image), alt: section.image?.alt ?? "" };
    case "embedSection":
      return { ...section, video: normaliseVideo(section.video) };
    default:
      return section;
  }
}

function normalisePost(doc) {
  if (!doc) return null;
  const share = variant(doc.shareImage);
  const cover = normalisePicture(doc.cover);
  return {
    id: doc._id,
    slug: doc.slug,
    title: doc.title ?? "Untitled",
    dek: doc.dek ?? "",
    topic: doc.topic ?? null,
    author: doc.author ? { ...doc.author, photo: variant(doc.author.photo) } : null,
    publishedAt: doc.publishedAt,
    featured: Boolean(doc.featured),
    pick: Boolean(doc.editorsPick),
    // The story's top picture (optional) and its thumbnail on cards (falls back to the cover)
    cover,
    thumbnail: normalisePicture(doc.featuredImage) ?? cover,
    coverVideo: normaliseVideo(doc.coverVideo),
    seo: { title: doc.seoTitle ?? "", description: doc.seoDescription ?? "", image: share },
    words: doc.words ?? 0,
    // Text modules are unpacked so the body reads as one flow (drop cap, end mark, lists)
    body: doc.body
      ? doc.body
          .flatMap((block) =>
            block._type === "textBlock"
              ? (block.content ?? []).map((b) => (block.align || block.spacing ? { ...b, align: block.align, spacing: block.spacing } : b))
              : [block],
          )
          .map(normaliseBlock)
          .filter(Boolean)
      : undefined,
  };
}

/* ── Queries ─────────────────────────────────────────────────────────── */

export async function getTopics() {
  const topics = await query(
    `*[_type == "topic" && defined(slug.current)] | order(coalesce(order, 99) asc, title asc){
      title, "slug": slug.current, description, seoDescription, "showInNav": coalesce(showInNav, true)
    }`,
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
  const post = await query(`*[${LIVE} && slug.current == $slug][0]{ ${FULL} }`, { slug });
  return normalisePost(post);
}

/** The "Explore page" settings document, raw (posts.js merges it with the defaults). */
export async function getExplorePage() {
  const doc = await query(`*[_id == "explorePage"][0]{
    ...,
    "leadSlug": leadStory->slug.current,
    "pickSlugs": picks[]->slug.current,
    "spotlightTopic": spotlightTopic->slug.current,
    "quoteSlug": quoteStory->slug.current,
    "smallPicture": smallPicture{ ..., "image": image{ ${ASSET}, alt }, "night": night{ ${ASSET} } },
    "shareImage": shareImage{ ${ASSET} },
    "sections": sections[]{
      ...,
      _type == "pictureSection" => { "picture": picture${PICTURE} },
      _type == "storiesSection" => { "stories": stories[]->{ ${CARD} }, "topicSlug": topic->slug.current },
      _type == "ctaSection" => { "image": image{ ${ASSET}, alt } },
      _type == "quoteSection" => { "story": story->{ title, "slug": slug.current, "author": author->{ name } } },
      _type == "embedSection" => { "video": video${VIDEO} }
    }
  }`);
  if (!doc) return null;
  const sp = doc.smallPicture;
  return {
    ...doc,
    smallPicture: sp ? { ...sp, image: sp.image?.src ? normalisePicture({ ...sp.image, night: sp.night, fit: sp.fit }, "contain") : null } : null,
    shareImage: variant(doc.shareImage),
    sections: (doc.sections ?? []).map(normaliseSection).filter(Boolean),
  };
}
