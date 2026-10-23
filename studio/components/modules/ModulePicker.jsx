"use client";

import { CloseIcon } from "@sanity/icons/Close";
import { SearchIcon } from "@sanity/icons/Search";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/**
 * "Choose a module" - a dialog over the Studio (like Kathart's) with a search box and the grid
 * of illustrated module cards (thumbnails in public/studio-modules/<type>.svg, words from each
 * type's title and description). Being a dialog, the form behind it never scrolls away.
 */
export default function ModulePicker({ types, onPick, onClose, title = "Choose a module" }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const shown = q ? types.filter((t) => `${t.title ?? t.name} ${t.description ?? ""}`.toLowerCase().includes(q)) : types;

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="stm-overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="stm-picker" role="dialog" aria-modal="true" aria-label={title}>
        <div className="stm-picker-head">
          <span>{title}</span>
          <button type="button" className="stm-icon" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        <label className="stm-search">
          <SearchIcon />
          <input
            autoFocus
            type="search"
            placeholder="Search modules"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && shown.length === 1 && onPick(shown[0])}
          />
        </label>
        <div className="stm-picker-grid">
          {shown.map((type) => (
            <button key={type.name} type="button" className="stm-choice" onClick={() => onPick(type)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/studio-modules/${type.name}.svg`} alt="" width={160} height={100} />
              <strong>{type.title ?? type.name}</strong>
              {type.description ? <span>{type.description}</span> : null}
            </button>
          ))}
          {shown.length ? null : <p className="stm-empty">No module matches “{query}”.</p>}
        </div>
      </div>
    </div>,
    document.body,
  );
}
