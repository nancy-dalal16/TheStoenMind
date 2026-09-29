"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  resetTheme,
  setTheme,
  subscribe,
  syncTheme,
  toggleTheme,
} from "./themeStore";

const ThemeContext = createContext(null);

/**
 * Exposes the active theme to client components.
 *
 * Most components should NOT need this: colours come from CSS tokens and
 * illustrations swap via the `dark:` variant, which works during SSR and
 * never causes a hydration mismatch. Reach for `useTheme()` only for logic
 * that truly depends on the theme (e.g. a chart library's colour config).
 *
 * `theme` is `null` during SSR and the first client render.
 */
export function ThemeProvider({ children }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Before paint: restore data-theme if a dev-mode remount cleared it.
  useLayoutEffect(syncTheme, []);

  const value = useMemo(() => {
    const [theme = null, source = null] = snapshot ? snapshot.split(":") : [];
    return {
      theme,
      isExplicit: source === "explicit",
      setTheme,
      toggleTheme,
      resetTheme,
    };
  }, [snapshot]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside <ThemeProvider>");
  return context;
}
