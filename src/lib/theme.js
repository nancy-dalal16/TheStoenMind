export const THEME_STORAGE_KEY = "stoen-theme";

/**
 * Runs in <head> before first paint so the correct theme is applied
 * immediately (no light-mode flash for dark-mode visitors).
 * Stored choice wins; otherwise follow the OS preference.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var s=localStorage.getItem(k);var t=s==="light"||s==="dark"?s:(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");var d=document.documentElement;d.dataset.theme=t;d.style.colorScheme=t;}catch(e){}})();`;
