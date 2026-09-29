"use client";

import { useEffect, useState } from "react";

// Stay put near the top of the page, then hide/show only after a deliberate
// scroll of this many pixels in one direction (ignores trackpad jitter).
const HIDE_AFTER = 160;
const TOLERANCE = 12;

/**
 * Sticky shell for the site header.
 * - `data-scrolled` once the page moves: the header slims down and swaps the
 *   inline links for the menu button (via `group-data-[scrolled]/header:`).
 * - `data-hidden` while scrolling down: the header slides away so the reader has
 *   the full screen; any scroll back up brings it straight back. It never hides
 *   near the top, and it reappears whenever something inside it (or the menu,
 *   whose portal still bubbles React events here) takes focus.
 *   The slide itself is `.site-header` in globals.css.
 *
 * The shell keeps its full height at all times, so the page never jumps when
 * the bar inside it shrinks. It ignores the pointer and only the bar takes clicks,
 * so the transparent strip under a slimmed bar doesn't block the page.
 */
export default function StickyHeader({ children }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let frame = 0;
    let lastY = Math.max(0, window.scrollY);
    let turnY = lastY; // where the current scroll direction started
    let lastDir = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const y = Math.max(0, window.scrollY); // clamp iOS rubber-banding
        const dir = Math.sign(y - lastY);
        if (dir !== 0 && dir !== lastDir) {
          turnY = lastY;
          lastDir = dir;
        }

        setScrolled(y > 8);
        if (y < HIDE_AFTER) setHidden(false);
        else if (dir > 0 && y - turnY > TOLERANCE) setHidden(true);
        else if (dir < 0 && turnY - y > TOLERANCE) setHidden(false);

        lastY = y;
      });
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
      data-hidden={hidden ? "" : undefined}
      onFocusCapture={() => setHidden(false)}
      className="site-header group/header pointer-events-none sticky top-0 z-40 h-[88px] md:h-[110px] lg:h-[clamp(88px,15svh,110px)]"
    >
      {children}
    </header>
  );
}
