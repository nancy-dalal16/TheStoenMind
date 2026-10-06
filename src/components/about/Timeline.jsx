"use client";

import { useId, useRef, useState } from "react";
import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/home/SectionHeading";
import { timeline } from "@/lib/about";

/**
 * "Evolution of the Atelier" - milestone tabs (WAI-ARIA tabs pattern: arrow keys,
 * Home/End, roving tabindex) over a panel that softly re-enters on change.
 */
export default function Timeline() {
  const { title, description, milestones } = timeline;
  const [active, setActive] = useState(0);
  const tabsRef = useRef([]);
  const baseId = useId();
  const current = milestones[active];

  const select = (index) => {
    const next = (index + milestones.length) % milestones.length;
    setActive(next);
    tabsRef.current[next]?.focus();
  };

  const onKeyDown = (event) => {
    const keys = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: milestones.length - 1 };
    if (event.key in keys) {
      event.preventDefault();
      select(keys[event.key]);
    }
  };

  return (
    <section className="py-[60px]">
      <Container>
        <div className="relative isolate flex flex-col items-center gap-10 overflow-hidden rounded-ui bg-surface-tint px-5 py-16 sm:px-10 md:gap-[60px] lg:p-[100px]">
          {/* Mist rising from the bottom edge (mirrored, as in the design) */}
          <Artwork
            flip
            className="absolute bottom-0 left-0 -z-10 aspect-[1280/447] w-full min-w-[720px] dark:[mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
            light={{ src: "/images/light/mist-b.png", crop: [100, 190.85, 0, -90.85] }}
            dark={{ src: "/images/dark/night-mist-bank.png", crop: [100, 190.85, 0, -90.85], opacity: 0.54 }}
            data-reveal="fade"
            style={{ "--reveal-dur": "2s" }}
          />

          <SectionHeading title={title} description={description} />

          <div data-reveal="" className="flex w-full flex-col items-center gap-8">
            <div
              role="tablist"
              aria-label="Milestones"
              onKeyDown={onKeyDown}
              className="flex max-w-full flex-wrap justify-center gap-3 lg:gap-8"
            >
              {milestones.map((milestone, index) => {
                const selected = index === active;
                return (
                  <button
                    key={milestone.id}
                    ref={(el) => {
                      tabsRef.current[index] = el;
                    }}
                    id={`${baseId}-tab-${milestone.id}`}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    aria-controls={`${baseId}-panel`}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => setActive(index)}
                    className={`h-[51px] cursor-pointer rounded-ui px-6 font-sans text-base leading-5 whitespace-nowrap transition-[background-color,color,box-shadow] duration-300 ${
                      selected
                        ? "bg-primary font-medium text-on-primary shadow-[0_10px_24px_-14px_var(--color-primary)]"
                        : "bg-surface-soft text-fg hover:bg-surface"
                    }`}
                  >
                    {milestone.tab}
                  </button>
                );
              })}
            </div>

            <div
              id={`${baseId}-panel`}
              role="tabpanel"
              aria-labelledby={`${baseId}-tab-${current.id}`}
              className="w-full rounded-ui bg-surface p-8 sm:p-10 lg:p-[60px]"
            >
              {/* Re-keyed so the content softly re-enters on each change */}
              <div
                key={current.id}
                className="flex flex-col items-center gap-8 motion-safe:animate-rise-in md:flex-row md:gap-10"
              >
                <div className="flex flex-1 flex-col items-center gap-1 text-center">
                  <p className="font-serif text-[clamp(2.5rem,2.1rem+1.2vw,3rem)] leading-none text-fg">{current.year}</p>
                  <p className="font-sans text-base font-medium tracking-[0.08em] text-eyebrow uppercase">{current.label}</p>
                </div>
                <span aria-hidden="true" className="h-px w-full bg-divider md:h-36 md:w-px" />
                <div className="flex flex-1 flex-col gap-5 py-0 text-fg md:py-4">
                  <h3 className="font-serif text-[clamp(1.5rem,1.3rem+0.6vw,1.75rem)] leading-[1.15]">{current.title}</h3>
                  <p className="text-body">{current.body}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
