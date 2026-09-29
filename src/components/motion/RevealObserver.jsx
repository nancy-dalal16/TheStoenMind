"use client";

import { useEffect } from "react";

const SELECTOR = "[data-reveal]:not(.is-revealed)";

/**
 * One IntersectionObserver for the whole page: adds `.is-revealed` to every
 * `[data-reveal]` element as it scrolls into view (once). The styles live in
 * globals.css under "Motion". Elements added later (client navigation) are
 * picked up by a MutationObserver. Without IntersectionObserver, or with
 * reduced motion, everything is revealed immediately.
 */
export default function RevealObserver() {
  useEffect(() => {
    const revealAll = () => document.querySelectorAll(SELECTOR).forEach((el) => el.classList.add("is-revealed"));

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return undefined;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            io.unobserve(entry.target);
          }
        }
      },
      // Start a touch before the element is fully on screen, so reveals feel anticipatory.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    const observeAll = () => document.querySelectorAll(SELECTOR).forEach((el) => io.observe(el));
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
