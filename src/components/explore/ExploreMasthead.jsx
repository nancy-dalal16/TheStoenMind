import Artwork from "@/components/ui/Artwork";
import Icon from "@/components/ui/Icon";
import TopicNav from "./TopicNav";

/**
 * The magazine nameplate: a small eyebrow, a large serif title, one line of intro and a quiet
 * dateline, with the topic links running underneath between a double and a single rule.
 * Two watercolour clouds drift in from the edges, as on the shop and contact heroes.
 *
 * `size="front"` is the big /explore nameplate; "topic" is a step smaller for topic pages.
 */
export default function ExploreMasthead({ eyebrow, title, intro, meta, topics, active, size = "front" }) {
  return (
    <section className="@container relative overflow-x-clip">
      <Artwork
        className="absolute top-[34px] left-[-22cqw] aspect-[701/212] w-[max(36cqw,260px)] opacity-80 motion-safe:animate-cloud-in motion-safe:[animation-delay:500ms] max-md:top-[4px] max-md:left-[-50cqw]"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="36vw"
      />
      <Artwork
        flip
        className="absolute top-[120px] right-[-20cqw] aspect-[701/212] w-[max(32cqw,240px)] opacity-70 motion-safe:animate-cloud-in motion-safe:[animation-delay:750ms] max-md:hidden"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="32vw"
      />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center pt-10 pb-9 text-center md:pt-14 md:pb-11">
        <div className="text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          {eyebrow ?? (
            <>
              <Icon name="wordmark" width="auto" height="20px" className="block" style={{ aspectRatio: "4332 / 604" }} />
              <span className="sr-only">the STOEN mind</span>
            </>
          )}
        </div>
        <h1
          className={`${size === "front" ? "ex-nameplate" : "ex-nameplate ex-nameplate-sm"} mt-4 text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]`}
        >
          {title}
        </h1>
        {intro ? (
          <p className="mt-5 max-w-[36rem] text-lead text-pretty motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
            {intro}
          </p>
        ) : null}
        {meta ? (
          <p className="ex-byline mt-6 justify-center motion-safe:animate-rise-in motion-safe:[animation-delay:460ms]">
            {meta}
          </p>
        ) : null}
      </div>

      <TopicNav topics={topics} active={active} />
    </section>
  );
}
