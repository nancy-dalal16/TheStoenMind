"use client";

import { useEffect, useState } from "react";

/**
 * Sticky shell for the site header. Adds `data-scrolled` once the page moves,
 * which the header uses (via `group-data-[scrolled]/header:`) to slim down and
 * frost its background.
 *
 * The shell keeps its full height at all times, so the page never jumps when
 * the bar inside it shrinks. It ignores the pointer and only the bar takes clicks,
 * so the transparent strip under a slimmed bar doesn't block the page.
 */
export default function StickyHeader({ children }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setScrolled(window.scrollY > 8));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header
      data-scrolled={scrolled ? "" : undefined}
      className="group/header pointer-events-none sticky top-0 z-40 h-[88px] md:h-[110px] lg:h-[clamp(88px,15svh,110px)]"
    >
      {children}
    </header>
  );
}
