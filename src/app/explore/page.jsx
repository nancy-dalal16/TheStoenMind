import ExploreMasthead from "@/components/explore/ExploreMasthead";
import LatestStories from "@/components/explore/LatestStories";
import QuoteBand from "@/components/explore/QuoteBand";
import SpotlightBand from "@/components/explore/SpotlightBand";
import TopicRails from "@/components/explore/TopicRails";
import TopStories from "@/components/explore/TopStories";
import GiftBand from "@/components/home/GiftBand";
import { exploreMasthead, frontQuote, spotlightTopic } from "@/lib/explore/copy";
import { formatDate } from "@/lib/explore/format";
import { getPosts, getTopics } from "@/lib/explore/posts";

export const revalidate = 60;

export const metadata = {
  title: "Explore",
  description: exploreMasthead.intro,
  alternates: { canonical: "/explore" },
};

/**
 * The Explore front, laid out like a magazine: nameplate and topic bar, the top stories,
 * the latest river (with a small picture and the letter sign-up), a spotlight band for one
 * topic, a pull quote, then a rail for each remaining topic.
 */
export default async function ExplorePage() {
  const [topics, posts] = await Promise.all([getTopics(), getPosts()]);

  // Front: the featured story leads (else the newest); the next two sit beside it and two
  // more as briefs under it. The river below carries on from there.
  const lead = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== lead);
  const side = rest.slice(0, 2);
  const below = rest.slice(2, 4);
  const latest = rest.slice(4, 10);
  // "Worth lingering over": editors' picks not already on the front, else older stories.
  const shown = new Set([lead, ...side, ...below, ...latest]);
  const unshown = posts.filter((p) => !shown.has(p));
  const picked = unshown.filter((p) => p.pick);
  const picks = (picked.length >= 3 ? picked : unshown).slice(0, 5);

  const spotlight = topics.find((t) => t.slug === spotlightTopic);
  const quotePost = posts.find((p) => p.slug === frontQuote.slug);
  const groups = topics
    .filter((t) => t.slug !== spotlightTopic)
    .map((topic) => ({ topic, posts: posts.filter((p) => p.topic?.slug === topic.slug) }));

  const meta = posts.length ? (
    <>
      <span>
        {posts.length} {posts.length === 1 ? "story" : "stories"}
      </span>
      <span aria-hidden="true" className="ex-dot">
        ·
      </span>
      <span>
        Updated <time dateTime={posts[0].publishedAt}>{formatDate(posts[0].publishedAt)}</time>
      </span>
    </>
  ) : null;

  return (
    <>
      <ExploreMasthead {...exploreMasthead} meta={meta} topics={topics} active="all" />

      {posts.length ? (
        <>
          <TopStories lead={lead} side={side} below={below} picks={picks} />
          <LatestStories posts={latest} />
          <SpotlightBand topic={spotlight} posts={posts.filter((p) => p.topic?.slug === spotlightTopic)} />
          <QuoteBand text={quotePost ? frontQuote.text : null} post={quotePost} />
          <TopicRails groups={groups} />
        </>
      ) : (
        <p className="page-gutter py-24 text-center text-body-lg">The first stories are on their way.</p>
      )}

      <GiftBand variant="soft" />
    </>
  );
}
