import Artwork from "@/components/ui/Artwork";

/**
 * Shop / collection intro: eyebrow, title and a line of copy, centred, with two watercolour
 * clouds drifting in from the edges (the Contact hero's clouds, smaller and higher).
 * Kept short so the products start on the first screen.
 */
export default function ShopHero({ eyebrow, title, intro }) {
  return (
    <section className="@container relative overflow-x-clip">
      <Artwork
        className="absolute top-[18px] left-[-24cqw] aspect-[701/212] w-[max(40cqw,280px)] opacity-90 motion-safe:animate-cloud-in motion-safe:[animation-delay:500ms] max-md:top-[-8px] max-md:left-[-46cqw]"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="40vw"
      />
      <Artwork
        flip
        className="absolute top-[150px] right-[-22cqw] aspect-[701/212] w-[max(36cqw,260px)] opacity-80 motion-safe:animate-cloud-in motion-safe:[animation-delay:750ms] max-md:hidden"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="36vw"
      />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-5 pt-14 pb-12 text-center md:pt-[88px] md:pb-16">
        <p className="font-serif text-2xl leading-5 tracking-[0.06em] text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          {eyebrow}
        </p>
        <h1 className="max-w-[760px] text-page text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
          {title}
        </h1>
        {intro ? (
          <p className="max-w-[600px] text-lead leading-[1.34] motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
            {intro}
          </p>
        ) : null}
      </div>
    </section>
  );
}
