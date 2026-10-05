/**
 * Theme-switch transition (View Transitions API) — Nancy's pick, Oct 4:
 *
 *   Watercolour bloom  the new theme spreads from the toggle like paint on wet paper
 *                      (a ragged, feathered SVG blot used as a mask, grown in JS)
 *   Sun sets / moon rises  the toggle's icon arcs out and the other one arcs in
 *
 * Callers have already checked support and reduced motion (themeStore.applyTheme);
 * the styles live in globals.css → "Theme transition".
 */

const EASE = "cubic-bezier(0.45, 0.05, 0.25, 1)";
const BLOOM_MS = 1050;
// The blot's ragged inner edge sits at ~27% of its box, so the box must be ~4× the reach to cover the screen.
const BLOOM_COVER = 4.1;

/** Centre of the element that started the switch, else the top-right corner (where the toggle lives). */
function originPoint(origin) {
  const rect = origin?.getBoundingClientRect?.();
  if (rect && (rect.width || rect.height)) return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  return { x: window.innerWidth - 60, y: 50 };
}

/** Give the toggle's two icons one shared name so the outgoing one can set and the incoming one rise. */
function nameToggleIcons(origin) {
  const button = origin?.closest?.("[data-theme-toggle]") ?? document.querySelector("[data-theme-toggle]");
  const icons = button ? [...button.querySelectorAll("[data-toggle-icon]")] : [];
  icons.forEach((icon) => (icon.style.viewTransitionName = "theme-toggle-icon"));
  return () => icons.forEach((icon) => (icon.style.viewTransitionName = ""));
}

export function runThemeTransition(commit, { origin } = {}) {
  const root = document.documentElement;
  const unnameIcons = nameToggleIcons(origin);
  root.dataset.themeFx = "bloom";

  const transition = document.startViewTransition(commit);
  const { x, y } = originPoint(origin);

  transition.ready
    .then(() => {
      const reach = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
      const size = reach * BLOOM_COVER;
      root.animate(
        {
          maskSize: ["0px 0px", `${size}px ${size}px`],
          maskPosition: [`${x}px ${y}px`, `${x - size / 2}px ${y - size / 2}px`],
        },
        { duration: BLOOM_MS, easing: EASE, fill: "both", pseudoElement: "::view-transition-new(root)" },
      );
    })
    .catch(() => {});

  transition.finished.finally(() => {
    unnameIcons();
    delete root.dataset.themeFx;
  });
}
