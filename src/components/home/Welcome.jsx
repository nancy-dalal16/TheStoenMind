import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import AboutPrompter from "@/components/home/AboutPrompter";
import { aboutStory } from "@/lib/content";

/** About card resting on the hero landscape: "A Small Story" as a lens teleprompter. */
export default function Welcome() {
  return (
    // Top padding leaves room for the whole hero landscape before the card:
    // (-0.0721 start + 0.08 parallax drift + 0.90 × 0.4471 painting) × width ≈ 0.41 × width,
    // minus the card frame's own top padding. On lg+ the landscape starts higher
    // (tucked behind the hero copy by --hero-pb + 0.0889 × width), so less room is needed.
    // Only the faded fog at the painting's foot sits behind the card.
    <section
      className={[
        "@container hero-fit relative [--land-w:max(115.56cqw,560px)]",
        "pt-[calc(var(--land-w)*0.41-4rem)] md:pt-[calc(var(--land-w)*0.41-5rem)]",
        "lg:pt-[calc(var(--land-w)*0.3211-clamp(88px,10.14cqw,146px)-5rem-var(--hero-shift)-var(--land-lift))]",
        // Mirrors Hero's --hero-shift (the hero copy moved down on short screens, the landscape didn't)
        // and --land-lift (the landscape moved up to keep the carriage on the first screen).
        "[--hero-pt:clamp(24px,calc(100svh-498px-var(--land-w)*0.1162),146px)]",
        "[--hero-shift:0px] lg:[--hero-shift:clamp(0px,calc(146px-var(--hero-pt)),64px)]",
      ].join(" ")}
    >
      <div className="relative mx-auto max-w-[1440px] px-5 py-16 md:px-20 md:py-20">
        {/* Clouds drifting in from either side */}
        <Artwork
          className="absolute top-[492px] left-[-23.33cqw] aspect-[671/299] w-[max(46.6cqw,300px)]"
          light={{ src: "/images/light/mist-b.png", crop: [159.12, 238.21, -59.12, -31.51] }}
          dark={{ src: "/images/dark/night-cloud-curl.png", crop: [116.58, 174.52, -20.47, -5.23], brightness: 1.12 }}
          sizes="(min-width: 640px) 75vw, 480px"
          data-reveal="left"
          style={{ "--reveal-dur": "1.8s", "--delay": "200ms" }}
        />
        <Artwork
          className="absolute top-[366px] left-[80.07cqw] aspect-[533/270] w-[max(37.01cqw,240px)]"
          light={{ src: "/images/light/mist-a.png", crop: [125.82, 351.22, -32.27, -34.89] }}
          dark={{ src: "/images/dark/night-cloud-scroll.png", crop: [108.61, 303.18, -16.56, -18.03], opacity: 0.58 }}
          sizes="(min-width: 640px) 47vw, 300px"
          data-reveal="right"
          style={{ "--reveal-dur": "1.8s", "--delay": "100ms" }}
        />

        <div
          data-reveal="zoom"
          className="relative z-10 mx-auto flex flex-col items-center gap-6 rounded-ui bg-linear-to-b from-card-from to-card-to px-6 py-10 backdrop-blur-[4px] sm:p-12"
          style={{ maxWidth: 720 }}
        >
          <p
            data-part="rise"
            style={{ "--j": 0 }}
            className="font-sans text-sm font-medium tracking-[0.08em] text-eyebrow uppercase"
          >
            {aboutStory.label}
          </p>

          <div data-part="rise" style={{ "--j": 1 }} className="w-full">
            <AboutPrompter blocks={aboutStory.blocks} label="About the Stoen Mind: a small story" />
          </div>

          <div data-part="rise" style={{ "--j": 2 }}>
            <Button href="/about">Know more about us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
