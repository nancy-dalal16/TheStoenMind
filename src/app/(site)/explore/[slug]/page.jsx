import Link from "next/link";
import { notFound } from "next/navigation";
import NewsletterBand from "@/components/explore/NewsletterBand";
import PortableText from "@/components/explore/PortableText";
import ReadingProgress from "@/components/explore/ReadingProgress";
import SectionHeader from "@/components/explore/SectionHeader";
import ShareButton from "@/components/explore/ShareButton";
import StoryCard from "@/components/explore/StoryCard";
import StoryImage from "@/components/explore/StoryImage";
import { Video } from "@/components/explore/StoryMedia";
import { Byline } from "@/components/explore/StoryMeta";
import Container from "@/components/ui/Container";
import { getExplorePage, getPost, getPosts, getRelated, postHref, topicHref } from "@/lib/explore/posts";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const post = await getPost((await params).slug);
  if (!post) return {};
  const thumb = post.thumbnail ?? post.cover;
  const image = post.seo?.image ?? thumb?.light;
  const description = post.seo?.description || post.dek;
  return {
    title: post.seo?.title || post.title,
    description,
    alternates: { canonical: postHref(post) },
    openGraph: {
      type: "article",
      title: post.seo?.title || post.title,
      description,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author.name] : undefined,
      section: post.topic?.title,
      images: image ? [{ url: image.src, width: image.width, height: image.height, alt: thumb?.alt ?? "" }] : undefined,
    },
  };
}

/**
 * A story: rubric, large headline, dek and byline centred over the cover painting; the body in
 * a single reading column with a drop cap, pull quotes, prompts and cloud section breaks; then
 * the author's note, a share link and three stories to read next.
 */
export default async function StoryPage({ params }) {
  const post = await getPost((await params).slug);
  if (!post) notFound();
  const [related, page] = await Promise.all([getRelated(post), getExplorePage()]);
  const { labels } = page;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.dek,
    datePublished: post.publishedAt,
    image: (post.thumbnail ?? post.cover)?.light?.src ? [new URL((post.thumbnail ?? post.cover).light.src, "https://thestoenmind.com").href] : undefined,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@type": "Organization", name: "the STOEN mind" },
    mainEntityOfPage: `https://thestoenmind.com${postHref(post)}`,
  };

  return (
    <>
      <ReadingProgress targetId="story-body" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <article className="pt-8 pb-20 md:pt-12 md:pb-28">
        <Container>
          <header className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
            {/* Where you are: back to Explore, and the story's topic */}
            <nav
              aria-label="Breadcrumb"
              className="ex-crumbs motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]"
            >
              <Link href="/explore" className="ex-rubric ex-rubric-muted">
                Explore
              </Link>
              {post.topic ? (
                <>
                  <span aria-hidden="true">/</span>
                  <Link href={topicHref(post.topic)} className="ex-rubric">
                    {post.topic.title}
                  </Link>
                </>
              ) : null}
            </nav>
            <h1 className="ex-headline mt-5 text-balance text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
              {post.title}
            </h1>
            {post.dek ? (
              <p className="ex-standfirst mt-6 max-w-[42rem] text-pretty motion-safe:animate-rise-in motion-safe:[animation-delay:340ms]">
                {post.dek}
              </p>
            ) : null}
            <Byline
              post={post}
              time
              center
              className="mt-7 motion-safe:animate-rise-in motion-safe:[animation-delay:460ms]"
            />
          </header>

          {post.coverVideo ? (
            <div className="mx-auto mt-10 max-w-[1120px] md:mt-14">
              <Video node={{ ...post.coverVideo, size: "column", poster: post.coverVideo.poster ?? post.cover?.light ?? post.thumbnail?.light }} className="ex-cover-video" />
            </div>
          ) : post.cover ? (
            <figure data-reveal="fade" style={{ "--reveal-dur": "1.6s" }} className="mx-auto mt-10 max-w-[1120px] md:mt-14">
              <StoryImage
                image={post.cover}
                sizes="(min-width: 1200px) 1120px, 100vw"
                important
                className={post.cover.fit === "contain" ? "aspect-[4/3] md:aspect-[16/9]" : "aspect-[4/3] md:aspect-[16/10]"}
              />
              {post.cover.caption || post.cover.credit ? (
                <figcaption className="ex-caption">
                  {post.cover.caption}
                  {post.cover.credit ? <span className="ex-credit">{post.cover.credit}</span> : null}
                </figcaption>
              ) : null}
            </figure>
          ) : null}

          <div id="story-body" className="mx-auto mt-12 max-w-[42rem] md:mt-16">
            <PortableText value={post.body} />

            <footer className="mt-14 flex flex-col gap-10 md:mt-16">
              <div className="flex flex-wrap items-center justify-between gap-4 border-y border-divider py-5">
                {post.topic ? (
                  <Link href={topicHref(post.topic)} className="ex-tag hover-pill">
                    {labels.moreFrom} {post.topic.title}
                  </Link>
                ) : (
                  <span />
                )}
                <ShareButton title={post.title} label={labels.share} copiedLabel={labels.copied} />
              </div>

              {post.author ? (
                <div className="ex-author">
                  {post.author.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={`${post.author.photo.src}?w=128&h=128&fit=crop&auto=format`} alt="" width={52} height={52} className="ex-author-photo" />
                  ) : (
                    <span aria-hidden="true" className="ex-author-mark">
                      {post.author.name.charAt(0)}
                    </span>
                  )}
                  <div className="flex min-w-0 flex-col gap-1.5">
                    <p className="ex-byline">
                      <span className="ex-byline-name">{post.author.name}</span>
                      {post.author.role ? (
                        <>
                          <span aria-hidden="true" className="ex-dot">
                            ·
                          </span>
                          <span>{post.author.role}</span>
                        </>
                      ) : null}
                    </p>
                    {post.author.bio ? <p className="text-body">{post.author.bio}</p> : null}
                  </div>
                </div>
              ) : null}
            </footer>
          </div>
        </Container>
      </article>

      {related.length ? (
        <section aria-labelledby="read-next" className="pb-20 md:pb-28">
          <Container>
            <SectionHeader id="read-next" title={labels.readNextTitle} href="/explore" linkLabel={labels.readNextLink} />
            <ul className="mt-10 grid gap-x-[30px] gap-y-12 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
              {related.map((item, index) => (
                <StoryCard
                  key={item.id}
                  post={item}
                  index={index}
                  dek
                  className={index === 2 ? "sm:max-lg:hidden" : ""}
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw"
                />
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      <NewsletterBand copy={page.newsletter} />
    </>
  );
}
