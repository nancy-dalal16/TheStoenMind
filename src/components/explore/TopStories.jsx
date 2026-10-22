import Container from "@/components/ui/Container";
import { exploreLabels } from "@/lib/explore/copy";
import StoryCard from "./StoryCard";

/**
 * The front of the magazine, in three columns divided by hairlines (lg+):
 * two stories stacked on the left, the lead story in the wide centre (with two briefs under it),
 * and a numbered "worth lingering over" list on the right. Tablet: lead across the top, the two columns below.
 */
export default function TopStories({ lead, side = [], below = [], picks = [] }) {
  return (
    <section aria-labelledby="top-stories" className="pt-10 md:pt-14">
      <h2 id="top-stories" className="sr-only">
        Top stories
      </h2>
      <Container>
        <div className="grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-[minmax(0,3fr)_minmax(0,6fr)_minmax(0,3fr)] lg:gap-0">
          {lead ? (
            <div className="md:col-span-2 lg:order-2 lg:col-span-1 lg:border-x lg:border-divider lg:px-10 xl:px-12">
              <StoryCard post={lead} variant="lead" as="article" heading="h3" aspect="aspect-[3/2]" important reveal="fade" />
              {below.length ? (
                <ul className="mt-12 grid gap-x-10 gap-y-8 border-t border-divider pt-8 sm:grid-cols-2">
                  {below.map((post, index) => (
                    <StoryCard key={post.id} post={post} variant="brief" index={index} heading="h4" />
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}

          {side.length ? (
            <ul className="ex-divided flex flex-col lg:order-1 lg:pr-10 xl:pr-12">
              {side.map((post, index) => (
                <StoryCard key={post.id} post={post} index={index} aspect="aspect-[4/3]" dek sizes="(min-width: 1024px) 300px, (min-width: 768px) 45vw, 100vw" />
              ))}
            </ul>
          ) : null}

          {picks.length ? (
            <aside aria-labelledby="picks" className="lg:order-3 lg:pl-10 xl:pl-12">
              <h3 id="picks" data-reveal="" className="ex-aside-title">
                {exploreLabels.picks}
              </h3>
              <ol className="ex-divided mt-2 flex flex-col">
                {picks.map((post, index) => (
                  <StoryCard key={post.id} post={post} variant="numbered" number={index + 1} index={index} heading="h4" />
                ))}
              </ol>
            </aside>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
