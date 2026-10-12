/**
 * Ambient background sound (public/audio). Lives outside React, like the theme store, so it
 * keeps playing across page navigations (the root layout never remounts).
 *
 * Each page and theme has its own track (TRACKS). Toggling day/night or moving between Home
 * and About crossfades from one to the other; each track resumes where it was left.
 *
 * Browsers don't let a page start sound by itself: Chrome, Safari and Firefox block it until
 * the visitor interacts (a click, tap or key press; scrolling doesn't count). So:
 *   - on load we try to play (works where the browser already trusts the site), and
 *   - otherwise it starts, fading in softly, on the visitor's first click / tap / key press.
 * The floating sound button turns it off and on; "off" is remembered for later visits.
 *
 * The tracks fade out at their ends, so a plain loop would jump from silence back to full
 * sound. A small pool of players takes turns instead: one plays, the next crossfades in at
 * each loop or track change, the last fades out. Volume goes through Web Audio gain nodes,
 * because iOS ignores `audio.volume`. The sound fades out while the tab is hidden.
 */

export const SOUND_STORAGE_KEY = "stoen-sound";

/** Which track plays where. The About page has its own pair; every other page uses Home's. */
const TRACKS = {
  home: { light: "/audio/Day-background-audio-2.mp3", dark: "/audio/Night-background-audio.mp3" },
  about: { light: "/audio/About-day-audio.mp3", dark: "/audio/About-night-audio.mp3" },
};

/**
 * Loudness trims so every track sits at the same level (measured EBU R128, Oct 12):
 * Day −26.2 LUFS, Night −27.2, About night −27.5 (both 128 kb/s re-encodes), About day −40.6
 * (mastered much quieter).
 */
const TRIM = {
  "/audio/Day-background-audio-2.mp3": 1,
  "/audio/Night-background-audio.mp3": 1.12,
  "/audio/About-day-audio.mp3": 5.25,
  "/audio/About-night-audio.mp3": 1.16,
};

const LEVEL = 0.4; // overall loudness: a background, never in the way
const FADE_IN = 3.5; // s, first start / turning back on
const FADE_OUT = 1.2; // s, turning off / tab hidden
const CROSSFADE = 6; // s, between the end of one loop and the start of the next
const SWITCH = 2.8; // s, from one track to another (theme or page change)
const READY_WAIT = 4000; // ms, longest we keep the old track while the new one buffers
const POOL = 3; // players: playing + incoming + outgoing

const listeners = new Set();
let ctx = null;
let master = null;
let players = []; // [{ el, gain, src, busy, timer, blessed }]
let current = null; // the player that is (or will be) heard
let pending = null; // a player buffering the next track before the crossfade
let ticket = 0; // invalidates a pending switch when a newer one comes in
let playing = false;
let pauseTimer = 0;

let scene = "home";
let wantedSrc = TRACKS.home.light;
const positions = new Map(); // src -> seconds, so a track resumes where it was left

const level = (src) => TRIM[src] ?? 1;
const readTheme = () => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

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

/* ---- gain helpers ---- */

function ramp(param, to, seconds) {
  const now = ctx.currentTime;
  if (param.cancelAndHoldAtTime) {
    param.cancelAndHoldAtTime(now);
  } else {
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
  }
  param.linearRampToValueAtTime(to, now + seconds);
}
function hold(param, value) {
  param.cancelScheduledValues(0);
  param.value = value;
}

/* ---- players ---- */

function makePlayer() {
  const el = new Audio();
  el.preload = "auto";
  el.crossOrigin = "anonymous";
  const gain = ctx.createGain();
  gain.gain.value = 0;
  ctx.createMediaElementSource(el).connect(gain).connect(master);
  const p = { el, gain, src: null, busy: false, timer: 0, blessed: false };
  el.addEventListener("timeupdate", () => onTimeUpdate(p));
  el.addEventListener("ended", () => onEnded(p));
  return p;
}

function setup() {
  if (ctx) return true;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return false;
  ctx = new AudioCtx();
  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  players = Array.from({ length: POOL }, makePlayer);
  current = players[0];
  claim(current, wantedSrc, positions.get(wantedSrc) ?? 0);
  return true;
}

/** Note where a track was left, unless it was just finishing a loop. */
function remember(p) {
  const { el } = p;
  if (!p.src || !el.duration) return;
  if (el.currentTime > 1 && el.currentTime < el.duration - CROSSFADE) positions.set(p.src, el.currentTime);
}

/** Give a player a track (silent until faded in). */
function claim(p, src, at) {
  clearTimeout(p.timer);
  if (p.src !== src) {
    remember(p);
    p.src = src;
    p.el.src = src;
  }
  p.busy = true;
  try {
    p.el.currentTime = at;
  } catch {
    /* applied below once the file's length is known */
  }
  if (at > 0 && p.el.readyState === 0) {
    p.el.addEventListener(
      "loadedmetadata",
      () => {
        if (p.src === src && p.el.currentTime < 1) p.el.currentTime = at;
      },
      { once: true },
    );
  }
  hold(p.gain.gain, 0);
}

function release(p) {
  clearTimeout(p.timer);
  remember(p);
  p.el.pause();
  p.busy = false;
  hold(p.gain.gain, 0);
}

/** Fade a player out, then free it. */
function retire(p, seconds) {
  ramp(p.gain.gain, 0, seconds);
  clearTimeout(p.timer);
  p.timer = setTimeout(() => release(p), seconds * 1000 + 100);
}

/** All players are busy (rare: a switch during a loop crossfade): take the quietest. */
function steal() {
  const spare = players
    .filter((p) => p !== current && p !== pending)
    .sort((a, b) => a.gain.gain.value - b.gain.gain.value)[0];
  release(spare);
  return spare;
}
const freePlayer = () => players.find((p) => !p.busy) ?? steal();

function whenReady(el) {
  if (el.readyState >= 3) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => {
      clearTimeout(timer);
      el.removeEventListener("canplay", done);
      el.removeEventListener("error", done);
      resolve();
    };
    const timer = setTimeout(done, READY_WAIT);
    el.addEventListener("canplay", done);
    el.addEventListener("error", done);
  });
}

/**
 * iOS only lets an <audio> play once it has been started inside a tap. The spare players have
 * no track yet, so inside the visitor's gesture each plays a blip of silence and stops.
 */
let silentUrl = null;
function silence() {
  if (silentUrl) return silentUrl;
  const rate = 8000;
  const samples = 400; // 50 ms, 16-bit mono
  const view = new DataView(new ArrayBuffer(44 + samples * 2));
  const text = (at, s) => [...s].forEach((c, i) => view.setUint8(at + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, 36 + samples * 2, true);
  text(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, rate, true);
  view.setUint32(28, rate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, samples * 2, true);
  silentUrl = URL.createObjectURL(new Blob([view.buffer], { type: "audio/wav" }));
  return silentUrl;
}
function bless() {
  players.forEach((p) => {
    if (p.blessed || p.busy || p.src) return;
    p.blessed = true;
    p.el.src = silence();
    p.el.play().then(
      () => !p.src && p.el.pause(),
      () => {},
    );
  });
}

/* ---- looping ---- */

/* Near the end of a loop, start the same track on a free player and crossfade into it. */
function onTimeUpdate(p) {
  if (!playing || p !== current || !p.el.duration) return;
  if (p.el.currentTime < p.el.duration - CROSSFADE) return;
  const next = freePlayer();
  claim(next, p.src, 0);
  next.el.play().catch(() => {});
  fade(next, CROSSFADE);
  retire(p, CROSSFADE);
  current = next;
}
const fade = (p, seconds) => ramp(p.gain.gain, level(p.src), seconds);

/* Fallback if the crossfade was missed (e.g. timeupdate throttled): start over in place. */
function onEnded(p) {
  if (!playing || p !== current) return;
  p.el.currentTime = 0;
  p.el.play().catch(() => {});
}

/* ---- switching tracks ---- */

function cancelPending() {
  if (!pending) return;
  ticket++;
  release(pending);
  pending = null;
}

function handOver(next) {
  clearTimeout(next.timer);
  players.forEach((p) => p !== next && p.busy && retire(p, SWITCH));
  fade(next, SWITCH);
  current = next;
}

/** Crossfade to `wantedSrc` if something else is playing. */
function syncTrack() {
  if (!playing || !ctx) return;
  const src = wantedSrc;
  if (pending?.src === src) return;
  cancelPending();
  if (current.src === src) return;

  // Switched back before the old track had faded out: bring it straight back.
  const leaving = players.find((p) => p.busy && p !== current && p.src === src);
  if (leaving) return handOver(leaving);

  // Keep the old track playing until the new one has buffered, then crossfade.
  const next = freePlayer();
  claim(next, src, positions.get(src) ?? 0);
  pending = next;
  const mine = ++ticket;
  next.el.play().catch(() => {});
  whenReady(next.el).then(() => {
    if (mine !== ticket) return;
    pending = null;
    handOver(next);
  });
}

function updateTrack() {
  wantedSrc = TRACKS[scene][readTheme()];
  syncTrack();
}

/* ---- start / stop ---- */

/** Make `current` the wanted track at full level, with nothing else lingering. */
function prepareCurrent() {
  players.forEach((p) => p !== current && p.busy && release(p));
  if (current.src !== wantedSrc) claim(current, wantedSrc, positions.get(wantedSrc) ?? 0);
  current.busy = true;
  hold(current.gain.gain, level(current.src));
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
  prepareCurrent();
  // Called synchronously from the click / tap when there is one: iOS requires it.
  const playback = current.el.play();
  playback.catch(() => {});
  // Without a click/tap/key press, resume() never settles where sound isn't allowed yet.
  if (ctx.state !== "running") {
    await Promise.race([ctx.resume().catch(() => {}), new Promise((r) => setTimeout(r, 300))]);
  }
  if (ctx.state !== "running") {
    current.el.pause();
    return false; // blocked until the visitor interacts
  }
  try {
    await playback;
  } catch {
    return false;
  }
  playing = true;
  ramp(master.gain, LEVEL, FADE_IN);
  emit();
  syncTrack(); // the theme or page may have changed while it was starting
  return true;
}

function pause() {
  if (!ctx || !playing) return;
  playing = false;
  cancelPending();
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
    if (setup()) bless();
    play();
  }
}

/** Called by <AmbientSound /> with the current path: About has its own tracks. */
export function setSoundScene(pathname) {
  scene = pathname?.startsWith("/about") ? "about" : "home";
  updateTrack();
}

/**
 * Called once from <AmbientSound />. Follows the theme, tries to start right away, otherwise
 * waits for the first click / tap / key press (outside the sound button, which handles
 * itself). Returns a cleanup.
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
    bless();
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

  // Day / night: crossfade when <html data-theme> changes (theme toggle, OS change, other tab).
  updateTrack();
  const themeWatch = new MutationObserver(updateTrack);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

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
    themeWatch.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
