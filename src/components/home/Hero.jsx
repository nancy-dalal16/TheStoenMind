import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import ParallaxLayer from "@/components/ui/ParallaxLayer";

/**
 * Hero copy, then the watercolour landscape with its drifting cloud.
 *
 * Layout (desktop, lg+)
 * - The copy always sits on plain background. The painting's top ~36% is empty
 *   sky across the centred text column (the tree stays to the left of it), so
 *   the landscape is tucked up behind the copy by that much. That puts the
 *   cloud and the carriage in view on the first screen.
 * - On shorter screens the top padding and the gaps between lines shrink, so
 *   the carriage still fits in the first view.
 * - Below lg the text column is wider, so the landscape starts just under the
 *   button instead.
 *
 * Scrolling: the landscape moves slower than the page (parallax) and settles
 * 0.08 × its width lower; <Welcome /> leaves room for the whole painting.
 *
 * CSS variables (all relative to the section width via cqw):
 *   --land-w   landscape width
 *   --hero-pb  space under the button
 *   --land-top where the landscape starts (shared with the cloud)
 */
export default function Hero() {
  return (
    <section
      className={[
        "@container hero-fit relative",
        "[--land-w:max(115.56cqw,560px)] [--hero-pb:clamp(88px,10.14cqw,146px)]",
        // Below lg: start just under the button (Figma: 120px above the hero's bottom at 1440).
        "[--land-top:calc(100%-var(--land-w)*0.0721)]",
        // lg+: tuck the empty-sky top 36% of the painting (0.161 × width) up behind the copy.
        "lg:[--land-top:calc(100%-var(--hero-pb)-var(--land-w)*0.161-var(--hero-shift)-var(--land-lift))]",
        // …and --land-lift (globals.css, "Home hero fit") raises it further on short screens so the
        // tree, carriage and the field under them stay on the first screen.
        // lg+ short screens (e.g. 1536×730 laptops): the top padding is squeezed so the carriage
        // fits, which pushed the copy up against the header. --hero-shift gives up to 64px of that
        // space back to the copy only; the landscape is pulled up by the same amount, so it stays put.
        // <Welcome /> mirrors this so the gap between painting and card is unchanged.
        "[--hero-pt:clamp(24px,calc(100svh-498px-var(--land-w)*0.1162),146px)]",
        "[--hero-shift:0px] lg:[--hero-shift:clamp(0px,calc(146px-var(--hero-pt)),64px)]",
      ].join(" ")}
    >
      <ParallaxLayer
        speed={0.3}
        maxShift={0.179} // 0.08 × width, expressed as a fraction of its height (0.08 / 0.4471)
        className="absolute top-(--land-top) left-1/2 aspect-[1664/744] w-(--land-w) -translate-x-1/2 max-md:left-[calc(var(--land-w)*-0.06)] max-md:translate-x-0"
      >
        <Artwork
          className="absolute inset-0 motion-safe:animate-land-in motion-safe:[animation-delay:250ms]"
          light={{
            src: "/images/light/hero-landscape.png",
            position: "bottom",
          }}
          // "TSM Night Mode Image- 1" with the cloud cut out (its right-hand hills are widened 30%
          // so the painting still reaches the edge). Drawn at 90% so the tree and carriage match the
          // light painting's size and spot, and toned down so the hero copy leads.
          dark={{
            src: "/images/dark/night-hero-landscape.png",
            crop: [94.69, 134.19, 0.905, -34.67],
            opacity: 0.72,
          }}
          sizes="max(116vw, 820px)"
          important
        />
      </ParallaxLayer>

      {/* Drifting cloud, top-right of the landscape (scrolls at normal speed, in front of it) */}
      <Artwork
        className="absolute top-[calc(var(--land-top)+var(--land-w)*0.0036)] left-[37.71cqw] aspect-[914/168] w-[63.47cqw] motion-safe:animate-cloud-in motion-safe:[animation-delay:700ms]"
        light={{
          src: "/images/light/hero-landscape.png",
          crop: [100, 362.57, 0, -22.19],
        }}
        dark={null}
        sizes="64vw"
        important
      />

      {/* Night cloud (from "TSM Night Mode Image- 1"). It has a moonlit glow, so it needs a
          taller frame than the light strip; centred on the light cloud's spot at a matching size. */}
      <Artwork
        className="absolute motion-safe:animate-cloud-in motion-safe:[animation-delay:700ms]"
        style={{
          top: "calc(var(--land-top) + var(--land-w) * 0.0036 + 0.655cqw)",
          left: "65.42cqw",
          width: "32.69cqw",
          aspectRatio: "989 / 331",
        }}
        light={null}
        dark={{ src: "/images/dark/night-hero-cloud.png", opacity: 0.85 }}
        sizes="33vw"
        important
      />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-[clamp(24px,4svh,32px)] pt-12 pb-(--hero-pb) text-center md:gap-[clamp(40px,7svh,64px)] md:pt-[146px] lg:gap-(--hero-gap) lg:pt-[calc(var(--hero-pt)+var(--hero-shift))]">
        {/* Brand wordmark, identical to the logo's lettering. Real text stays for screen readers and SEO. */}
        <p className="text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          <span className="sr-only">the STOEN mind</span>
          <Icon
            name="wordmark"
            width="auto"
            height="clamp(22px, 1.1rem + 0.6vw, 26px)"
            className="block"
            style={{ aspectRatio: "4332 / 604" }}
          />
        </p>

        <div className="flex flex-col items-center gap-[clamp(16px,2.6svh,20px)]">
          <h1 className="text-display text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
            Drift with me through <br className="hidden sm:block" />
            your inner skies.
          </h1>
          <p className="max-w-[35.75rem] text-lead motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
            JOURNALS, WORKBOOKS and DIARIES for the mind that wants to wander
            slowly. A space with no deadlines or checklists.
          </p>
        </div>

        {/* Wrapper carries the entrance so the button keeps its own hover lift */}
        <div className="motion-safe:animate-rise-in motion-safe:[animation-delay:520ms]">
          <Button href="/shop" icon="handbag">
            Begin Shopping
          </Button>
        </div>
      </div>
    </section>
  );
}
