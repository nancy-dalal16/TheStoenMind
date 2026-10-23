import { buildLegacyTheme } from "sanity";

/**
 * The Studio in the site's colours: Misty Blue / teal accents on white, ink text, Inter.
 * Light only - the Studio is always shown in this scheme (see app/(studio)).
 */
const props = {
  "--font-family-base": "var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif",
  "--font-family-monospace": "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace",
  "--black": "#2b2f31",
  "--white": "#ffffff",
  "--gray": "#7d8a8c",
  "--gray-base": "#7d8a8c",

  "--component-bg": "#ffffff",
  "--component-text-color": "#2b2f31",

  "--brand-primary": "#5d8a8f",

  "--default-button-color": "#7d8a8c",
  "--default-button-primary-color": "#5d8a8f",
  "--default-button-success-color": "#5f8f6a",
  "--default-button-warning-color": "#c08a3e",
  "--default-button-danger-color": "#b4534b",

  "--state-info-color": "#5d8a8f",
  "--state-success-color": "#5f8f6a",
  "--state-warning-color": "#c08a3e",
  "--state-danger-color": "#b4534b",

  // Top bar: white, like the site's header
  "--main-navigation-color": "#ffffff",
  "--main-navigation-color--inverted": "#2b2f31",

  "--focus-color": "#6e9a9f",
};

export const studioTheme = buildLegacyTheme(props);
