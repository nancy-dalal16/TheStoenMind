import Link from "next/link";
import { postHref } from "@/lib/explore/links";
import StoryImage from "./StoryImage";
import { Byline, Rubric } from "./StoryMeta";

/**
 * One story teaser, in the shapes a magazine front uses:
 *   lead     - big picture, centred headline, dek and byline (top of the front)
 *   stack    - picture on top, headline below (columns, rails, bands)
 *   row      - headline and dek on the left, picture on the right (the river of latest stories)
 *   numbered - no picture; a large numeral and a headline (the "worth lingering over" list)
 *   feature  - picture and text side by side (first story on a topic page)
 *   compact  - small picture on the left, headline on the right (two-up topic pairs)
 *   brief    - no picture; rubric, headline, dek and byline (under the lead story)
 *
 * The headline link is stretched over the whole card (::after), so the picture is clickable too;
 * the topic rubric sits above it with its own link.
 * Pass `as="div"` when the card isn't inside a list.
 */
export default function StoryCard({
  post,
  variant = "stack",
  index = 0,
  number,
  heading: Heading = "h3",
  as: Tag = "li",
  aspect = "aspect-[3/2]",
  sizes,
  dek = variant !== "stack",
  rubric = true,
  important = false,
  reveal = "",
  className = "",
}) {
  const href = postHref(post);
  const title = (cls) => (
    <Heading className={cls}>
      <Link href={href} className="ex-title-link">
        {post.title}
      </Link>
    </Heading>
  );
  const shell = (children, cls = "") => (
    <Tag data-reveal={reveal} style={{ "--i": index }} className={`ex-card group/story relative ${cls} ${className}`}>
      {children}
    </Tag>
  );

  if (variant === "lead") {
    return shell(
      <>
        <StoryImage image={post.cover} sizes={sizes ?? "(min-width: 1024px) 660px, 100vw"} important={important} className={aspect} />
        <div className="mx-auto mt-7 flex max-w-[34rem] flex-col items-center gap-3 text-center">
          {rubric ? <Rubric topic={post.topic} /> : null}
          {title("ex-title ex-title-lead text-balance")}
          {dek && post.dek ? <p className="ex-dek text-pretty">{post.dek}</p> : null}
          <Byline post={post} center className="mt-1" />
        </div>
      </>,
    );
  }

  if (variant === "feature") {
    return shell(
      <>
        <StoryImage
          image={post.cover}
          sizes={sizes ?? "(min-width: 1024px) 720px, 100vw"}
          important={important}
          className={`${aspect} md:col-span-7`}
        />
        <div className="flex flex-col gap-3 md:col-span-5">
          {rubric ? <Rubric topic={post.topic} /> : null}
          {title("ex-title ex-title-lead text-balance")}
          {post.dek ? <p className="ex-dek text-pretty">{post.dek}</p> : null}
          <Byline post={post} time className="mt-1" />
        </div>
      </>,
      "grid items-center gap-7 md:grid-cols-12 md:gap-10 lg:gap-14",
    );
  }

  if (variant === "row") {
    return shell(
      <>
        <div className="flex min-w-0 flex-col gap-2.5">
          {rubric ? <Rubric topic={post.topic} /> : null}
          {title("ex-title ex-title-row text-balance")}
          {dek && post.dek ? <p className="ex-dek ex-dek-sm line-clamp-3 max-sm:hidden">{post.dek}</p> : null}
          <Byline post={post} time className="mt-1" />
        </div>
        <StoryImage image={post.cover} sizes={sizes ?? "(min-width: 768px) 260px, 112px"} className="aspect-[4/3]" />
      </>,
      "grid grid-cols-[minmax(0,1fr)_112px] items-start gap-5 sm:grid-cols-[minmax(0,1fr)_180px] md:grid-cols-[minmax(0,1fr)_260px] md:gap-8",
    );
  }

  if (variant === "numbered") {
    return shell(
      <>
        <span aria-hidden="true" className="ex-numeral">
          {number}
        </span>
        <div className="flex min-w-0 flex-col gap-1.5">
          {rubric ? <Rubric topic={post.topic} /> : null}
          {title("ex-title ex-title-sm text-pretty")}
          <Byline post={post} date={false} />
        </div>
      </>,
      "grid grid-cols-[2.25rem_minmax(0,1fr)] gap-3",
    );
  }

  if (variant === "brief") {
    return shell(
      <div className="flex flex-col gap-2">
        {rubric ? <Rubric topic={post.topic} /> : null}
        {title("ex-title ex-title-md text-balance")}
        {post.dek ? <p className="ex-dek ex-dek-sm line-clamp-3">{post.dek}</p> : null}
        <Byline post={post} className="mt-1" />
      </div>,
    );
  }

  if (variant === "compact") {
    return shell(
      <>
        <StoryImage image={post.cover} sizes={sizes ?? "140px"} className="aspect-square" />
        <div className="flex min-w-0 flex-col gap-1.5">
          {title("ex-title ex-title-sm text-pretty")}
          {dek && post.dek ? <p className="ex-dek ex-dek-sm line-clamp-2 max-sm:hidden">{post.dek}</p> : null}
          <Byline post={post} />
        </div>
      </>,
      "grid grid-cols-[96px_minmax(0,1fr)] items-center gap-5 sm:grid-cols-[132px_minmax(0,1fr)]",
    );
  }

  // stack
  return shell(
    <>
      <StoryImage image={post.cover} sizes={sizes ?? "(min-width: 1024px) 400px, (min-width: 768px) 45vw, 100vw"} className={aspect} />
      <div className="mt-5 flex flex-col gap-2">
        {rubric ? <Rubric topic={post.topic} /> : null}
        {title("ex-title ex-title-md text-balance")}
        {dek && post.dek ? <p className="ex-dek ex-dek-sm line-clamp-3">{post.dek}</p> : null}
        <Byline post={post} className="mt-1" />
      </div>
    </>,
  );
}
