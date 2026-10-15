import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import { audiences } from "@/lib/content";

/*
 * "Is this for me?" (Oct 14 design): a mist valley - mist-b's cloud bank on the
 * left, mirrored on the right, meeting in a soft dip under the centre - with
 * the copy in a centred 1062px column. Layout and type live in globals.css under
 * "Is this for me" (plain classes, so Nancy's dev server never misses a new
 * utility).
 */
// One pre-mirrored image per theme (mist-valley.png = the left half of mist-b's
// bank + its mirror, baked in). Two flipped halves left a hairline seam at the
// centre wherever the halfway point fell on a fractional pixel (Oct 14).
const MIST_LIGHT = {
  src: "/images/light/mist-valley.png",
  position: "center bottom",
  opacity: 0.6,
};
const MIST_DARK = {
  src: "/images/dark/night-mist-valley.png",
  position: "center bottom",
  opacity: 0.58,
};

export default function Articles() {
  return (
    <section className="audience @container relative overflow-x-clip">
      {/* Mist valley: one painting, mirrored into a single image */}
      <Artwork
        className="audience-mist articles-mist"
        sizes="(min-width: 900px) 100vw, 900px"
        light={MIST_LIGHT}
        dark={MIST_DARK}
        data-reveal="fade"
        style={{ "--reveal-dur": "2s" }}
      />
      <div className="audience-fade fade-to-bg" aria-hidden="true" />

      <div className="page-gutter relative mx-auto max-w-[1440px]">
        <div className="audience-inner">
          <div data-reveal="" className="audience-lead text-fg">
            <p data-part="rise" className="audience-eyebrow text-eyebrow">
              And you ask, is this for me?
            </p>
            <h2 data-part="blur" className="audience-heading text-balance">
              Yes. And perhaps especially for you.
            </h2>
            {/* Wrapper carries the reveal so the button keeps its own hover lift */}
            <div data-part="rise" style={{ "--j": 1 }} className="audience-cta">
              <Button href="/about" iconEnd="arrow-right">
                Know more about us
              </Button>
            </div>
          </div>

          <ul className="audience-list">
            {audiences.map((item, index) => (
              <li
                key={item.title}
                data-reveal="right"
                style={{ "--i": index, "--delay": "250ms" }}
                className="relative flex flex-col gap-2 py-6 text-fg first:pt-0 last:pb-0"
              >
                {/* Divider draws in from the left */}
                {index > 0 ? (
                  <span
                    data-part="line"
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-px bg-divider"
                  />
                ) : null}
                <h3 className="audience-title">{item.title}</h3>
                <p className="text-body">{item.description}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
