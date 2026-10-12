"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Product images: a swipeable stage (native scroll-snap, like the home carousel) with
 * thumbnails underneath. Covers float with a soft shadow; photos fill the stage.
 * `focusSrc` (the selected variant's image) slides the stage to that image.
 */
export default function ProductGallery({ images, title, focusSrc }) {
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const count = images.length;

  const goTo = useCallback(
    (i, behavior = "smooth") => {
      const track = trackRef.current;
      if (!track) return;
      const target = Math.max(0, Math.min(count - 1, i));
      track.scrollTo({ left: target * track.clientWidth, behavior });
    },
    [count],
  );

  // Track the visible slide while scrolling / swiping
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setIndex(Math.round(track.scrollLeft / Math.max(1, track.clientWidth))));
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => {
      track.scrollLeft = Math.round(track.scrollLeft / Math.max(1, track.clientWidth)) * track.clientWidth;
    });
    ro.observe(track);
    return () => {
      cancelAnimationFrame(frame);
      track.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, []);

  // A new variant with its own image: show it
  useEffect(() => {
    if (!focusSrc) return;
    const i = images.findIndex((image) => image.src === focusSrc);
    if (i >= 0) goTo(i);
  }, [focusSrc, images, goTo]);

  const onKeyDown = (event) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  };

  if (!count) return <div className="shop-stage aspect-[4/5] rounded-ui" />;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={`${title} images`} className="shop-gallery">
      <div className="carousel shop-gallery-stage relative">
        <div
          ref={trackRef}
          tabIndex={count > 1 ? 0 : -1}
          onKeyDown={onKeyDown}
          aria-label={count > 1 ? `${title}: use the arrow keys to see more images` : undefined}
          className="carousel-track shop-stage aspect-[4/5] w-full rounded-ui focus-visible:outline-offset-[-2px]"
        >
          {images.map((image, i) => (
            <div
              key={image.src}
              className="relative h-full w-full shrink-0"
              role={count > 1 ? "group" : undefined}
              aria-roledescription={count > 1 ? "slide" : undefined}
              aria-label={count > 1 ? `${i + 1} of ${count}` : undefined}
            >
              <div className={`absolute ${image.fit === "cover" ? "inset-0" : "inset-[9%_16%]"}`}>
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 680px, 100vw"
                  priority={i === 0}
                  loading={i === 0 ? undefined : "eager"}
                  draggable={false}
                  className={image.fit === "cover" ? "object-cover" : "shop-cover object-contain"}
                />
              </div>
            </div>
          ))}
        </div>

        {count > 1 ? (
          <>
            <button
              type="button"
              className="carousel-arrow absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-fg shadow-[0_6px_16px_-8px_rgb(0_0_0/0.35)] backdrop-blur-sm hover:bg-bg hover:-translate-x-0.5"
              onClick={() => goTo(index - 1)}
              disabled={index === 0}
              aria-label="Previous image"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M10 3.5 5.5 8l4.5 4.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              className="carousel-arrow absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-bg/85 text-fg shadow-[0_6px_16px_-8px_rgb(0_0_0/0.35)] backdrop-blur-sm hover:bg-bg hover:translate-x-0.5"
              onClick={() => goTo(index + 1)}
              disabled={index === count - 1}
              aria-label="Next image"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                <path
                  d="M6 3.5 10.5 8 6 12.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </>
        ) : null}
      </div>

      {count > 1 ? (
        <>
          <ul className="shop-gallery-thumbs mt-4 flex gap-3" aria-label="Choose an image">
            {images.map((image, i) => (
              <li key={image.src}>
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show image ${i + 1} of ${count}`}
                  aria-current={i === index ? "true" : undefined}
                  className="shop-thumb shop-thumb-button relative block aspect-[4/5] w-16 cursor-pointer overflow-hidden rounded-ui md:w-[72px]"
                >
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="72px"
                    className={image.fit === "cover" ? "object-cover" : "object-contain p-2"}
                  />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </div>
  );
}
