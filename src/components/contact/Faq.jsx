"use client";

import { useId, useState } from "react";
import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SectionHeading from "@/components/home/SectionHeading";
import { faq } from "@/lib/contact";

/** Accordion - one answer open at a time; height eases via the grid-rows 0fr→1fr technique. */
export default function Faq() {
  const [open, setOpen] = useState(-1);
  const baseId = useId();

  return (
    <section className="@container relative overflow-x-clip pb-24 md:pb-40">
      <Artwork
        flip
        className="absolute top-[114px] left-0 aspect-[1440/503] w-[max(100cqw,720px)] dark:[mask-image:linear-gradient(to_bottom,transparent,black_40%)]"
        light={{ src: "/images/light/mist-b.png", crop: [100, 190.85, 0, -90.85] }}
        dark={{ src: "/images/dark/night-mist-bank.png", crop: [100, 190.85, 0, -90.85], opacity: 0.56 }}
        data-reveal="fade"
        style={{ "--reveal-dur": "2s" }}
      />

      <Container className="relative flex flex-col items-center gap-[60px]">
        <SectionHeading title={faq.title} description={faq.description} />

        <ul data-reveal="" className="flex w-full max-w-[844px] flex-col gap-4">
          {faq.items.map((item, index) => {
            const expanded = open === index;
            const buttonId = `${baseId}-q${index}`;
            const panelId = `${baseId}-a${index}`;
            return (
              <li
                key={item.question}
                data-part="rise"
                style={{ "--j": index }}
                className="hover-outline rounded-ui border border-surface-line bg-surface has-[button[aria-expanded=true]]:shadow-[0_12px_28px_-18px_var(--color-surface-shadow)]"
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={panelId}
                    onClick={() => setOpen(expanded ? -1 : index)}
                    className="flex w-full cursor-pointer items-center justify-between gap-6 px-6 py-[17px] text-left font-serif text-lg leading-6 text-fg"
                  >
                    {item.question}
                    <Icon
                      name="caret-down"
                      className={`shrink-0 transition-transform duration-300 ease-soft ${expanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!expanded}
                  className={`grid transition-[grid-template-rows] duration-400 ease-soft motion-reduce:transition-none ${
                    expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-5 text-body">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
