import Container from "@/components/ui/Container";
import { topicHref } from "@/lib/explore/links";
import SectionHeader from "./SectionHeader";
import StoryCard from "./StoryCard";

/** One topic on a tinted band with tall pictures - the front page's "fiction" moment. */
export default function SpotlightBand({ topic, posts, seeAll = "See all" }) {
  if (!topic || !posts.length) return null;

  return (
    <section aria-labelledby={`band-${topic.slug}`} className="ex-band bg-band-soft py-16 md:py-24">
      <Container>
        <SectionHeader
          id={`band-${topic.slug}`}
          title={topic.title}
          description={topic.description}
          href={topicHref(topic)}
          linkLabel={seeAll}
          linkContext={topic.title}
        />
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:mt-12 md:gap-x-[30px] lg:grid-cols-4">
          {posts.slice(0, 4).map((post, index) => (
            <StoryCard
              key={post.id}
              post={post}
              index={index}
              rubric={false}
              aspect="aspect-[4/5]"
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 22vw, 45vw"
            />
          ))}
        </ul>
      </Container>
    </section>
  );
}
