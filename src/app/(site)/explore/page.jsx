import ExploreMasthead from "@/components/explore/ExploreMasthead";
import ExploreSections from "@/components/explore/ExploreSections";
import LatestStories from "@/components/explore/LatestStories";
import QuoteBand from "@/components/explore/QuoteBand";
import SpotlightBand from "@/components/explore/SpotlightBand";
import TopicRails from "@/components/explore/TopicRails";
import TopStories from "@/components/explore/TopStories";
import GiftBand from "@/components/home/GiftBand";
import { formatDate } from "@/lib/explore/format";
import { getExplorePage, getPosts, getTopics } from "@/lib/explore/posts";

export const revalidate = 60;

export async function generateMetadata() {
  const page = await getExplorePage();
  return {
    title: page.seo.title,
    description: page.seo.description,
    alternates: { canonical: "/explore" },
    openGraph: page.seo.image ? { images: [{ url: page.seo.image.src, width: page.seo.image.width, height: page.seo.image.height }] } : undefined,
  };
}

/** The masthead eyebrow: the logo lettering (default), the editor's own text, or nothing. */
function eyebrowFor(page) {
  if (page.eyebrow === "none") return false;
  if (page.eyebrow === "text" && page.eyebrowText) return <p className="ex-rubric">{page.eyebrowText}</p>;
  return undefined; // wordmark
}

/**
 * The Explore front, laid out like a magazine: nameplate and topic bar, the top stories,
 * the latest river (with a small picture and the letter sign-up), a spotlight band for one
 * topic, a pull quote, then a rail for each remaining topic. Everything on it - wording,
 * which story leads, which sections show - comes from the Studio's "Explore page".
 */
export default async function ExplorePage() {
  const [page, topics, posts] = await Promise.all([getExplorePage(), getTopics(), getPosts()]);
  const bySlug = (slug) => (slug ? posts.find((p) => p.slug === slug) : undefined);

  // Lead: chosen in the Studio, else the newest "Lead story", else the newest story.
  const lead = bySlug(page.leadSlug) ?? posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p !== lead);
  const side = rest.slice(0, 2);
  const below = rest.slice(2, 4);
  const latest = rest.slice(4, 4 + Math.max(0, page.latestCount));

  // Numbered list: chosen in the Studio, else editors' picks not already on the front, else older stories.
  const chosen = page.pickSlugs.map(bySlug).filter(Boolean);
  const shown = new Set([lead, ...side, ...below, ...latest]);
  const unshown = posts.filter((p) => !shown.has(p));
  const picked = unshown.filter((p) => p.pick);
  const picks = (chosen.length ? chosen : picked.length >= 3 ? picked : unshown).slice(0, 5);

  const spotlight = page.showSpotlight
    ? (topics.find((t) => t.slug === page.spotlightTopic) ?? topics.find((t) => posts.some((p) => p.topic?.slug === t.slug)))
    : null;
  const quotePost = bySlug(page.quoteSlug);
  const groups = topics
    .filter((t) => t.slug !== spotlight?.slug)
    .map((topic) => ({ topic, posts: posts.filter((p) => p.topic?.slug === topic.slug) }));
  const navTopics = topics.filter((t) => t.showInNav !== false);
  // Extra sections from the Studio, each placed at one of the spots below
  const extra = { sections: page.sections ?? [], posts, page };

  const meta =
    page.showMeta && posts.length ? (
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
      <ExploreMasthead
        eyebrow={eyebrowFor(page)}
        title={page.title}
        intro={page.intro}
        meta={meta}
        topics={navTopics}
        allLabel={page.allStoriesLabel}
        active="all"
      />

      {posts.length ? (
        <>
          <TopStories lead={lead} side={side} below={below} picks={picks} picksTitle={page.picksTitle} />
          <ExploreSections {...extra} at="afterTop" />
          <LatestStories posts={latest} page={page} />
          <ExploreSections {...extra} at="afterLatest" />
          {spotlight ? (
            <SpotlightBand topic={spotlight} posts={posts.filter((p) => p.topic?.slug === spotlight.slug)} seeAll={page.labels.seeAll} />
          ) : null}
          <ExploreSections {...extra} at="afterSpotlight" />
          {page.showQuote && page.quoteText ? <QuoteBand text={page.quoteText} post={quotePost} /> : null}
          <ExploreSections {...extra} at="afterQuote" />
          {page.showTopicRails ? <TopicRails groups={groups} seeAll={page.labels.seeAll} /> : null}
        </>
      ) : (
        <p className="page-gutter py-24 text-center text-body-lg">{page.emptyFront}</p>
      )}
      <ExploreSections {...extra} at="end" />

      {page.showGiftBand ? <GiftBand variant="soft" /> : null}
    </>
  );
}
