"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const subscribeReduce = (cb) => {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};
const getReduce = () => window.matchMedia(REDUCE_QUERY).matches;
const getReduceServer = () => false;

/*
 * Teleprompter for the home "About" story.
 *
 * The copy rises from the bottom of a lens-shaped window and leaves at the top. Blocks are
 * projected onto a convex surface: at the centre of the window they're full size and fully
 * opaque, and toward the edges they shrink, fade and bunch together, as if seen through a
 * magnifying lens. Because every block scales around the column's centre, the left edge of the
 * text bows outward in the middle, so the copy itself takes the lens shape.
 *
 * Control:
 *   • plays on its own once the card is on screen (slower while hovered)
 *   • press and drag (mouse/pen) to scrub, with a little inertia on release
 *   • the mouse wheel / trackpad always scrolls the page, never the story (Nancy, Oct 6: the
 *     page got stuck when the cursor rested over the window mid-scroll)
 *   • keyboard on the focused window: ↑/↓, Page Up/Down, Home/End, Space to pause
 *   • play/pause button (WCAG 2.2.2); reduced motion starts paused
 *   • it resumes ~1.8s after the last interaction; at the end it rests, fades and starts again
 *
 * Without JavaScript the window is a plain scrollable box (see .prompter in globals.css).
 * Screen readers get the copy in reading order; the transforms are purely visual.
 */

const SPEED = 26; // px of copy per second
const HOVER_SPEED = 0.4; // fraction of SPEED while the pointer rests on the window
const RESUME_AFTER = 1800; // ms after the last interaction
const START_DELAY = 1400; // ms after the card first comes into view (lets the reveal play)
const END_HOLD = 2600; // ms resting on the last line before starting over
const FADE_MS = 650; // must match .prompter[data-fading] transition
// The window shows the arc −EDGE…EDGE (radians) of the convex surface. A block at angle θ is
// drawn at R·sin θ and scaled by cos θ, so blocks and the gaps between them shrink together
// (a true lens, no overlaps): full size at the centre, cos(EDGE) ≈ 0.58 at the edges.
const EDGE = 0.95;
const HALF_PI = Math.PI / 2;

const TONES = {
  names: "about-names",
  sky: "about-sky",
  present: "about-present",
  expansive: "about-expansive",
  cloud: "about-cloud",
  // Home welcome (copy deck → HOME): playful size/position shifts on single words
  small: "about-small",
  large: "about-large",
  raised: "about-raised",
  narrow: "about-narrow",
};

// Block kinds → classes. title: bold italic; lead: bold; italic; aside: indented and
// letter-spaced; indent: indented; muted: soft grey; closing: italic, letter-spaced.
const KINDS = {
  title: "about-title",
  closing: "about-closing",
  lead: "about-lead",
  italic: "about-italic",
  aside: "about-aside",
  indent: "about-indent",
  muted: "about-muted",
};

function Rich({ content }) {
  if (typeof content === "string") return content;
  return content.map((part, i) =>
    typeof part === "string" ? (
      part
    ) : (
      <span key={i} className={TONES[part.tone]}>
        {part.text}
      </span>
    ),
  );
}

export default function AboutPrompter({ blocks, label = "About the Stoen Mind" }) {
  const viewRef = useRef(null);
  const trackRef = useRef(null);
  const dotRef = useRef(null);
  const apiRef = useRef(null);
  // Reduced motion starts paused; once the visitor presses play/pause their choice wins.
  const reduceMotion = useSyncExternalStore(subscribeReduce, getReduce, getReduceServer);
  const [userPaused, setUserPaused] = useState(null);
  const paused = userPaused ?? reduceMotion;
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const view = viewRef.current;
    const track = trackRef.current;
    const dot = dotRef.current;
    if (!view || !track) return undefined;

    const items = Array.from(track.children);
    const reduce = window.matchMedia(REDUCE_QUERY);

    let H = 0;
    let R = 0;
    let centers = [];
    let pMin = 0;
    let pMax = 0;
    let p = 0; // copy position (px) currently at the centre of the lens
    let ready = false;

    let speed = 0; // current auto speed, eased toward its target
    let wheelLeft = 0; // wheel distance still to travel (eased)
    let vel = 0; // drag inertia (px/s)
    let autoAfter = Infinity; // timestamp after which auto-play may run
    let phase = "play"; // play → hold → fade → play
    let phaseAt = 0;

    let hover = false;
    let keyboardFocus = false;
    let dragging = false;
    let dragStartY = 0;
    let dragStartP = 0;
    let samples = [];

    let inView = false;
    let raf = 0;
    let last = 0;

    const clamp = (v) => Math.min(pMax, Math.max(pMin, v));

    const render = () => {
      track.style.transform = `translate3d(0, ${(H / 2 - p).toFixed(2)}px, 0)`;
      for (let i = 0; i < items.length; i += 1) {
        const el = items[i];
        const d = centers[i] - p; // distance from the lens centre along the copy
        const theta = d / R;
        if (Math.abs(theta) >= Math.min(HALF_PI, EDGE + 0.35)) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
          }
          continue;
        }
        const c = Math.cos(theta);
        const y = R * Math.sin(theta); // where the block lands on the convex surface
        const s = c;
        el.style.visibility = "visible";
        el.style.opacity = Math.max(0, (c - 0.35) / 0.65).toFixed(3);
        el.style.transform = `translate3d(0, ${(y - d).toFixed(2)}px, 0) scale(${s.toFixed(4)})`;
      }
      if (dot) {
        const t = pMax > pMin ? (p - pMin) / (pMax - pMin) : 0;
        dot.style.setProperty("--progress", t.toFixed(4));
      }
    };

    const measure = () => {
      const prev = ready && pMax > pMin ? (p - pMin) / (pMax - pMin) : 0;
      H = view.clientHeight;
      R = H / 2 / Math.sin(EDGE);
      centers = items.map((el) => el.offsetTop + el.offsetHeight / 2);
      // Start with the title just above the lens centre and the first lines inside it.
      pMin = centers[0] + H * 0.2;
      pMax = Math.max(pMin, centers[centers.length - 1]);
      p = pMin + prev * (pMax - pMin);
      ready = true;
      render();
    };

    const canAuto = (now) => !pausedRef.current && !dragging && !keyboardFocus && now >= autoAfter;

    const restartFromTop = (now) => {
      p = pMin;
      speed = 0;
      wheelLeft = 0;
      vel = 0;
      phase = "play";
      delete view.dataset.fading;
      autoAfter = Math.max(autoAfter, now + 900);
    };

    const cancelEnding = () => {
      if (phase !== "play") {
        phase = "play";
        delete view.dataset.fading;
      }
    };

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;

      const auto = canAuto(now);
      const target = auto && phase === "play" ? SPEED * (hover ? HOVER_SPEED : 1) : 0;
      speed += (target - speed) * (1 - Math.exp(-dt / 0.55));

      if (!dragging) {
        if (wheelLeft !== 0) {
          const step = reduce.matches ? wheelLeft : wheelLeft * (1 - Math.exp(-dt * 14));
          p += step;
          wheelLeft -= step;
          if (Math.abs(wheelLeft) < 0.1) {
            p += wheelLeft;
            wheelLeft = 0;
          }
        }
        if (vel !== 0) {
          p += vel * dt;
          vel *= Math.exp(-dt * 4.2);
          if (Math.abs(vel) < 6) vel = 0;
        }
        p += speed * dt;
      }

      const clamped = clamp(p);
      if (clamped !== p) {
        p = clamped;
        vel = 0;
        wheelLeft = 0;
      }

      // End of the story: rest, fade out, start again.
      if (phase === "play" && auto && p >= pMax - 0.5) {
        phase = "hold";
        phaseAt = now;
      } else if (phase === "hold") {
        if (!auto) cancelEnding();
        else if (now - phaseAt >= END_HOLD) {
          phase = "fade";
          phaseAt = now;
          view.dataset.fading = "";
        }
      } else if (phase === "fade" && now - phaseAt >= FADE_MS) {
        restartFromTop(now);
      }

      render();
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !inView || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const interacted = () => {
      autoAfter = performance.now() + RESUME_AFTER;
      cancelEnding();
    };

    /* ── Press and drag (mouse / pen; touch keeps native page scrolling) ─ */
    const onPointerDown = (e) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      dragging = true;
      dragStartY = e.clientY;
      dragStartP = p;
      samples = [{ t: e.timeStamp, y: e.clientY }];
      wheelLeft = 0;
      vel = 0;
      cancelEnding();
      view.setPointerCapture(e.pointerId);
      view.dataset.dragging = "";
      e.preventDefault(); // no text selection while grabbing
    };
    const onPointerMove = (e) => {
      if (!dragging) return;
      p = clamp(dragStartP - (e.clientY - dragStartY));
      samples.push({ t: e.timeStamp, y: e.clientY });
      while (samples.length > 2 && e.timeStamp - samples[0].t > 100) samples.shift();
      if (!raf) render();
    };
    const onPointerUp = (e) => {
      if (!dragging) return;
      dragging = false;
      delete view.dataset.dragging;
      const first = samples[0];
      const lastSample = { t: e.timeStamp, y: e.clientY };
      const span = lastSample.t - first.t;
      if (span > 0 && span < 160) {
        vel = Math.max(-2400, Math.min(2400, (-(lastSample.y - first.y) / span) * 1000));
      }
      interacted();
    };
    const onEnter = (e) => {
      if (e.pointerType !== "touch") hover = true;
    };
    const onLeave = () => {
      hover = false;
    };

    /* ── Keyboard ─────────────────────────────────────────────────────── */
    const onKeyDown = (e) => {
      if (e.target !== view) return;
      const page = H * 0.7;
      const moves = {
        ArrowDown: 56,
        ArrowUp: -56,
        PageDown: page,
        PageUp: -page,
        Home: pMin - (p + wheelLeft),
        End: pMax - (p + wheelLeft),
      };
      if (e.key in moves) {
        e.preventDefault();
        wheelLeft = clamp(p + wheelLeft + moves[e.key]) - p;
        vel = 0;
        interacted();
        start();
      } else if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        apiRef.current?.toggle();
      }
    };
    const onFocus = () => {
      // Keyboard users get a still page to read; a mouse click doesn't pause it.
      keyboardFocus = view.matches(":focus-visible");
    };
    const onBlur = () => {
      keyboardFocus = false;
      interacted();
    };

    apiRef.current = {
      toggle() {
        const next = !pausedRef.current;
        pausedRef.current = next;
        setUserPaused(next);
        if (!next) {
          const now = performance.now();
          if (p >= pMax - 0.5) restartFromTop(now);
          autoAfter = now;
          keyboardFocus = false;
        } else {
          cancelEnding();
        }
      },
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) {
          if (autoAfter === Infinity) autoAfter = performance.now() + START_DELAY;
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.15 },
    );
    const ro = new ResizeObserver(() => measure());
    const onVisibility = () => (document.hidden ? stop() : start());

    view.dataset.enhanced = "";
    measure();
    ro.observe(view);
    ro.observe(track);
    io.observe(view);
    view.addEventListener("pointerdown", onPointerDown);
    view.addEventListener("pointermove", onPointerMove);
    view.addEventListener("pointerup", onPointerUp);
    view.addEventListener("pointercancel", onPointerUp);
    view.addEventListener("pointerenter", onEnter);
    view.addEventListener("pointerleave", onLeave);
    view.addEventListener("keydown", onKeyDown);
    view.addEventListener("focus", onFocus);
    view.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      view.removeEventListener("pointerdown", onPointerDown);
      view.removeEventListener("pointermove", onPointerMove);
      view.removeEventListener("pointerup", onPointerUp);
      view.removeEventListener("pointercancel", onPointerUp);
      view.removeEventListener("pointerenter", onEnter);
      view.removeEventListener("pointerleave", onLeave);
      view.removeEventListener("keydown", onKeyDown);
      view.removeEventListener("focus", onFocus);
      view.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onVisibility);
      delete view.dataset.enhanced;
      delete view.dataset.fading;
      delete view.dataset.dragging;
      track.style.transform = "";
      items.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
        el.style.visibility = "";
      });
    };
  }, []);

  return (
    <div className="prompter-wrap">
      <div className="prompter-frame">
        <div
          ref={viewRef}
          className="prompter about-copy"
          role="region"
          aria-label={label}
          aria-roledescription="teleprompter"
          tabIndex={0}
        >
          <div ref={trackRef} className="prompter-track">
            {blocks.map((block, i) => (
              <p
                key={i}
                className={["prompter-item", KINDS[block.kind] ?? ""].join(" ")}
                data-gap={block.gap}
              >
                <Rich content={block.content} />
              </p>
            ))}
          </div>
        </div>

        <div className="prompter-rail" aria-hidden="true">
          <span ref={dotRef} className="prompter-dot" />
        </div>
      </div>

      <div className="prompter-controls">
        <button
          type="button"
          className="prompter-toggle"
          onClick={() => apiRef.current?.toggle()}
          aria-pressed={paused}
          aria-label={paused ? "Play the story" : "Pause the story"}
        >
          {paused ? (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <path d="M5 3.2v9.6c0 .5.5.8.9.5l7.2-4.8a.6.6 0 0 0 0-1L5.9 2.7c-.4-.3-.9 0-.9.5Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
              <rect x="4" y="3" width="2.6" height="10" rx="1" fill="currentColor" />
              <rect x="9.4" y="3" width="2.6" height="10" rx="1" fill="currentColor" />
            </svg>
          )}
        </button>
        <span className="prompter-hint prompter-hint--fine">Drag to read at your own pace</span>
        <span className="prompter-hint prompter-hint--coarse">Pause anytime to read at your own pace</span>
      </div>
    </div>
  );
}
