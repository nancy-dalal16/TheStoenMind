import "server-only";
import { cache } from "react";
import * as sanity from "./sanity";
import { demoPosts, demoTopics } from "./demo";
import { defaultExplorePage } from "./copy";
import { readingTime, wordCount } from "./format";

/**
 * The one door the Explore pages use (same pattern as lib/shop/catalog.js). Reads from Sanity
 * when SANITY_PROJECT_ID is set, otherwise from the demo journal, and falls back to the demo if
 * Sanity errors so the pages never blank.
 *
 * Post shape: { id, slug, title, dek, topic {slug,title}, author {name,slug,role,bio},
 *   publishedAt, featured, pick, readingTime, cover { alt, fit, light, dark, caption, credit },
 *   body? (Portable Text - only from getPost) }
 */
export const exploreMode = sanity.sanityConfigured ? "sanity" : "demo";

async function fromSanity(fn, fallback) {
  if (!sanity.sanityConfigured) return fallback();
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return fallback();
  }
}

const newestFirst = (a, b) => b.publishedAt.localeCompare(a.publishedAt);

/** Cards don't carry the body (it's heavy); the reading time is worked out first. */
function withReadingTime(post, { keepBody = false } = {}) {
  const { body, words, ...rest } = post;
  const minutes = readingTime(words ?? wordCount(body));
  return keepBody ? { ...rest, body: body ?? [], readingTime: minutes } : { ...rest, readingTime: minutes };
}

/* ── Explore page settings ───────────────────────────────────────────── */

const filled = (value) => value !== undefined && value !== null && value !== "" && !(Array.isArray(value) && !value.length);
const pick = (value, fallback) => (filled(value) ? value : fallback);

/** Studio values over the defaults, one field at a time (empty = default). */
function mergeSettings(doc) {
  const d = defaultExplorePage;
  if (!doc) return d;
  const sp = doc.smallPicture ?? {};
  const nl = doc.newsletter ?? {};
  return {
    eyebrow: pick(doc.eyebrow, d.eyebrow),
    eyebrowText: pick(doc.eyebrowText, d.eyebrowText),
    title: pick(doc.title, d.title),
    intro: pick(doc.intro, d.intro),
    showMeta: pick(doc.showMeta, d.showMeta),
    allStoriesLabel: pick(doc.allStoriesLabel, d.allStoriesLabel),
    leadSlug: pick(doc.leadSlug, null),
    latestTitle: pick(doc.latestTitle, d.latestTitle),
    latestCount: pick(doc.latestCount, d.latestCount),
    picksTitle: pick(doc.picksTitle, d.picksTitle),
    pickSlugs: pick(doc.pickSlugs?.filter(Boolean), []),
    showSpotlight: pick(doc.showSpotlight, d.showSpotlight),
    // With Sanity, an unset band topic means "the first topic" rather than the demo's
    spotlightTopic: pick(doc.spotlightTopic, null),
    showQuote: pick(doc.showQuote, d.showQuote),
    quoteText: pick(doc.quoteText, null),
    quoteSlug: pick(doc.quoteSlug, null),
    showTopicRails: pick(doc.showTopicRails, d.showTopicRails),
    showGiftBand: pick(doc.showGiftBand, d.showGiftBand),
    emptyFront: pick(doc.emptyFront, d.emptyFront),
    smallPicture: {
      show: pick(sp.show, d.smallPicture.show) && Boolean(sp.image ?? null),
      label: pick(sp.label, d.smallPicture.label),
      image: sp.image ?? null,
      caption: pick(sp.caption, ""),
      credit: pick(sp.credit, ""),
    },
    newsletter: Object.fromEntries(Object.entries(d.newsletter).map(([k, v]) => [k, pick(nl[k], v)])),
    labels: {
      seeAll: pick(doc.seeAll, d.labels.seeAll),
      readNextTitle: pick(doc.readNextTitle, d.labels.readNextTitle),
      readNextLink: pick(doc.readNextLink, d.labels.readNextLink),
      share: pick(doc.shareLabel, d.labels.share),
      copied: pick(doc.copiedLabel, d.labels.copied),
      moreFrom: pick(doc.moreFromLabel, d.labels.moreFrom),
      by: pick(doc.byLabel, d.labels.by),
      minRead: pick(doc.minReadLabel, d.labels.minRead),
      emptyTopic: pick(doc.emptyTopic, d.labels.emptyTopic),
      emptyTopicText: pick(doc.emptyTopicText, d.labels.emptyTopicText),
    },
    sections: doc.sections ?? [],
    seo: {
      title: pick(doc.seoTitle, pick(doc.title, d.seo.title)),
      description: pick(doc.seoDescription, pick(doc.intro, d.seo.description)),
      image: doc.shareImage ?? null,
    },
  };
}

/** Every heading, label and switch for the Explore pages (Studio → "Explore page"). */
export const getExplorePage = cache(() =>
  fromSanity(
    async () => mergeSettings(await sanity.getExplorePage()),
    () => defaultExplorePage,
  ),
);

/* ── Topics & stories ────────────────────────────────────────────────── */

export const getTopics = cache(() =>
  fromSanity(
    () => sanity.getTopics(),
    () => demoTopics,
  ),
);

export async function getTopic(slug) {
  const topics = await getTopics();
  return topics.find((t) => t.slug === slug) ?? null;
}

/** Newest first. `topic` filters to one topic's slug. */
export const getPosts = cache(async (topic = null) => {
  const posts = await fromSanity(
    () => sanity.getPosts({ topic }),
    () => demoPosts.filter((p) => !topic || p.topic?.slug === topic),
  );
  return posts.map((post) => withReadingTime(post)).sort(newestFirst);
});

export const getPost = cache(async (slug) => {
  const post = await fromSanity(
    () => sanity.getPost(slug),
    () => demoPosts.find((p) => p.slug === slug) ?? null,
  );
  return post ? withReadingTime(post, { keepBody: true }) : null;
});

/** Three to read next: same topic first, then the newest of the rest. */
export async function getRelated(post, count = 3) {
  const all = await getPosts();
  const others = all.filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.topic?.slug === post.topic?.slug);
  const rest = others.filter((p) => p.topic?.slug !== post.topic?.slug);
  return [...same, ...rest].slice(0, count);
}

export { postHref, topicHref } from "./links";
