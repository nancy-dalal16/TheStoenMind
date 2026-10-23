import Container from "@/components/ui/Container";
import { topicHref } from "@/lib/explore/links";
import SectionHeader from "./SectionHeader";
import StoryCard from "./StoryCard";

/**
 * One rail per topic. Topics with three or more stories get a full row of three pictures;
 * smaller topics are paired side by side as compact lists, so no rail is left half empty.
 * `groups`: [{ topic, posts }]
 */
export default function TopicRails({ groups, seeAll = "See all" }) {
  const full = groups.filter((g) => g.posts.length >= 3);
  const small = groups.filter((g) => g.posts.length > 0 && g.posts.length < 3);

  return (
    <>
      {full.map(({ topic, posts }) => (
        <section key={topic.slug} aria-labelledby={`rail-${topic.slug}`} className="pb-20 md:pb-28">
          <Container>
            <SectionHeader
              id={`rail-${topic.slug}`}
              title={topic.title}
              description={topic.description}
              href={topicHref(topic)}
              linkLabel={seeAll}
              linkContext={topic.title}
            />
            <ul className="mt-10 grid gap-x-[30px] gap-y-12 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
              {posts.slice(0, 3).map((post, index) => (
                <StoryCard
                  key={post.id}
                  post={post}
                  index={index}
                  rubric={false}
                  dek
                  className={index === 2 ? "sm:max-lg:hidden" : ""}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
                />
              ))}
            </ul>
          </Container>
        </section>
      ))}

      {small.length ? (
        <section aria-label="More topics" className="pb-20 md:pb-28">
          <Container className="grid gap-x-[60px] gap-y-20 md:grid-cols-2">
            {small.map(({ topic, posts }) => (
              <div key={topic.slug} className="flex min-w-0 flex-col">
                <SectionHeader
                  id={`rail-${topic.slug}`}
                  title={topic.title}
                  description={topic.description}
                  href={topicHref(topic)}
                  linkLabel={seeAll}
                  linkContext={topic.title}
                  className="ex-section-head-stacked"
                />
                <ul className="ex-divided mt-6 flex flex-col">
                  {posts.map((post, index) => (
                    <StoryCard key={post.id} post={post} variant="compact" index={index} />
                  ))}
                </ul>
              </div>
            ))}
          </Container>
        </section>
      ) : null}
    </>
  );
}
