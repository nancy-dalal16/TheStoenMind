"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/*
 * Swipeable product images for a "Ways to wander" card.
 *
 * The track is a native horizontal scroller with scroll-snap, so touch and trackpad swipes
 * work without any JS. On top of that:
 *   • mouse/pen: press and drag (snapping is off while dragging, then it settles to the nearest
 *     image, or the next one if the flick was quick enough)
 *   • arrows (shown on hover / keyboard focus) and dots
 *   • ← / → on the focused track
 * With a single image it renders the image alone, with no controls.
 */
export default function ProductCarousel({ images, label, sizes }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const multiple = count > 1;

  const goTo = useCallback(
    (i, behavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const next = Math.max(0, Math.min(count - 1, i));
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: next * track.clientWidth, behavior: reduce ? "auto" : behavior });
    },
    [count],
  );

  // Keep the dots in step with however the track was moved (swipe, drag, arrows, keys).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth)));
      });
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
    };
  }, [multiple]);

  // Mouse / pen drag (touch keeps native scrolling).
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return undefined;
    let startX = 0;
    let startLeft = 0;
    let startT = 0;
    let dragging = false;
    let moved = false;

    const onDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      moved = false;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      startT = e.timeStamp;
      track.setPointerCapture(e.pointerId);
      track.dataset.dragging = "";
      e.preventDefault();
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) moved = true;
      track.scrollLeft = startLeft - dx;
    };
    const onUp = (e) => {
      if (!dragging) return;
      dragging = false;
      delete track.dataset.dragging;
      const w = Math.max(1, track.clientWidth);
      const dx = e.clientX - startX;
      const fast = Math.abs(dx) / Math.max(1, e.timeStamp - startT) > 0.4; // px per ms
      const from = Math.round(startLeft / w);
      let target = Math.round(track.scrollLeft / w);
      if (fast && Math.abs(dx) > 24 && target === from) target = from + (dx < 0 ? 1 : -1);
      goTo(target);
    };
    // A drag shouldn't count as a click on anything inside.
    const onClick = (e) => {
      if (moved) {
        e.preventDefault();
        e.stopPropagation();
        moved = false;
      }
    };

    track.dataset.draggable = "";
    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointercancel", onUp);
    track.addEventListener("click", onClick, true);
    return () => {
      delete track.dataset.draggable;
      delete track.dataset.dragging;
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointercancel", onUp);
      track.removeEventListener("click", onClick, true);
    };
  }, [multiple, goTo]);

  // Stay on the same image if the card is resized.
  useEffect(() => {
    const track = trackRef.current;
    if (!track || !multiple) return undefined;
    const ro = new ResizeObserver(() => {
      track.scrollLeft = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)) * track.clientWidth;
    });
    ro.observe(track);
    return () => ro.disconnect();
  }, [multiple]);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(index - 1);
    }
  };

  const slide = (image, i) => (
    <div
      key={image.src}
      className="relative h-full w-full shrink-0"
      role={multiple ? "group" : undefined}
      aria-roledescription={multiple ? "slide" : undefined}
      aria-label={multiple ? `${i + 1} of ${count}` : undefined}
    >
      {/* Padded stage: the product floats in the box with room around it, as in the reference */}
      <div className="absolute inset-[9%_13%]">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={sizes}
          draggable={false}
          // Every slide loads up front: lazy images sitting off to the side of a scroller can
          // flash in late when swiped to. They're small (~230px wide on desktop).
          loading="eager"
          className="object-contain [filter:drop-shadow(0_1px_1.5px_rgb(40_38_32/0.12))_drop-shadow(0_12px_14px_rgb(40_38_32/0.12))] dark:[filter:drop-shadow(0_1px_2px_rgb(0_0_0/0.25))_drop-shadow(0_14px_18px_rgb(0_0_0/0.3))]"
        />
      </div>
    </div>
  );

  if (!multiple) {
    return (
      <div className="w-full">
        <div className="relative aspect-square w-full sm:aspect-[4/5]">{slide(images[0], 0)}</div>
        <div className="h-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="carousel relative w-full" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={trackRef}
        className="carousel-track aspect-square w-full rounded-ui sm:aspect-[4/5] focus-visible:outline-offset-[-2px]"
        tabIndex={0}
        aria-label={`${label}: use the arrow keys to see more`}
        onKeyDown={onKeyDown}
      >
        {images.map(slide)}
      </div>

      <button
        type="button"
        className="carousel-arrow absolute top-[calc(50%-12px)] left-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-fg shadow-[0_6px_16px_-8px_rgb(0_0_0/0.35)] backdrop-blur-sm hover:bg-bg hover:-translate-x-0.5"
        onClick={() => goTo(index - 1)}
        disabled={index === 0}
        aria-label="Previous image"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        type="button"
        className="carousel-arrow absolute top-[calc(50%-12px)] right-2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-fg shadow-[0_6px_16px_-8px_rgb(0_0_0/0.35)] backdrop-blur-sm hover:bg-bg hover:translate-x-0.5"
        onClick={() => goTo(index + 1)}
        disabled={index === count - 1}
        aria-label="Next image"
      >
        <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
          <path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <div className="flex h-6 justify-center gap-1.5">
        {images.map((image, i) => (
          <button
            key={image.src}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Show image ${i + 1} of ${count}`}
            aria-current={i === index ? "true" : undefined}
            className="flex h-6 items-center px-0.5"
          >
            <span
              className={[
                "carousel-dot block h-1.5 rounded-full",
                i === index ? "w-5 bg-fg/70" : "w-1.5 bg-fg/25 hover:bg-fg/45",
              ].join(" ")}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
