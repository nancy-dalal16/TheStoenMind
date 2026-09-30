import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";

const lines = [
  "The thoughts that passed too quickly.",
  "The feelings that evaporated before they were seen.",
  "The parts of you that you taught to stay quiet.",
  "They are not gone.",
  "They are simply…waiting to be witnessed.",
];

/** Welcome letter card resting on the hero landscape. */
export default function Welcome() {
  return (
    // Top padding leaves room for the whole hero landscape before the card:
    // (-0.0721 start + 0.08 parallax drift + 0.90 × 0.4471 painting) × width ≈ 0.41 × width,
    // minus the card frame's own top padding. On lg+ the landscape starts higher
    // (tucked behind the hero copy by --hero-pb + 0.0889 × width), so less room is needed.
    // Only the faded fog at the painting's foot sits behind the card.
    <section
      className={[
        "@container relative [--land-w:max(115.56cqw,560px)]",
        "pt-[calc(var(--land-w)*0.41-4rem)] md:pt-[calc(var(--land-w)*0.41-5rem)]",
        "lg:pt-[calc(var(--land-w)*0.3211-clamp(88px,10.14cqw,146px)-5rem-var(--hero-shift))]",
        // Mirrors Hero's --hero-shift (the hero copy moved down on short screens, the landscape didn't).
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
          className="relative z-10 mx-auto flex max-w-[626px] flex-col items-center gap-8 rounded-2xl bg-linear-to-b from-card-from to-card-to px-6 py-10 backdrop-blur-[4px] sm:p-12"
        >
          <div className="flex max-w-[516px] flex-col gap-5 text-center text-body-lg leading-[26px] text-fg">
            <p data-part="rise" style={{ "--j": 0 }}>
              What a wonderful moment for you to have arrived. <br className="hidden sm:block" />
              There is an undisturbed world, waiting exactly where you are.
            </p>
            <p data-part="rise" style={{ "--j": 1 }}>
              You&rsquo;ve probably been moving through a world that fills the space around you before
              you&rsquo;ve had the chance to meet yourself within it.
            </p>
            <p data-part="rise" style={{ "--j": 2 }}>
              Here, in this unperturbed world, you are not required to react. <br className="hidden sm:block" />
              You are invited to notice.
            </p>
            <p data-part="rise" style={{ "--j": 3 }}>
              {lines.map((line, index) => (
                <span key={line}>
                  {line}
                  {index < lines.length - 1 ? <br /> : null}
                </span>
              ))}
            </p>
          </div>

          <div data-part="rise" style={{ "--j": 4 }}>
            <Button href="/about">Know more about us</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
