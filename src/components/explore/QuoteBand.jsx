import Link from "next/link";
import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import { postHref } from "@/lib/explore/links";

/** A single line from a story, set large and centred, with a cloud drifting behind it. */
export default function QuoteBand({ text, post }) {
  if (!text) return null;

  return (
    <section aria-label="From the stories" className="@container relative overflow-x-clip py-20 md:py-28">
      <Artwork
        className="absolute top-[calc(50%-5.2cqw)] left-[-14cqw] aspect-[701/212] w-[max(34cqw,240px)] opacity-60 max-md:top-6"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="34vw"
        data-reveal="left"
        style={{ "--reveal-dur": "2s" }}
      />
      <Container className="relative">
        <figure data-reveal="" className="mx-auto flex max-w-[56rem] flex-col items-center text-center">
          <Icon name="cloud" width={46} height={26} className="text-eyebrow opacity-80" />
          <blockquote data-part="blur" className="ex-quote-lg mt-7 text-balance">
            “{text}”
          </blockquote>
          {post ? (
            <figcaption data-part="rise" style={{ "--j": 1 }} className="ex-byline mt-7 justify-center">
              <span>
                From{" "}
                <Link href={postHref(post)} className="link-draw ex-byline-name">
                  {post.title}
                </Link>
              </span>
              {post.author ? (
                <>
                  <span aria-hidden="true" className="ex-dot">
                    ·
                  </span>
                  <span>{post.author.name}</span>
                </>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      </Container>
    </section>
  );
}
