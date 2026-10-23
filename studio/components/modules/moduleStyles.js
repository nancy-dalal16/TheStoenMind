/** Styles for the module list (ModuleArrayInput / ModuleItem / ModulePicker). Scoped `stm-` classes. */
export const MODULE_CSS = `
.stm-list { --stm-ink: #23292b; --stm-muted: #7b8789; --stm-line: #e3e8e8; --stm-soft: #f5f7f7; --stm-brand: #5d8a8f; --stm-brand-soft: #e3eced; }
.stm-list *, .stm-picker * { box-sizing: border-box; }

/* Card per module */
.stm-item { position: relative; display: block; transition: opacity 0.2s ease; }
.stm-card {
  border: 1px solid var(--stm-line);
  border-radius: 12px;
  background: #fff;
  overflow: hidden;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}
.stm-card:hover { border-color: #d3dbdc; box-shadow: 0 10px 24px -18px rgb(30 45 50 / 0.45); }
.stm-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px 8px 12px;
  background: var(--stm-soft);
  border-bottom: 1px solid var(--stm-line);
}
.stm-grip { display: inline-flex; color: #9aa6a7; font-size: 20px; }
.stm-card-head.is-draggable { cursor: grab; user-select: none; }
.stm-card-head.is-draggable:hover .stm-grip { color: var(--stm-brand); }
.stm-card-head.is-draggable:active { cursor: grabbing; }
.stm-index { font-size: 11.5px; font-variant-numeric: tabular-nums; color: #a3adae; }
/* The header is the drag handle, so hide the Studio's own (duplicate) grip in the row */
.stm-card-body [data-ui="DragHandleButton"] { display: none !important; }

/* Drag & drop */
.stm-list.is-dragging .stm-plus { visibility: hidden; }
.stm-item.is-source { opacity: 0.4; }
.stm-item.is-drop-before::before,
.stm-item.is-drop-after::after {
  content: "";
  position: absolute;
  left: -4px;
  right: -4px;
  z-index: 3;
  height: 3px;
  border-radius: 3px;
  background: var(--stm-brand);
  box-shadow: 0 0 0 4px rgb(93 138 143 / 0.18);
  pointer-events: none;
}
.stm-item.is-drop-before::before { top: -16px; }
.stm-item.is-drop-after::after { bottom: 13px; }
.stm-type {
  padding: 3px 9px;
  border-radius: 6px;
  background: var(--stm-brand-soft);
  color: var(--stm-brand);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}
.stm-tools { display: inline-flex; gap: 2px; margin-left: auto; }
.stm-icon {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 7px;
  background: transparent;
  color: var(--stm-muted);
  font-size: 19px;
  cursor: pointer;
  transition: background-color 0.15s ease, color 0.15s ease;
}
.stm-icon:hover:not(:disabled) { background: #e8eded; color: var(--stm-ink); }
.stm-icon:disabled { opacity: 0.3; cursor: default; }
.stm-danger:hover:not(:disabled) { background: #fbeeee; color: #b4534b; }
.stm-icon:focus-visible, .stm-plus:focus-visible, .stm-add:focus-visible, .stm-choice:focus-visible { outline: 2px solid var(--stm-brand); outline-offset: 2px; }
.stm-card-body { padding: 4px; }

/* "+" between modules */
.stm-between {
  position: relative;
  display: flex;
  justify-content: center;
  height: 30px;
  align-items: center;
}
.stm-between::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 1px;
  background: var(--stm-line);
}
.stm-plus {
  position: relative;
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border: 1px solid var(--stm-line);
  border-radius: 999px;
  background: #fff;
  color: var(--stm-muted);
  font-size: 16px;
  cursor: pointer;
  transition: transform 0.2s ease, color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
.stm-plus:hover { color: #fff; background: var(--stm-brand); border-color: var(--stm-brand); transform: scale(1.12); }

/* "+ Add module" at the end */
.stm-add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  height: 46px;
  margin-top: 6px;
  border: 1.5px dashed #d3dadb;
  border-radius: 12px;
  background: #fff;
  color: var(--stm-muted);
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease, background-color 0.2s ease;
}
.stm-add svg { font-size: 20px; }
.stm-add:hover { border-color: var(--stm-brand); color: var(--stm-ink); background: #f7fafa; }

/* Picker (dialog) */
.stm-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgb(22 32 35 / 0.42);
  backdrop-filter: blur(3px);
  animation: stm-fade 0.18s ease;
  font-family: var(--font-inter), Inter, ui-sans-serif, system-ui, sans-serif;
}
.stm-overlay * { box-sizing: border-box; }
.stm-picker {
  display: flex;
  flex-direction: column;
  width: min(940px, 100%);
  max-height: min(760px, calc(100vh - 48px));
  padding: 20px 22px 22px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 40px 80px -30px rgb(20 35 40 / 0.55);
  animation: stm-rise 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.stm-picker-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #7b8789;
}
.stm-picker .stm-icon { display: inline-grid; place-items: center; width: 32px; height: 32px; border: 0; border-radius: 8px; background: transparent; color: #7b8789; font-size: 20px; cursor: pointer; }
.stm-picker .stm-icon:hover { background: #eef2f2; color: #23292b; }
.stm-search {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  margin-bottom: 14px;
  padding: 0 14px;
  border: 1px solid #e3e8e8;
  border-radius: 10px;
  color: #7b8789;
  font-size: 19px;
}
.stm-search:focus-within { border-color: #5d8a8f; box-shadow: 0 0 0 3px rgb(93 138 143 / 0.15); }
.stm-search input { flex: 1; min-width: 0; border: 0; outline: 0; background: transparent; color: #23292b; font: inherit; font-size: 14px; }
.stm-picker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(156px, 1fr));
  gap: 10px;
  overflow-y: auto;
  padding: 2px 2px 4px;
  margin: 0 -2px;
}
.stm-choice {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 12px 10px 14px;
  border: 1px solid #e3e8e8;
  border-radius: 12px;
  background: #fff;
  color: #23292b;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}
.stm-choice:hover { border-color: #5d8a8f; box-shadow: 0 10px 22px -16px rgb(40 70 75 / 0.6); transform: translateY(-2px); }
.stm-choice:focus-visible { outline: 2px solid #5d8a8f; outline-offset: 2px; }
.stm-choice img { width: 100%; max-width: 132px; height: auto; margin-bottom: 6px; border-radius: 8px; }
.stm-choice strong { font-size: 13px; font-weight: 700; }
.stm-choice span { font-size: 11.5px; line-height: 1.35; color: #7b8789; }
.stm-empty { grid-column: 1 / -1; margin: 24px 0; text-align: center; color: #7b8789; font-size: 14px; }
@keyframes stm-fade { from { opacity: 0; } }
@keyframes stm-rise { from { opacity: 0; transform: translateY(12px) scale(0.98); } }
@media (prefers-reduced-motion: reduce) { .stm-overlay, .stm-picker { animation: none; } }
`;
