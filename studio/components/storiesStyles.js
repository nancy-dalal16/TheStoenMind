/**
 * Styles for the Stories screen (StoriesTool.jsx). Every class starts with `stn-` and lives
 * under `.stn-root`, so nothing leaks into the rest of the Studio. Light only, on purpose.
 */
export const STORIES_CSS = `
.stn-root {
  --ink: #23292b;
  --text: #3c4446;
  --muted: #7b8789;
  --line: #e8ecec;
  --soft: #f3f6f6;
  --brand: #5d8a8f;
  --brand-soft: #e0eaeb;
  --vanilla: #f4f0e3;
  --radius: 12px;
  height: 100%;
  overflow: auto;
  background: #fff;
  color: var(--text);
  font-family: var(--font-inter), Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  -webkit-font-smoothing: antialiased;
}
.stn-root *, .stn-root *::before, .stn-root *::after { box-sizing: border-box; }
.stn-root a { color: inherit; text-decoration: none; }
.stn-root button, .stn-root input, .stn-root select { font: inherit; color: inherit; }

/* Top bar: brand, search, count, actions */
.stn-top {
  position: sticky;
  top: 0;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 28px;
  background: rgb(255 255 255 / 0.94);
  backdrop-filter: blur(8px);
}
.stn-brand {
  flex-shrink: 0;
  width: 150px;
  height: 21px;
  background: var(--ink);
  -webkit-mask: url("/images/shared/wordmark.svg") left center / contain no-repeat;
  mask: url("/images/shared/wordmark.svg") left center / contain no-repeat;
}
.stn-search {
  display: flex;
  align-items: center;
  gap: 10px;
  width: min(420px, 38vw);
  margin-left: 12px;
  padding: 0 16px;
  height: 40px;
  border-radius: 999px;
  background: var(--soft);
  color: var(--muted);
  transition: box-shadow 0.2s ease, background-color 0.2s ease;
}
.stn-search:focus-within { background: #fff; box-shadow: 0 0 0 1.5px var(--brand); }
.stn-search svg { font-size: 19px; flex-shrink: 0; }
.stn-search input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 14px;
  color: var(--ink);
}
.stn-search input::placeholder { color: #9aa4a6; }
.stn-count { margin-left: auto; font-size: 13px; color: var(--muted); white-space: nowrap; }
.stn-button {
  border: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  padding: 0 18px;
  border-radius: 8px;
  background: var(--ink);
  color: #fff !important;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.stn-button svg { font-size: 20px; margin-left: -4px; }
.stn-button:hover { background: #000; transform: translateY(-1px); box-shadow: 0 8px 18px -10px rgb(0 0 0 / 0.45); }
.stn-button-ghost { background: #fff; color: var(--ink) !important; box-shadow: inset 0 0 0 1px var(--line); font-weight: 500; }
.stn-button-ghost:hover { background: var(--soft); box-shadow: inset 0 0 0 1px #d6dcdc; }

/* Tabs + filters */
.stn-bar {
  position: sticky;
  top: 76px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 28px;
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.stn-tabs { display: flex; gap: 6px; overflow-x: auto; scrollbar-width: none; }
.stn-tab {
  position: relative;
  padding: 14px 12px 15px;
  border: 0;
  background: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: var(--muted);
  white-space: nowrap;
  transition: color 0.2s ease;
}
.stn-tab span { font-weight: 400; }
.stn-tab:hover { color: var(--ink); }
.stn-tab[aria-selected="true"] { color: var(--ink); font-weight: 700; }
.stn-tab[aria-selected="true"]::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  border-radius: 2px;
  background: var(--ink);
}
.stn-tab:focus-visible, .stn-select:focus-within, .stn-card:focus-visible, .stn-new:focus-visible, .stn-button:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
.stn-controls { display: flex; gap: 10px; flex-shrink: 0; }
.stn-select {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--muted);
}
.stn-select select {
  appearance: none;
  height: 34px;
  padding: 0 32px 0 12px;
  border: 0;
  border-radius: 8px;
  background: var(--soft);
  font-size: 13px;
  font-weight: 600;
  color: var(--ink);
  cursor: pointer;
}
.stn-select svg { position: absolute; right: 8px; font-size: 18px; color: var(--muted); pointer-events: none; }

/* Grid */
.stn-body { padding: 28px 28px 64px; }
.stn-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(236px, 1fr));
  gap: 30px 22px;
}
.stn-new {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  aspect-ratio: 4 / 3;
  border: 1.5px dashed #d3dadb;
  border-radius: var(--radius);
  font-size: 14px;
  color: var(--muted);
  transition: border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease;
}
.stn-new:hover { border-color: var(--brand); background: #f7fafa; color: var(--ink); }
.stn-new-plus {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  background: var(--brand-soft);
  color: var(--brand);
  font-size: 24px;
  transition: transform 0.3s ease;
}
.stn-new:hover .stn-new-plus { transform: scale(1.08) rotate(90deg); }

.stn-card { display: flex; flex-direction: column; min-width: 0; }
.stn-card-media {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  border-radius: var(--radius);
  background: #f1f5f6;
  box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.04);
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease;
}
.stn-card-media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.stn-card-media img.stn-contain {
  object-fit: contain;
  padding: 9% 12%;
  filter: drop-shadow(0 10px 14px rgb(40 38 32 / 0.16));
}
.stn-card:hover .stn-card-media { transform: translateY(-3px); box-shadow: 0 18px 30px -18px rgb(30 45 50 / 0.45); }
.stn-card:hover .stn-card-media img { transform: scale(1.04); }
.stn-card-empty {
  display: grid;
  place-items: center;
  height: 100%;
  font-size: 12px;
  color: var(--muted);
}
.stn-card-badges { position: absolute; top: 10px; left: 10px; display: flex; flex-wrap: wrap; gap: 6px; }
.stn-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.01em;
  color: #fff;
  background: rgb(35 41 43 / 0.82);
  backdrop-filter: blur(4px);
}
.stn-badge svg { font-size: 14px; margin: -2px 0 -2px -3px; }
.stn-badge-draft { background: #c0873a; }
.stn-badge-edited { background: #6b5bd2; }
.stn-badge-scheduled { background: #3d7fa6; }
.stn-badge-lead { background: var(--brand); }
.stn-badge-pick { background: rgb(255 255 255 / 0.9); color: var(--ink); }
.stn-card-title {
  margin-top: 12px;
  font-family: var(--font-abhaya), "Abhaya Libre", Georgia, serif;
  font-size: 19px;
  line-height: 1.2;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.stn-card-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 8px;
  font-size: 13px;
  color: var(--text);
}
.stn-card-author { display: flex; align-items: center; gap: 7px; min-width: 0; }
.stn-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #d9dfe0;
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  object-fit: cover;
}
.stn-ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.stn-chip {
  flex-shrink: 0;
  max-width: 55%;
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--soft);
  font-size: 11px;
  font-weight: 600;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.stn-card-meta { margin-top: 6px; font-size: 12px; color: #9aa4a6; }

.stn-skeleton { aspect-ratio: 4 / 3; border-radius: var(--radius); background: linear-gradient(90deg, #f1f4f4, #f8fafa, #f1f4f4); background-size: 200% 100%; animation: stn-shimmer 1.4s ease-in-out infinite; }
@keyframes stn-shimmer { from { background-position: 100% 0; } to { background-position: -100% 0; } }
.stn-empty, .stn-error { margin-top: 32px; text-align: center; font-size: 14px; color: var(--muted); }
.stn-error { color: #b4534b; }

@media (max-width: 900px) {
  .stn-top { flex-wrap: wrap; padding: 14px 16px; }
  .stn-search { order: 5; width: 100%; margin: 0; }
  .stn-count { display: none; }
  .stn-brand { margin-right: auto; }
  .stn-bar { position: static; flex-direction: column; align-items: stretch; padding: 0 16px; gap: 0; }
  .stn-controls { padding: 10px 0; }
  .stn-body { padding: 20px 16px 48px; }
  .stn-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 22px 14px; }
}
@media (prefers-reduced-motion: reduce) {
  .stn-root * { transition: none !important; animation: none !important; }
}
`;

/** The full-page story editor (StoryEditor.jsx). */
export const EDITOR_CSS = `
.stn-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  font-family: var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif;
}
.stn-editor *, .stn-editor *::before, .stn-editor *::after { box-sizing: border-box; }
.stn-editor-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 12px 22px;
  border-bottom: 1px solid #e8ecec;
  background: #fff;
}
.stn-back, .stn-pill-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid #e3e8e8;
  border-radius: 999px;
  background: #fff;
  color: #23292b;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.stn-back { padding-left: 8px; }
.stn-back svg, .stn-pill-btn svg, .stn-publish svg { font-size: 19px; }
.stn-back:hover, .stn-pill-btn:hover { background: #f3f6f6; border-color: #d6dcdc; }
.stn-pill-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.stn-danger { color: #b4534b; }
.stn-danger:hover { background: #fbf1f0; border-color: #efcfcb; }
.stn-danger-solid { background: #b4534b; border-color: #b4534b; color: #fff; }
.stn-danger-solid:hover { background: #9c443d; border-color: #9c443d; }
.stn-confirm { font-size: 13px; color: #b4534b; font-weight: 600; }
.stn-editor-title { display: flex; align-items: baseline; gap: 12px; min-width: 0; flex: 1; }
.stn-editor-title strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-abhaya), "Abhaya Libre", Georgia, serif;
  font-size: 22px;
  font-weight: 400;
  color: #23292b;
}
.stn-editor-status { flex-shrink: 0; font-size: 12px; color: #5f8f6a; }
.stn-editor-status.is-draft { color: #c0873a; }
.stn-editor-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.stn-publish {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  background: #5d8a8f;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
}
.stn-publish:hover:not(:disabled) { background: #4c7579; transform: translateY(-1px); box-shadow: 0 8px 18px -10px rgb(60 100 105 / 0.7); }
.stn-publish:disabled { background: #c9d6d7; cursor: default; }
.stn-back:focus-visible, .stn-pill-btn:focus-visible, .stn-publish:focus-visible { outline: 2px solid #5d8a8f; outline-offset: 2px; }
.stn-editor-pane { position: relative; flex: 1; min-height: 0; }
.stn-loading { padding: 48px; text-align: center; color: #7b8789; font-size: 14px; }
/* The top bar already shows title, status and actions: hide the pane's own header + title. */
.stn-editor-pane [data-testid="pane-header"],
.stn-editor-pane div:has(> [data-testid="document-panel-document-title"]) { display: none !important; }
/* A wider, calmer form (like Kathart's project editor). */
.stn-editor-pane [data-testid="document-panel-scroller"] > div { max-width: 920px !important; }
@media (max-width: 760px) {
  .stn-editor-bar { flex-wrap: wrap; padding: 10px 14px; }
  .stn-editor-title { order: 3; flex-basis: 100%; }
  .stn-editor-actions { margin-left: auto; }
}
`;
