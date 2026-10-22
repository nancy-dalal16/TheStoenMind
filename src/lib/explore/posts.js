import "server-only";
import { cache } from "react";
import * as sanity from "./sanity";
import { demoPosts, demoTopics } from "./demo";
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
