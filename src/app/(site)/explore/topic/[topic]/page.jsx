import Link from "next/link";
import { notFound } from "next/navigation";
import ExploreMasthead from "@/components/explore/ExploreMasthead";
import NewsletterBand from "@/components/explore/NewsletterBand";
import StoryCard from "@/components/explore/StoryCard";
import Container from "@/components/ui/Container";
import { getExplorePage, getPosts, getTopic, getTopics } from "@/lib/explore/posts";

export const revalidate = 60;

export async function generateStaticParams() {
  const topics = await getTopics();
  return topics.map((topic) => ({ topic: topic.slug }));
}

export async function generateMetadata({ params }) {
  const topic = await getTopic((await params).topic);
  if (!topic) return {};
  return {
    title: `${topic.title} · Explore`,
    description: topic.seoDescription || topic.description,
    alternates: { canonical: `/explore/topic/${topic.slug}` },
  };
}

/** One topic: its nameplate, the newest story as a wide feature, then the rest in a grid. */
export default async function TopicPage({ params }) {
  const { topic: slug } = await params;
  const [page, topics, topic, posts] = await Promise.all([getExplorePage(), getTopics(), getTopic(slug), getPosts(slug)]);
  if (!topic) notFound();

  const [first, ...rest] = posts;

  return (
    <>
      <ExploreMasthead
        size="topic"
        eyebrow={
          <Link href="/explore" className="ex-rubric link-draw">
            {page.title}
          </Link>
        }
        title={topic.title}
        intro={topic.description}
        meta={`${posts.length} ${posts.length === 1 ? "story" : "stories"}`}
        topics={topics.filter((t) => t.showInNav !== false)}
        allLabel={page.allStoriesLabel}
        active={topic.slug}
      />

      <section aria-label={`${topic.title} stories`} className="pt-12 pb-20 md:pt-16 md:pb-28">
        <Container>
          {first ? (
            <>
              <StoryCard post={first} variant="feature" as="article" heading="h2" rubric={false} aspect="aspect-[3/2]" important reveal="fade" />
              {rest.length ? (
                <ul className="mt-16 grid gap-x-[30px] gap-y-14 border-t border-divider pt-12 sm:grid-cols-2 md:mt-20 md:pt-16 lg:grid-cols-3">
                  {rest.map((post, index) => (
                    <StoryCard
                      key={post.id}
                      post={post}
                      index={index % 3}
                      rubric={false}
                      dek
                      heading="h2"
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
                    />
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-16 text-center">
              <p className="font-serif text-card text-fg">{page.labels.emptyTopic}</p>
              <p className="max-w-[36ch] text-body">{page.labels.emptyTopicText}</p>
              <Link href="/explore" className="ex-more mt-2">
                {page.allStoriesLabel}
              </Link>
            </div>
          )}
        </Container>
      </section>

      <NewsletterBand copy={page.newsletter} />
    </>
  );
}
