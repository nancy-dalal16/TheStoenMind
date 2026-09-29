"use client";

import { useEffect, useRef } from "react";

/**
 * Moves its content at a slower rate than the page scroll ("background scroll").
 *
 * - `speed`    0–1. The fraction of scroll distance the layer drifts *down*
 *              relative to the page (0 = normal scrolling, 0.3 = the background
 *              moves 30% slower than the content).
 * - `maxShift` cap on the drift, as a fraction of the layer's own height, so
 *              the layer always settles in a known place.
 *
 * It writes one `transform` per animation frame and never re-renders React. It is
 * skipped while the layer is off-screen and disabled for prefers-reduced-motion.
 * `className` positions the layer; children fill it.
 */
export default function ParallaxLayer({ speed = 0.3, maxShift = 0.2, className = "", children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let visible = true;

    const apply = () => {
      frame = 0;
      if (reduceMotion.matches) {
        el.style.transform = "";
        return;
      }
      const limit = el.offsetHeight * maxShift;
      const shift = Math.min(Math.max(window.scrollY * speed, 0), limit);
      el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(apply);
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) onScroll();
    });
    observer.observe(el);

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    reduceMotion.addEventListener("change", onScroll);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      reduceMotion.removeEventListener("change", onScroll);
    };
  }, [speed, maxShift]);

  return (
    <div ref={ref} aria-hidden="true" className={`pointer-events-none will-change-transform ${className}`}>
      {children}
    </div>
  );
}
