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
 *
 * Seamless loops (Nancy, Oct 21: "it feels like the music starts again"). Going back to 0:00
 * replayed each Home track's intro every couple of minutes. Both Home tracks repeat a passage
 * sample-for-sample (the day swell every 50 s, a night chime phrase 153.4 s apart), so instead
 * they loop *inside* that passage: a second player starts `lag` seconds back, is lined up with
 * the one playing (to within ~10 ms), and a short crossfade swaps them while both play the same
 * notes - there is nothing to hear. The intro only plays once, at the very start of a visit.
 * The About tracks have no note-for-note repeats, so they loop at the best-matching moments
 * instead: About night on its 124 s pattern (lined up, 2.5 s crossfade), About day between two
 * spots with the same texture (4 s equal-power crossfade).
 *
 * Positions are kept for the browser session (sessionStorage), so a reload or a page that does
 * a full load carries on where the music was instead of starting over.
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

/**
 * Loop points, measured from the files (Oct 21). Re-measure if a file is replaced.
 *   lag    how far back the loop jumps (s)
 *   from   when playback reaches this, the swap starts (the second player is readied ~1.5 s
 *          before); until: the latest it may start
 *   seam   crossfade length (s)
 *   align  line the two players up first (the audio either side is the same, or follows the
 *          same pattern, so it must stay in step)
 *   power  equal-power crossfade, for joining two different but similar-sounding moments
 * Home day/night: identical to themselves `lag` earlier between from and until + seam
 * (waveform correlation ≥ 0.94). About night: a 124 s pattern (≈ 0.8 there). About day:
 * same texture and level either side (spectral match 0.93), not the same notes.
 */
const LOOPS = {
  "/audio/Day-background-audio-2.mp3": { from: 88.2, until: 90.1, lag: 50, seam: 0.35, align: true },
  "/audio/Night-background-audio.mp3": { from: 217.4, until: 225.3, lag: 153.4043, seam: 0.35, align: true },
  "/audio/About-night-audio.mp3": { from: 144.6, until: 145.4, lag: 124, seam: 2.5, align: true },
  "/audio/About-day-audio.mp3": { from: 50.2, until: 50.8, lag: 44.2, seam: 4, power: true },
};
const PREP = 1.5; // s, the second player is started this long before `from`
const ALIGN = 0.012; // s, how closely aligned players must line up before the seam
const POS_KEY = "stoen-sound-pos";

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
let savedAt = 0;

/* Positions survive reloads within the browser session. */
function loadPositions() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(POS_KEY) || "{}");
    Object.entries(saved).forEach(([src, at]) => Number.isFinite(at) && positions.set(src, at));
  } catch {
    /* storage blocked: positions last for this page only */
  }
}
function savePositions() {
  players.forEach((p) => p.busy && remember(p));
  try {
    sessionStorage.setItem(POS_KEY, JSON.stringify(Object.fromEntries(positions)));
  } catch {
    /* storage blocked */
  }
}

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
/** Equal-power fade (sine / cosine), so two unrelated sounds don't dip in the middle. */
function powerRamp(param, to, seconds) {
  const now = ctx.currentTime;
  const start = param.value;
  const steps = 64;
  const shape = new Float32Array(steps);
  for (let i = 0; i < steps; i++) {
    const x = i / (steps - 1);
    const k = to > start ? Math.sin((x * Math.PI) / 2) : 1 - Math.cos((x * Math.PI) / 2);
    shape[i] = start + (to - start) * k;
  }
  param.cancelScheduledValues(now);
  param.setValueAtTime(start, now);
  // A curve may not share its start time with another event: begin it a moment later.
  param.setValueCurveAtTime(shape, now + 0.01, seconds);
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
  const p = { el, gain, src: null, busy: false, timer: 0, blessed: false, seam: false };
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
  claim(current, wantedSrc, startAt(wantedSrc));
  return true;
}

/** Note where a track was left, unless it was just finishing a loop. */
function remember(p) {
  const { el } = p;
  if (!p.src || !el.duration) return;
  if (el.currentTime > 1 && el.currentTime < el.duration - CROSSFADE) positions.set(p.src, el.currentTime);
}

/** Where to (re)start a track: past a loop's end, the same notes sit `lag` seconds earlier. */
function startAt(src) {
  const at = positions.get(src) ?? 0;
  const loop = LOOPS[src];
  return loop && at > loop.until ? at - loop.lag : at;
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
  p.seam = false;
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
  if (p === current && Date.now() - savedAt > 4000) {
    savedAt = Date.now();
    savePositions();
  }
  if (!playing || p !== current || !p.el.duration || p.seam) return;
  const t = p.el.currentTime;
  const loop = LOOPS[p.src];
  if (loop) {
    if (t >= loop.from - PREP && t < loop.until) seamLoop(p, loop);
    else if (t >= loop.until + 1) crossfadeTo(p, t - loop.lag, CROSSFADE); // seam missed (tab throttled)
    return;
  }
  if (t >= p.el.duration - CROSSFADE) crossfadeTo(p, 0, CROSSFADE);
}
const fade = (p, seconds) => ramp(p.gain.gain, level(p.src), seconds);

/** Plain crossfade from `p` into the same track at `at`. */
function crossfadeTo(p, at, seconds) {
  p.seam = true;
  const next = freePlayer();
  claim(next, p.src, at);
  next.el.play().catch(() => {});
  fade(next, seconds);
  retire(p, seconds);
  current = next;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/** After a seek: wait until it has landed and playback has run on a moment. */
async function settled(el) {
  for (let i = 0; i < 20 && el.seeking; i++) await wait(50);
  await wait(180);
}
const playingNow = (el) =>
  el.readyState >= 3 && !el.paused
    ? Promise.resolve()
    : new Promise((resolve) => {
        const done = () => {
          clearTimeout(timer);
          el.removeEventListener("playing", done);
          resolve();
        };
        const timer = setTimeout(done, 1500);
        el.addEventListener("playing", done);
      });

/**
 * Loop seam: start a silent second player `lag` seconds back (lined up with the one playing
 * when `align`), wait for `from`, then swap them with the loop's crossfade.
 */
async function seamLoop(p, loop) {
  p.seam = true;
  const next = freePlayer();
  const offset = () => next.el.currentTime - (p.el.currentTime - loop.lag);
  claim(next, p.src, Math.max(0, p.el.currentTime - loop.lag + 0.1));
  next.el.play().catch(() => {});
  await playingNow(next.el);
  if (loop.align) {
    // Nudge the silent one until it is within ALIGN of the other.
    for (let i = 0; i < 4 && Math.abs(offset()) > ALIGN; i++) {
      next.el.currentTime -= offset();
      await settled(next.el);
    }
  }
  while (p.el.currentTime < loop.from && current === p && playing && next.busy) await wait(40);
  // A theme / page switch or the sound being turned off got there first.
  if (!next.busy || next.src !== p.src) {
    p.seam = false;
    return;
  }
  if (current !== p || !playing) {
    release(next);
    p.seam = false;
    return;
  }
  const inTime = p.el.currentTime <= loop.until + 0.2;
  const lined = !loop.align || Math.abs(offset()) <= ALIGN * 3;
  const seconds = inTime && lined ? loop.seam : CROSSFADE; // else: a longer, gentle crossfade
  if (loop.power) {
    powerRamp(next.gain.gain, level(next.src), seconds);
    powerRamp(p.gain.gain, 0, seconds);
    clearTimeout(p.timer);
    p.timer = setTimeout(() => release(p), seconds * 1000 + 100);
  } else {
    fade(next, seconds);
    retire(p, seconds);
  }
  current = next;
}

/* Fallback if the crossfade was missed (e.g. timeupdate throttled): start over in place. */
function onEnded(p) {
  if (!playing || p !== current) return;
  const loop = LOOPS[p.src];
  p.el.currentTime = loop ? loop.until - loop.lag : 0;
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
  claim(next, src, startAt(src));
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
  if (current.src !== wantedSrc) claim(current, wantedSrc, startAt(wantedSrc));
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

  loadPositions();
  window.addEventListener("pagehide", savePositions);

  // Day / night: crossfade when <html data-theme> changes (theme toggle, OS change, other tab).
  updateTrack();
  const themeWatch = new MutationObserver(updateTrack);
  themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  // Fade out while the tab is hidden; come back when it's visible again.
  let resumeOnShow = false;
  const onVisibility = () => {
    if (document.hidden) {
      resumeOnShow = playing;
      savePositions();
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
    window.removeEventListener("pagehide", savePositions);
    themeWatch.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
