"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Artwork from "@/components/ui/Artwork";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';
const EASE = "ease-[cubic-bezier(0.32,0.72,0,1)]"; // slick, decelerating drawer curve

// True on the client only, without a set-state-in-effect round trip.
const subscribe = () => () => {};
const useIsClient = () => useSyncExternalStore(subscribe, () => true, () => false);

/**
 * Hamburger trigger + slide-in navigation panel (right → left).
 *
 * - Rendered through a portal on <body>, so no transformed/filtered ancestor
 *   (the header animates) can trap the fixed panel.
 * - Accessible modal dialog: focus moves in and is trapped, Escape or the scrim
 *   closes it, focus returns to the trigger, and the page behind stops scrolling.
 * - The closed panel is `inert`, so it stays out of the tab order and screen readers
 *   while it keeps its slide-out transition.
 */
export default function SiteMenu({ items, tagline, social = [] }) {
  const [open, setOpen] = useState(false);
  const isClient = useIsClient();
  const pathname = usePathname();
  const panelId = useId();
  const titleId = useId();
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const close = useCallback(() => {
    setOpen(false);
    triggerRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return undefined;

    // Lock page scroll; pad for the scrollbar so nothing shifts sideways.
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    const previous = { overflow: root.style.overflow, paddingRight: root.style.paddingRight };
    root.style.overflow = "hidden";
    if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;

    const focusFrame = requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [...panelRef.current.querySelectorAll(FOCUSABLE)];
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      root.style.overflow = previous.overflow;
      root.style.paddingRight = previous.paddingRight;
    };
  }, [open, close]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
        className="group/menu inline-flex h-12 shrink-0 cursor-pointer items-center justify-center gap-3 rounded-full border border-fg/15 bg-bg text-fg shadow-[0_6px_20px_-12px_rgb(0_0_0/0.35)] transition-[border-color,background-color,transform] duration-300 hover:border-fg/35 active:scale-[0.97] max-sm:w-12 sm:pr-4 sm:pl-5"
      >
        <span className="hidden font-sans text-xs font-medium tracking-[0.22em] uppercase sm:inline">Menu</span>
        <span aria-hidden="true" className="flex h-2.5 w-[22px] flex-col items-end justify-between">
          <span className="h-[1.5px] w-[22px] rounded-full bg-current" />
          <span className={`h-[1.5px] w-3.5 rounded-full bg-current transition-[width] duration-300 ${EASE} group-hover/menu:w-[22px]`} />
        </span>
        <span className="sr-only sm:hidden">Menu</span>
      </button>

      {isClient
        ? createPortal(
            <div
              inert={!open}
              // Visible at once on open (so focus can move in); hidden only after the
              // slide-out finishes, so the off-screen panel's shadow can't bleed onto the page.
              className={`fixed inset-0 z-50 ${
                open ? "visible" : "pointer-events-none invisible transition-[visibility] duration-700 motion-reduce:transition-none"
              }`}
            >
              {/* Scrim */}
              <div
                aria-hidden="true"
                onClick={close}
                className={`absolute inset-0 bg-scrim backdrop-blur-[3px] transition-opacity duration-500 motion-reduce:transition-none ${open ? "opacity-100" : "opacity-0"}`}
              />

              {/* Panel */}
              <div
                ref={panelRef}
                id={panelId}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`absolute inset-y-0 right-0 flex w-full flex-col overflow-x-clip overflow-y-auto bg-linear-to-b from-drawer-from to-drawer-to text-fg shadow-[-30px_0_80px_-30px_rgb(0_0_0/0.35)] transition-transform duration-[700ms] motion-reduce:transition-none sm:w-[440px] sm:rounded-l-[28px] ${EASE} ${
                  open ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {/* Faint watercolour cloud */}
                <Artwork
                  className={`absolute right-[-72px] bottom-28 aspect-[465/207] w-[320px] opacity-60 transition-[opacity,translate] delay-200 duration-[1200ms] motion-reduce:transition-none ${EASE} ${
                    open ? "translate-x-0" : "translate-x-16 opacity-0"
                  }`}
                  light={{ src: "/images/light/mist-b.png", crop: [159.12, 238.21, -59.12, -31.51] }}
                  dark={{ src: "/images/dark/night-cloud-curl.png", crop: [116.58, 174.52, -20.47, -5.23] }}
                  sizes="640px"
                />

                {/* Top row — lines up with the header */}
                <div className="relative flex h-[88px] shrink-0 items-center justify-between px-6 sm:px-10 md:h-[110px]">
                  <p id={titleId} className="font-sans text-xs font-medium tracking-[0.22em] text-eyebrow uppercase">
                    Menu
                  </p>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={close}
                    className="group/close inline-flex h-12 cursor-pointer items-center gap-3 rounded-full border border-fg/15 pr-4 pl-5 transition-[border-color,background-color] duration-300 hover:border-fg/35 hover:bg-fg/[0.04]"
                  >
                    <span className="font-sans text-xs font-medium tracking-[0.22em] uppercase">Close</span>
                    <span aria-hidden="true" className="relative size-4 transition-transform duration-500 group-hover/close:rotate-90">
                      <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 rotate-45 rounded-full bg-current" />
                      <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 -rotate-45 rounded-full bg-current" />
                    </span>
                  </button>
                </div>

                {/* Links */}
                <nav aria-label="Site menu" className="relative px-6 pt-6 sm:px-10 sm:pt-10">
                  <ol className="flex flex-col">
                    {items.map((item, index) => {
                      const current = pathname === item.href;
                      return (
                        <li
                          key={item.href}
                          style={{ transitionDelay: open ? `${160 + index * 70}ms` : "0ms" }}
                          className={`transition-[opacity,translate] duration-700 motion-reduce:transition-none ${EASE} ${
                            open ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                          }`}
                        >
                          <Link
                            href={item.href}
                            onClick={() => setOpen(false)}
                            aria-current={current ? "page" : undefined}
                            className="group/link flex items-center gap-4 py-2.5 sm:py-3"
                          >
                            <span className="w-6 font-sans text-xs tracking-[0.18em] text-eyebrow tabular-nums">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                              aria-hidden="true"
                              className={`h-px bg-current transition-[width] duration-500 ${EASE} ${
                                current ? "w-6" : "w-0 group-hover/link:w-6 group-focus-visible/link:w-6"
                              }`}
                            />
                            <span className="font-serif text-[clamp(2.25rem,1.9rem+1.4vw,3rem)] leading-[1.1] tracking-[0.01em] transition-colors duration-300 group-hover/link:text-eyebrow">
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </nav>

                {/* Footer */}
                <div
                  style={{ transitionDelay: open ? `${160 + items.length * 70}ms` : "0ms" }}
                  className={`relative mt-auto px-6 pt-12 pb-8 transition-[opacity,translate] duration-700 motion-reduce:transition-none sm:px-10 sm:pb-10 ${EASE} ${
                    open ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                  }`}
                >
                  <div className="border-t border-divider pt-6">
                    {tagline ? <p className="max-w-[30ch] text-body text-fg-muted">{tagline}</p> : null}
                    {social.length ? (
                      <ul className="mt-5 flex gap-6 font-sans text-xs font-medium tracking-[0.18em] uppercase">
                        {social.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 transition-colors hover:text-eyebrow"
                            >
                              {link.label}
                              <span aria-hidden="true">↗</span>
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
