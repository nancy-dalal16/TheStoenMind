import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import { aboutHero } from "@/lib/about";

/**
 * About hero: copy on plain sky, then the harbour-bridge painting.
 *
 * The painting frame is 1511×701 at 1440 (--art-w ≈ 104.93cqw), sitting 70px left of the
 * frame. On lg+ its upper sky tucks up behind the copy, as in Figma. On short laptop screens it
 * rises further so the sailboats and the water below them are on the first screen; the copy is
 * centred in the sky above the arch. All lg+ geometry lives in globals.css ("About hero fit").
 * The drifting cloud is a separate layer in the painting's own coordinates, in both themes
 * (night uses the moonlit version of the same cloud).
 */
export default function AboutHero() {
  const { eyebrow, title, intro, cta } = aboutHero;

  return (
    <section className="@container about-hero-fit relative overflow-x-clip">
      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-[clamp(24px,4svh,32px)] pt-12 text-center md:gap-[clamp(40px,7svh,64px)] md:pt-[120px] lg:gap-(--hero-gap) lg:pt-(--hero-pt)">
        {/* <p className="font-serif text-2xl leading-5 tracking-[0.06em] text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          {eyebrow}
        </p> */}
        <div className="flex flex-col items-center gap-[clamp(16px,2.6svh,20px)]">
          <h1 className="max-w-[698px] text-page text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
            {title}
          </h1>
          <p className="max-w-[610px] text-lead leading-[1.34] motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
            {intro}
          </p>
        </div>
        <div className="motion-safe:animate-rise-in motion-safe:[animation-delay:520ms]">
          <Button href={cta.href} iconEnd="arrow-right">
            {cta.label}
          </Button>
        </div>
      </div>

      {/* Painting + drifting cloud */}
      <div className="about-hero-art relative -mt-[calc(var(--art-w)*0.02)] ml-[calc(50%-var(--art-w)*0.5227)] aspect-[1511/701] w-(--art-w)">
        <Artwork
          className="absolute inset-0 motion-safe:animate-land-in motion-safe:[animation-delay:250ms]"
          light={{
            src: "/images/about/bridge.png",
            crop: [100, 143.65, 0, -12.63],
          }}
          // Nancy's "Reworked Night - Harbour Bridge Scene 2" (Oct 4): pixel-registered with the
          // day painting. Its moon cloud was lifted out into the drifting-cloud layer below so both
          // themes share the same cloud size and position (design/content-source).
          dark={{
            src: "/images/about/bridge-night-harbour.png",
            crop: [100, 143.65, 0, -12.63],
          }}
          sizes="max(105vw, 760px)"
          important
        />
        <Artwork
          className="absolute top-[19.83%] left-[53.48%] aspect-[701/212] w-[46.39%] motion-safe:animate-cloud-in motion-safe:[animation-delay:700ms]"
          light={{ src: "/images/about/cloud-drift.png" }}
          // Night: the same cloud from Nancy's night painting, scaled (×0.9125 → same canvas) and
          // masked to the day cloud's footprint so it matches the day view exactly.
          dark={{ src: "/images/about/cloud-drift-moon-night.png" }}
          sizes="50vw"
        />
      </div>

      <div
        className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]"
        aria-hidden="true"
      />
    </section>
  );
}
