import Icon from "@/components/ui/Icon";
import ExploreClouds from "./ExploreClouds";
import TopicNav from "./TopicNav";

/**
 * The magazine nameplate: a small eyebrow, a large serif title, one line of intro and a quiet
 * dateline, with the topic links running underneath between a double and a single rule.
 * Two watercolour clouds drift in from the edges, as on the shop and contact heroes.
 *
 * `size="front"` is the big /explore nameplate; "topic" is a step smaller for topic pages.
 */
export default function ExploreMasthead({ eyebrow, title, intro, meta, topics, allLabel, active, size = "front" }) {
  return (
    <>
      <section className="@container relative overflow-x-clip">
        <ExploreClouds />

        <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center pt-10 pb-9 text-center md:pt-14 md:pb-11">
          {/* eyebrow: undefined = the logo lettering, false = nothing, else whatever is passed */}
          {eyebrow === false ? null : (
            <div className="text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
              {eyebrow ?? (
                <>
                  <Icon name="wordmark" width="auto" height="20px" className="block" style={{ aspectRatio: "4332 / 604" }} />
                  <span className="sr-only">the STOEN mind</span>
                </>
              )}
            </div>
          )}
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
      </section>

      {/* Outside the section so it can stay pinned for the whole page (see TopicNav) */}
      <TopicNav topics={topics} allLabel={allLabel} active={active} />
    </>
  );
}
