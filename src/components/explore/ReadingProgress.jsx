"use client";

import { useEffect, useRef } from "react";

/**
 * A hairline across the very top of the window that fills as you read the article body
 * (`targetId`). Written straight to a CSS variable inside rAF, so React never re-renders.
 */
export default function ReadingProgress({ targetId }) {
  const bar = useRef(null);

  useEffect(() => {
    const target = document.getElementById(targetId);
    if (!target || !bar.current) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = target.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.6;
      const read = Math.min(1, Math.max(0, (window.innerHeight * 0.4 - rect.top) / Math.max(total, 1)));
      bar.current?.style.setProperty("--progress", read.toFixed(4));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [targetId]);

  return <div ref={bar} aria-hidden="true" className="ex-progress" />;
}
