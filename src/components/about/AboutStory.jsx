import Artwork from "@/components/ui/Artwork";
import AboutPrompter from "@/components/home/AboutPrompter";
import { aboutStory } from "@/lib/content";

/**
 * About page: the home page's "A Small Story" card (see home/Welcome.jsx), placed under the hero.
 * Same card, clouds and teleprompter; only the outer spacing differs, because there's no hero
 * landscape to leave room for here. The hero's "Explore our journey" button scrolls to #about-story.
 * The "Know more about us" button is left out, since it links to this page.
 */
export default function AboutStory() {
  return (
    <section className="@container relative overflow-x-clip pt-8 pb-8 md:pt-20 md:pb-20">
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

        {/* The anchor is on the card, so "Explore our journey" lands on the card, not the padding above it */}
        <div
          id="about-story"
          data-reveal="zoom"
          className="relative z-10 mx-auto scroll-mt-6 flex flex-col items-center gap-6 rounded-ui bg-linear-to-b from-card-from to-card-to px-6 py-10 backdrop-blur-[4px] sm:p-12"
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
        </div>
      </div>
    </section>
  );
}
