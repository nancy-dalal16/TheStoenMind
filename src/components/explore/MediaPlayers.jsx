"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { getSnapshot as ambientPlaying, toggleSound } from "@/components/sound/ambientSound";

/** When a story's own sound starts, quietly switch the site's background sound off. */
function hushAmbient() {
  if (ambientPlaying()) toggleSound();
}

const time = (s) => {
  if (!Number.isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

/**
 * Story audio: a quiet card with artwork, title, play/pause, a scrubber and the time.
 * Built on a real <audio> element, so every browser-supported format plays (MP3, M4A, WAV,
 * OGG, AAC, FLAC). Keyboard: Space/Enter on the button, arrows on the scrubber.
 */
export function AudioPlayer({ src, mime, title, subtitle, artwork }) {
  const audio = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = () => {
    const el = audio.current;
    if (!el) return;
    if (el.paused) {
      hushAmbient();
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  return (
    <div className="ex-audio">
      {artwork ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={artwork.src} alt="" width={artwork.width} height={artwork.height} className="ex-audio-art" loading="lazy" />
      ) : (
        <span className="ex-audio-art ex-audio-art-empty" aria-hidden="true" />
      )}
      <div className="ex-audio-main">
        <p className="ex-audio-title">{title}</p>
        {subtitle ? <p className="ex-audio-sub">{subtitle}</p> : null}
        <div className="ex-audio-controls">
          <button type="button" onClick={toggle} className="ex-audio-play" aria-label={playing ? `Pause ${title}` : `Play ${title}`}>
            <span aria-hidden="true" className={playing ? "ex-icon-pause" : "ex-icon-play"} />
          </button>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={current}
            onChange={(e) => {
              if (audio.current) audio.current.currentTime = Number(e.target.value);
            }}
            aria-label={`Position in ${title}`}
            aria-valuetext={`${time(current)} of ${time(duration)}`}
            className="ex-audio-range"
            style={{ "--played": duration ? `${(current / duration) * 100}%` : "0%" }}
          />
          <span className="ex-audio-time" aria-hidden="true">
            {time(current)} / {time(duration)}
          </span>
        </div>
      </div>
      <audio
        ref={audio}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
      >
        <source src={src} type={mime || undefined} />
      </audio>
    </div>
  );
}

/**
 * Story video. "loop" plays silently and endlessly like a GIF (paused for visitors who prefer
 * reduced motion, who get the controls instead); otherwise it shows the normal controls.
 */
const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (callback) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};

export function StoryVideo({ src, mime, poster, loop, title }) {
  const ref = useRef(null);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);

  useEffect(() => {
    if (!loop || !ref.current) return;
    if (reduced) ref.current.pause();
    else ref.current.play().catch(() => {});
  }, [loop, reduced]);

  const silent = loop && !reduced;

  return (
    <video
      ref={ref}
      className="ex-video"
      poster={poster?.src}
      controls={!silent}
      muted={loop}
      loop={loop}
      autoPlay={silent}
      playsInline
      preload={loop ? "auto" : "metadata"}
      aria-label={title || undefined}
      onPlay={loop ? undefined : hushAmbient}
    >
      <source src={src} type={mime === "video/quicktime" ? "video/mp4" : mime || undefined} />
    </video>
  );
}
