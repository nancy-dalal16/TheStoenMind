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

/* ---- useSyncExternalStore API ---- */

export function subscribe(listener) {
  listeners.add(listener);

  if (!teardown) {
    const query = systemQuery();
    // Follow the OS only while the visitor hasn't picked a theme.
    const onSystemChange = () => {
      if (!readStoredTheme()) applyTheme(systemTheme());
    };
    // Another tab changed (or cleared) the stored choice.
    const onStorage = (event) => {
      if (event.key === THEME_STORAGE_KEY || event.key === null) applyTheme(resolveTheme());
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
  applyTheme(theme, { animate: true });
  emit();
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
  applyTheme(systemTheme(), { animate: true });
  emit();
}
