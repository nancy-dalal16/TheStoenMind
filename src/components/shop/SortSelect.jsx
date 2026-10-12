"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useTransition } from "react";
import Icon from "@/components/ui/Icon";
import { sortOptions } from "@/lib/shop/copy";

/**
 * Sort control: a quiet pill that opens a small themed menu (a native <select> list can't be
 * styled). WAI-ARIA listbox pattern: the trigger opens it, focus moves to the list, arrows /
 * Home / End move, Enter or Space chooses, Escape or Tab closes, a click outside closes.
 * Styles: globals.css → "Sort menu".
 */
export default function SortSelect({ value = "featured" }) {
  const router = useRouter();
  const pathname = usePathname();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [pending, startTransition] = useTransition();
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listRef = useRef(null);

  const selectedIndex = Math.max(
    0,
    sortOptions.findIndex((o) => o.value === value),
  );
  const selected = sortOptions[selectedIndex];

  const openMenu = (index = selectedIndex) => {
    setActive(index);
    setOpen(true);
  };

  const close = (refocus = true) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus({ preventScroll: true });
  };

  const choose = (index) => {
    const next = sortOptions[index].value;
    close();
    if (next === value) return;
    startTransition(() => {
      router.replace(next === "featured" ? pathname : `${pathname}?sort=${next}`, { scroll: false });
    });
  };

  // Focus the list when it opens; close on a click outside.
  useEffect(() => {
    if (!open) return undefined;
    const frame = requestAnimationFrame(() => listRef.current?.focus({ preventScroll: true }));
    const onPointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const onButtonKey = (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
    }
  };

  const onListKey = (event) => {
    const last = sortOptions.length - 1;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((i) => Math.min(last, i + 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((i) => Math.max(0, i - 1));
        break;
      case "Home":
        event.preventDefault();
        setActive(0);
        break;
      case "End":
        event.preventDefault();
        setActive(last);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        choose(active);
        break;
      case "Escape":
        event.preventDefault();
        close();
        break;
      case "Tab":
        close(false);
        break;
      default:
    }
  };

  return (
    <div ref={rootRef} className="sort" data-open={open || undefined} data-pending={pending || undefined}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-label={`Sort by: ${selected.label}`}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onButtonKey}
        className="sort-trigger"
      >
        <span className="sort-label" aria-hidden="true">
          Sort by
        </span>
        <span className="sort-value" aria-hidden="true">
          {selected.label}
        </span>
        <Icon name="caret-down" width={18} height={18} className="sort-caret" />
      </button>

      <div className="sort-menu" inert={!open}>
        <p className="sort-menu-title" aria-hidden="true">
          Sort by
        </p>
        <ul
          ref={listRef}
          id={`${id}-list`}
          role="listbox"
          tabIndex={-1}
          aria-label="Sort products"
          aria-activedescendant={open ? `${id}-opt-${active}` : undefined}
          onKeyDown={onListKey}
          className="sort-list"
        >
          {sortOptions.map((option, index) => (
            <li
              key={option.value}
              id={`${id}-opt-${index}`}
              role="option"
              aria-selected={index === selectedIndex}
              data-active={index === active || undefined}
              onPointerEnter={() => setActive(index)}
              onClick={() => choose(index)}
              className="sort-option"
            >
              {option.label}
              <Icon name="check" width={16} height={16} className="sort-check" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
