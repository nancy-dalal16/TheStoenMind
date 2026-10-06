"use client";

import { useSyncExternalStore } from "react";
import { getServerSnapshot, getSnapshot, subscribe, toggleSound } from "./ambientSound";

/**
 * Floating sound switch, bottom-left on every page (Nancy, Oct 6: not in the header).
 * Three bars sway while the sound plays and settle flat when it's off.
 * Styles: globals.css → "Ambient sound toggle".
 */
export default function SoundToggle() {
  const playing = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <button
      type="button"
      data-sound-toggle=""
      data-playing={playing ? "" : undefined}
      onClick={toggleSound}
      aria-pressed={playing}
      title={playing ? "Sound on" : "Sound off"}
      className="sound-toggle"
    >
      <span className="sound-bars" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="sr-only">Background sound</span>
    </button>
  );
}
