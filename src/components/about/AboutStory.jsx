import Artwork from "@/components/ui/Artwork";
import AboutPrompter from "@/components/home/AboutPrompter";
import { aboutStory } from "@/lib/content";

/**
 * About page: the home page's "A Small Story" card (see home/Welcome.jsx), placed under the hero.
 * Same card, clouds and teleprompter; only the outer spacing differs, because there's no hero
 * landscape to leave room for here. The hero's "Explore our journey" button scrolls to #about-story.
 * The "Know more about us" button is left out, since it links to this page.
 * Oct 6: matches the home card - 600px wide, compact window, 1.2 leading, no eyebrow (.prompter-card).
 */
export default function AboutStory() {
  return (
    // Nancy (Oct 6): card lifted closer to the hero, like the home card (top: 32+64 → 24 mobile, 160 → 16 md+)
    <section className="@container relative overflow-x-clip pt-0 pb-8 md:pb-20">
      <div className="relative mx-auto max-w-[1440px] px-5 pt-6 pb-16 md:px-20 md:pt-4 md:pb-20">
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

        {/* The anchor is on the card, so "Explore our journey" lands on the card, not the padding above it */}
        <div
          id="about-story"
          data-reveal="zoom"
          className="prompter-card relative z-10 mx-auto scroll-mt-6 flex flex-col items-center gap-5 rounded-ui bg-linear-to-b from-card-from to-card-to px-6 py-8 backdrop-blur-[4px] sm:px-10 sm:py-9"
          style={{ maxWidth: 600 }}
        >
          <div data-part="rise" style={{ "--j": 0 }} className="w-full">
            <AboutPrompter blocks={aboutStory.blocks} label="About the Stoen Mind: a small story" />
          </div>
        </div>
      </div>
    </section>
  );
}
