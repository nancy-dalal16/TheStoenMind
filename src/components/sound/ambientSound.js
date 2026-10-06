/**
 * Ambient background sound (public/audio). Lives outside React, like the theme store, so it
 * keeps playing across page navigations (the root layout never remounts).
 *
 * Browsers don't let a page start sound by itself: Chrome, Safari and Firefox block it until
 * the visitor interacts (a click, tap or key press; scrolling doesn't count). So:
 *   - on load we try to play (works where the browser already trusts the site), and
 *   - otherwise it starts, fading in softly, on the visitor's first click / tap / key press.
 * The header's sound button turns it off and on; "off" is remembered for later visits.
 *
 * The track fades out at its end, so a plain loop would jump from silence back to full sound.
 * Two players take turns instead and crossfade over CROSSFADE seconds at each loop.
 * Volume goes through Web Audio gain nodes, because iOS ignores `audio.volume`.
 * The sound fades out while the tab is hidden and back in when it returns.
 */

export const SOUND_STORAGE_KEY = "stoen-sound";
const SRC = "/audio/Day-background-audio-2.mp3";
const LEVEL = 0.4; // overall loudness: a background, never in the way
const FADE_IN = 3.5; // s, first start / turning back on
const FADE_OUT = 1.2; // s, turning off / tab hidden
const CROSSFADE = 6; // s, between the end of one loop and the start of the next

const listeners = new Set();
let ctx = null;
let master = null;
let players = []; // [{ el, gain }]
let current = 0;
let playing = false;
let crossfading = false;
let pauseTimer = 0;

function readPref() {
  try {
    return localStorage.getItem(SOUND_STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}
function writePref(on) {
  try {
    localStorage.setItem(SOUND_STORAGE_KEY, on ? "on" : "off");
  } catch {
    /* private mode: the choice lasts for this visit */
  }
}

function emit() {
  listeners.forEach((listener) => listener());
}

function ramp(param, to, seconds) {
  const now = ctx.currentTime;
  param.cancelScheduledValues(now);
  param.setValueAtTime(param.value, now);
  param.linearRampToValueAtTime(to, now + seconds);
}

function setup() {
  if (ctx) return true;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  players = [0, 1].map(() => {
    const el = new Audio(SRC);
    el.preload = "auto";
    el.crossOrigin = "anonymous";
    const gain = ctx.createGain();
    gain.gain.value = 0;
    ctx.createMediaElementSource(el).connect(gain).connect(master);
    el.addEventListener("timeupdate", onTimeUpdate);
    return { el, gain };
  });
  players[0].gain.gain.value = 1;
  return true;
}

/* At the end of a loop, start the other player and crossfade into it. */
function onTimeUpdate() {
  const now = players[current];
  if (!playing || crossfading || !now.el.duration) return;
  if (now.el.currentTime < now.el.duration - CROSSFADE) return;
  crossfading = true;
  const nextIndex = 1 - current;
  const next = players[nextIndex];
  next.el.currentTime = 0;
  next.gain.gain.value = 0;
  next.el.play().catch(() => {});
  ramp(next.gain.gain, 1, CROSSFADE);
  ramp(now.gain.gain, 0, CROSSFADE);
  current = nextIndex;
  setTimeout(() => {
    now.el.pause();
    crossfading = false;
  }, CROSSFADE * 1000 + 100);
}

/** Start (or resume) with a soft fade-in. Resolves true if sound is actually playing. */
let starting = null;
function play() {
  starting ??= start().finally(() => (starting = null));
  return starting;
}
async function start() {
  if (playing) return true;
  if (!setup()) return false;
  clearTimeout(pauseTimer);
  // Without a click/tap/key press, resume() never settles where sound isn't allowed yet.
  if (ctx.state !== "running") {
    await Promise.race([ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
  }
  if (ctx.state !== "running") return false; // blocked until the visitor interacts
  try {
    await players[current].el.play();
  } catch {
    return false;
  }
  playing = true;
  ramp(master.gain, LEVEL, FADE_IN);
  emit();
  return true;
}

function pause() {
  if (!ctx || !playing) return;
  playing = false;
  ramp(master.gain, 0, FADE_OUT);
  clearTimeout(pauseTimer);
  pauseTimer = setTimeout(() => players.forEach((p) => p.el.pause()), FADE_OUT * 1000 + 50);
  emit();
}

/* ---- for React (useSyncExternalStore) ---- */

export function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
export const getSnapshot = () => playing;
export const getServerSnapshot = () => false;

/* ---- actions ---- */

export function toggleSound() {
  if (playing) {
    writePref(false);
    pause();
  } else {
    writePref(true);
    play();
  }
}

/**
 * Called once from <AmbientSound />. Tries to start right away; otherwise waits for the first
 * click / tap / key press (outside the sound button, which handles itself). Returns a cleanup.
 */
export function initAmbientSound() {
  const events = ["pointerdown", "keydown", "touchend"];
  let waiting = false;

  const onGesture = (event) => {
    if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return;
    stopWaiting();
    if (!readPref() || !setup()) return;
    // Unlock inside the gesture itself: iOS only allows it synchronously here.
    ctx.resume().catch(() => {});
    players[current].el.play().catch(() => {});
    play();
  };
  const stopWaiting = () => {
    if (!waiting) return;
    waiting = false;
    events.forEach((type) => window.removeEventListener(type, onGesture, true));
  };
  const startWaiting = () => {
    if (waiting) return;
    waiting = true;
    events.forEach((type) => window.addEventListener(type, onGesture, { capture: true, passive: true }));
  };

  // Fade out while the tab is hidden; come back when it's visible again.
  let resumeOnShow = false;
  const onVisibility = () => {
    if (document.hidden) {
      resumeOnShow = playing;
      pause();
    } else if (resumeOnShow && readPref()) {
      resumeOnShow = false;
      play();
    }
  };
  document.addEventListener("visibilitychange", onVisibility);

  if (readPref()) {
    startWaiting();
    // Some browsers allow sound straight away (e.g. a site the visitor plays media on often).
    // Creating the AudioContext without a gesture only logs a warning where it isn't allowed.
    play().then((ok) => ok && stopWaiting());
  }

  return () => {
    stopWaiting();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
