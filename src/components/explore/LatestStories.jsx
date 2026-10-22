import Container from "@/components/ui/Container";
import { exploreLabels, newsletter, smallPicture } from "@/lib/explore/copy";
import NewsletterForm from "./NewsletterForm";
import SectionHeader from "./SectionHeader";
import StoryCard from "./StoryCard";
import StoryImage from "./StoryImage";

/**
 * "The latest": a river of stories (text left, picture right) with a sticky column beside it
 * holding "A small picture" (one drawing and its caption) and the newsletter card.
 */
export default function LatestStories({ posts }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="latest" className="py-20 md:py-28">
      <Container>
        <SectionHeader id="latest" title={exploreLabels.latest} />
        <div className="mt-6 grid gap-14 lg:mt-8 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-16 xl:gap-20">
          <ul className="ex-divided flex flex-col">
            {posts.map((post, index) => (
              <StoryCard key={post.id} post={post} variant="row" index={index % 3} heading="h3" />
            ))}
          </ul>

          <div className="flex flex-col gap-12 lg:sticky lg:top-28 lg:self-start">
            <figure data-reveal="" className="ex-picture">
              <figcaption className="ex-aside-title">{smallPicture.label}</figcaption>
              <StoryImage image={smallPicture.image} sizes="(min-width: 1024px) 360px, 90vw" className="mt-5 aspect-[4/5]" />
              <blockquote data-part="rise" className="ex-picture-caption">
                {smallPicture.caption}
              </blockquote>
              <p data-part="rise" style={{ "--j": 1 }} className="ex-byline mt-3 justify-center">
                {smallPicture.credit}
              </p>
            </figure>

            <div data-reveal="" style={{ "--i": 1 }} className="ex-letter">
              <p data-part="rise" className="ex-rubric">
                {newsletter.eyebrow}
              </p>
              <h3 data-part="blur" className="mt-3 font-serif text-card text-fg">
                {newsletter.title}
              </h3>
              <p data-part="rise" style={{ "--j": 1 }} className="mt-3 text-body">
                {newsletter.text}
              </p>
              <div data-part="rise" style={{ "--j": 2 }} className="mt-6">
                <NewsletterForm id="letter-aside" stacked />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
