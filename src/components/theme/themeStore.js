import { THEME_STORAGE_KEY } from "@/lib/theme";

/**
 * The theme lives outside React: `data-theme` on <html> (set before paint by
 * the inline script), the visitor's stored choice, and the OS preference.
 * This tiny store keeps them in sync and lets React read them through
 * `useSyncExternalStore`.
 */

const listeners = new Set();
let teardown = null;

const systemQuery = () => window.matchMedia("(prefers-color-scheme: dark)");

export function readStoredTheme() {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null; // storage blocked (e.g. some private modes)
  }
}

function writeStoredTheme(theme) {
  try {
    if (theme) localStorage.setItem(THEME_STORAGE_KEY, theme);
    else localStorage.removeItem(THEME_STORAGE_KEY);
  } catch {
    /* theme still applies for this visit */
  }
}

const systemTheme = () => (systemQuery().matches ? "dark" : "light");
const resolveTheme = () => readStoredTheme() ?? systemTheme();

function emit() {
  listeners.forEach((listener) => listener());
}

function applyTheme(theme, { animate = false } = {}) {
  const root = document.documentElement;
  if (root.dataset.theme === theme) return;

  const commit = () => {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    emit();
  };

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (animate && document.startViewTransition && !reduceMotion) {
    document.startViewTransition(commit);
  } else {
    commit();
  }
}

/* ---- theme art preloading ----
 * Theme-only illustrations are lazy and `display: none` while their theme is
 * inactive, so they'd only start downloading after a switch and pop in late.
 * Before switching we load + decode the incoming theme's art: images on or near
 * the screen are awaited (capped by ART_WAIT_MS so a slow network never blocks
 * the switch for long); the rest keep loading in the background.
 */

const ART_WAIT_MS = 1200;
const NEAR_SCREEN_PX = 300;
const artSelector = (theme) => `[data-theme-art="${theme}"] img, img[data-theme-art="${theme}"]`;

function loadAndDecode(img) {
  // Lazy images that aren't rendered never load; eager ones load even while hidden.
  if (img.loading !== "eager") img.loading = "eager";
  const loaded =
    img.complete && img.naturalWidth
      ? Promise.resolve()
      : new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
        });
  return loaded.then(() => (img.naturalWidth ? img.decode().catch(() => {}) : undefined));
}

/** The nearest box that is actually laid out (the theme layer itself is display: none). */
function layoutBox(el) {
  for (let node = el; node && node !== document.body; node = node.parentElement) {
    const rect = node.getBoundingClientRect();
    if (rect.width || rect.height) return rect;
  }
  return null;
}

/** Load and decode `theme`'s art; resolves once everything near the screen is ready. */
function prepareThemeArt(theme) {
  if (typeof document === "undefined") return Promise.resolve();
  const viewport = window.innerHeight;
  const nearScreen = [];
  document.querySelectorAll(artSelector(theme)).forEach((img) => {
    const ready = loadAndDecode(img);
    const box = layoutBox(img);
    if (box && box.bottom > -NEAR_SCREEN_PX && box.top < viewport + NEAR_SCREEN_PX) nearScreen.push(ready);
  });
  return Promise.all(nearScreen);
}

const otherTheme = () => (document.documentElement.dataset.theme === "dark" ? "light" : "dark");

/** Warm the theme the toggle would switch to (called on hover / focus / press). */
export function prepareOtherTheme() {
  prepareThemeArt(otherTheme());
}

let switchTicket = 0;

/** Switch once the incoming art is ready (or ART_WAIT_MS has passed). Latest request wins. */
function switchTheme(theme, options) {
  const ticket = ++switchTicket;
  const timeout = new Promise((resolve) => setTimeout(resolve, ART_WAIT_MS));
  Promise.race([prepareThemeArt(theme), timeout]).then(() => {
    if (ticket !== switchTicket) return;
    applyTheme(theme, options);
    emit();
  });
}

/* ---- useSyncExternalStore API ---- */

export function subscribe(listener) {
  listeners.add(listener);

  if (!teardown) {
    const query = systemQuery();
    // Follow the OS only while the visitor hasn't picked a theme.
    const onSystemChange = () => {
      if (!readStoredTheme()) switchTheme(systemTheme());
    };
    // Another tab changed (or cleared) the stored choice.
    const onStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) switchTheme(resolveTheme());
      emit();
    };
    query.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    teardown = () => {
      query.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
      teardown = null;
    };
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) teardown?.();
  };
}

/** Snapshot string: "<theme>:<explicit|system>" — primitive, so it's stable between reads. */
export function getSnapshot() {
  const theme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
  return `${theme}:${readStoredTheme() ? "explicit" : "system"}`;
}

/** The server can't know the visitor's theme. */
export function getServerSnapshot() {
  return null;
}

/* ---- actions ---- */

export function setTheme(theme) {
  writeStoredTheme(theme);
  switchTheme(theme, { animate: true });
}

export function toggleTheme() {
  setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
}

/**
 * Re-apply the resolved theme to <html>. A no-op in production; in development
 * React Strict Mode's remount resets <html> attributes set by the inline script.
 */
export function syncTheme() {
  const theme = resolveTheme();
  const root = document.documentElement;
  if (root.dataset.theme !== theme) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    emit();
  }
}

/** Forget the explicit choice and follow the OS again. */
export function resetTheme() {
  writeStoredTheme(null);
  switchTheme(systemTheme(), { animate: true });
  emit();
}
