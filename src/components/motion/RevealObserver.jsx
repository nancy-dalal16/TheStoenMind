"use client";

import { useEffect } from "react";

const REVEAL = "[data-reveal]";
// Entrance keyframes (hero copy, paintings, clouds, header): Tailwind `animate-*` utilities.
const ENTRANCE = '[class*="animate-"]';

/**
 * Plays the site's motion every time a section comes into view, not just on first load.
 *
 * 1. Scroll reveals (`[data-reveal]`, styles in globals.css under "Motion"): `.is-revealed` is
 *    added as the element scrolls in, and taken away again once it is completely off screen,
 *    with transitions switched off for that moment (`.reveal-reset`), so it is quietly back in
 *    its "before" state and reveals afresh on the next visit.
 * 2. Entrance keyframes (`animate-*`): once the element is completely off screen its animations
 *    are rewound to the start and paused; they play again when it comes back into view.
 *
 * Hiding only ever happens off screen, so nothing visibly disappears. Elements added later
 * (client navigation, tab panels) are picked up by a MutationObserver. Without
 * IntersectionObserver, or with reduced motion, everything is simply shown.
 */
export default function RevealObserver() {
  useEffect(() => {
    const revealAll = () => document.querySelectorAll(REVEAL).forEach((el) => el.classList.add("is-revealed"));

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealAll();
      return undefined;
    }

    const show = (el) => {
      if (el.classList.contains("is-revealed")) return;
      if (el.classList.contains("reveal-reset")) {
        el.classList.remove("reveal-reset");
        void el.offsetWidth; // commit the "before" state so the transition runs
      }
      el.classList.add("is-revealed");
    };

    const hide = (el) => {
      if (!el.classList.contains("is-revealed")) return;
      el.classList.add("reveal-reset");
      el.classList.remove("is-revealed");
    };

    const keyframes = (el) => el.getAnimations().filter((a) => typeof CSSAnimation !== "undefined" && a instanceof CSSAnimation);

    const rewind = (el) => {
      keyframes(el).forEach((a) => {
        a.pause();
        a.currentTime = 0;
      });
      el.dataset.rewound = "";
    };

    const replay = (el) => {
      if (!("rewound" in el.dataset)) return;
      delete el.dataset.rewound;
      keyframes(el).forEach((a) => a.play());
    };

    // Reveal: start a touch before the element is fully on screen, so it feels anticipatory.
    const enter = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          if (entry.target.matches(REVEAL)) show(entry.target);
          if (entry.target.matches(ENTRANCE)) replay(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );

    // Reset: only once the element has left the viewport entirely.
    const leave = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) continue;
        if (entry.target.matches(REVEAL)) hide(entry.target);
        if (entry.target.matches(ENTRANCE)) rewind(entry.target);
      }
    });

    const watched = new WeakSet();
    const observeAll = () => {
      document.querySelectorAll(`${REVEAL}, ${ENTRANCE}`).forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        enter.observe(el);
        leave.observe(el);
      });
    };
    observeAll();

    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      enter.disconnect();
      leave.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
