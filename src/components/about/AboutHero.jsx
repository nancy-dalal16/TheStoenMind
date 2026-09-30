import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import Glow from "@/components/ui/Glow";
import { aboutHero } from "@/lib/about";

/**
 * About hero: copy on plain sky, then the harbour-bridge painting.
 *
 * The painting frame is 1511×701 at 1440 (--art-w ≈ 104.93cqw), sitting 70px left of the
 * frame. On lg+ its empty upper sky tucks 0.1694 × width up behind the copy, as in Figma;
 * smaller screens tuck less so the tree never meets the text. The drifting cloud is a
 * separate layer positioned in the painting's own coordinates, so both scale together.
 *
 * Short laptop screens (lg+): like the home hero, the bridge must be visible on the first
 * screen. The painting tucks further up (never above the section top) so its waterline —
 * 0.865 of its height, i.e. 0.401 × width — lands just above the fold, and the copy is centred
 * in the sky above the arch. Tall screens keep the Figma overlap and padding.
 *   --text-h  height of the copy block on lg+ (eyebrow 20 + title 62 + 12 + intro 64 + button 56 + 2 gaps)
 */
export default function AboutHero() {
  const { eyebrow, title, intro, cta } = aboutHero;

  return (
    <section
      className={[
        "@container relative overflow-x-clip [--art-w:max(104.93cqw,760px)]",
        "lg:[--hdr:clamp(88px,15svh,110px)]",
        // Copy centred in the sky between the header and the bridge arch (arch top = painting top
        // + 0.2876 × width; painting top = max(0, 100svh − hdr − 16px − 0.401 × width) on short
        // screens). On tall screens the painting sits in normal flow, where the gap under the button
        // is a fixed 0.1182 × width − 24px, so padding matches that to stay centred.
        "lg:[--hero-pt:clamp(40px,min(calc((max(0px,100svh-var(--hdr)-16px-var(--art-w)*0.401)+var(--art-w)*0.2876-24px-214px-2*var(--hero-gap))/2),calc(var(--art-w)*0.1182-24px)),180px)]",
        "lg:[--hero-gap:clamp(20px,4svh,32px)] lg:[--text-h:calc(var(--hero-pt)+214px+2*var(--hero-gap))]",
      ].join(" ")}
    >
      <Glow src="/images/dark/glow-hero.svg" className="top-[-495px] left-1/2 size-[1660px] -translate-x-1/2" />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-8 pt-12 text-center md:pt-[120px] lg:gap-(--hero-gap) lg:pt-(--hero-pt)">
        <p className="font-serif text-2xl leading-5 tracking-[0.06em] text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          {eyebrow}
        </p>
        <div className="flex flex-col items-center gap-3">
          <h1 className="max-w-[698px] text-page text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
            {title}
          </h1>
          <p className="max-w-[610px] text-lead leading-[1.34] text-fg motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
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
      <div className="relative -mt-[calc(var(--art-w)*0.02)] ml-[calc(50%-var(--art-w)*0.5227)] aspect-[1511/701] w-(--art-w) lg:mt-[max(calc(-1*var(--text-h)),min(calc(var(--art-w)*-0.1694),calc(100svh-var(--hdr)-16px-var(--art-w)*0.401-var(--text-h))))]">
        <Artwork
          className="absolute inset-0 motion-safe:animate-land-in motion-safe:[animation-delay:250ms]"
          light={{ src: "/images/about/bridge.png", crop: [100, 143.65, 0, -12.63] }}
          dark={{ src: "/images/about/bridge-night.png", crop: [100, 143.65, 0, -12.63], brightness: 1.15 }}
          sizes="max(105vw, 760px)"
          important
        />
        <Artwork
          className="absolute top-[19.83%] left-[53.48%] aspect-[701/212] w-[46.39%] motion-safe:animate-cloud-in motion-safe:[animation-delay:700ms]"
          light={{ src: "/images/about/cloud-drift.png" }}
          dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
          sizes="50vw"
        />
      </div>

      <div className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]" aria-hidden="true" />
    </section>
  );
}
