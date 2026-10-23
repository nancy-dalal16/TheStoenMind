import Container from "@/components/ui/Container";
import NewsletterForm from "./NewsletterForm";
import SectionHeader from "./SectionHeader";
import StoryCard from "./StoryCard";
import StoryImage from "./StoryImage";

/**
 * "The latest": a river of stories (text left, picture right) with a sticky column beside it
 * holding "A small picture" (one drawing and its caption) and the newsletter card - each
 * switched on or off, and worded, in the Studio's "Explore page".
 */
export default function LatestStories({ posts, page }) {
  if (!posts.length) return null;
  const { smallPicture, newsletter } = page;
  const aside = smallPicture.show || newsletter.show;

  return (
    <section aria-labelledby="latest" className="py-20 md:py-28">
      <Container>
        <SectionHeader id="latest" title={page.latestTitle} />
        <div
          className={`mt-6 grid gap-14 lg:mt-8 lg:gap-16 xl:gap-20 ${aside ? "lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]" : ""}`}
        >
          <ul className="ex-divided flex flex-col">
            {posts.map((post, index) => (
              <StoryCard key={post.id} post={post} variant="row" index={index % 3} heading="h3" />
            ))}
          </ul>

          {aside ? (
            <div className="flex flex-col gap-12 lg:sticky lg:top-28 lg:self-start">
              {smallPicture.show && smallPicture.image ? (
                <figure data-reveal="" className="ex-picture">
                  <figcaption className="ex-aside-title">{smallPicture.label}</figcaption>
                  <StoryImage image={smallPicture.image} sizes="(min-width: 1024px) 360px, 90vw" className="mt-5 aspect-[4/5]" />
                  {smallPicture.caption ? (
                    <blockquote data-part="rise" className="ex-picture-caption">
                      {smallPicture.caption}
                    </blockquote>
                  ) : null}
                  {smallPicture.credit ? (
                    <p data-part="rise" style={{ "--j": 1 }} className="ex-byline mt-3 justify-center">
                      {smallPicture.credit}
                    </p>
                  ) : null}
                </figure>
              ) : null}

              {newsletter.show ? (
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
                    <NewsletterForm id="letter-aside" stacked copy={newsletter} />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
