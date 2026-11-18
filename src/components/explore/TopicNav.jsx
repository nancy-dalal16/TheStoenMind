"use client";

import Link from "next/link";
import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import { topicHref } from "@/lib/explore/links";

// useLayoutEffect warns during server rendering; it only matters in the browser anyway.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

/** Best place to break `widths` into two rows (the split with the shortest longer row). */
function bestSplit(widths, gap) {
  const rowWidth = (from, to) => widths.slice(from, to).reduce((sum, w) => sum + w, 0) + gap * Math.max(0, to - from - 1);
  let split = Math.ceil(widths.length / 2);
  let longest = Infinity;
  for (let i = 1; i < widths.length; i += 1) {
    const candidate = Math.max(rowWidth(0, i), rowWidth(i, widths.length));
    if (candidate < longest) {
      longest = candidate;
      split = i;
    }
  }
  return { split, longest, total: rowWidth(0, widths.length) };
}

/**
 * Topic links under the nameplate, between a double rule and a single one (magazine section bar).
 *
 * Layout (Nancy, Nov 18). The bar measures its own topics, so it keeps working as topics are
 * added or renamed in the Studio:
 * - Desktop (48rem and up), never more than two lines:
 *     "one"        all topics fit on one centred line;
 *     "two"        they don't, so they wrap onto two balanced, centred lines;
 *     "two-scroll" even two lines can't hold them, so the two lines scroll sideways together,
 *                  with hints.
 * - Phones (below 48rem): "scroll", one line that scrolls sideways, with hints.
 * Hints: a soft fade and a small ‹ › button on whichever edge has more topics; tapping one slides
 * the row along. The current topic is scrolled into view.
 * Before the first measurement (server HTML) CSS makes a width-based guess (see globals.css).
 *
 * Sticky: the bar pins just under the slim header while the page scrolls, and glides to the very
 * top when the header slides away (`.ex-sticky` in globals.css). Once pinned it sets `data-stuck`,
 * which gives it the page background (also behind the header) so stories pass cleanly underneath.
 * It must sit outside the masthead section, or it would only stick while the masthead is on screen.
 */
export default function TopicNav({ topics = [], allLabel = "All stories", active = "all" }) {
  const items = [{ slug: "all", title: allLabel, href: "/explore" }, ...topics.map((t) => ({ ...t, href: topicHref(t) }))];
  const barRef = useRef(null);
  const scrollRef = useRef(null);
  const [stuck, setStuck] = useState(false);
  const [more, setMore] = useState({ left: false, right: false });
  // Before measuring: break roughly in the middle by characters (CSS only uses it on tablets)
  const [shape, setShape] = useState(() => ({
    layout: null,
    split: bestSplit(items.map((item) => String(item.title).length + 3), 0).split,
    width: 0,
  }));

  // Pinned state
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return undefined;
    let frame = 0;
    const check = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = parseFloat(getComputedStyle(bar).top) || 0;
        setStuck(window.scrollY > 0 && bar.getBoundingClientRect().top <= top + 1);
      });
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, []);

  // Which edges have more topics hidden (scrolling layouts only)
  const updateMore = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const left = el.scrollLeft > 4;
    const right = el.scrollLeft + el.clientWidth < el.scrollWidth - 4;
    setMore((prev) => (prev.left === left && prev.right === right ? prev : { left, right }));
  }, []);

  // Pick the layout from the real widths of the topics and the space available
  const measure = useCallback(() => {
    const nav = scrollRef.current;
    if (!nav) return;
    const list = nav.querySelector(".ex-topics");
    const tabs = [...list.querySelectorAll(":scope > li:not(.ex-topics-break)")];
    const widths = tabs.map((li) => li.getBoundingClientRect().width);
    const listStyle = getComputedStyle(list);
    const navStyle = getComputedStyle(nav);
    const gap = parseFloat(listStyle.columnGap) || 0;
    const listPad = (parseFloat(listStyle.paddingLeft) || 0) + (parseFloat(listStyle.paddingRight) || 0);
    const available = nav.clientWidth - (parseFloat(navStyle.paddingLeft) || 0) - (parseFloat(navStyle.paddingRight) || 0) - listPad;
    const { split, longest, total } = bestSplit(widths, gap);

    let next;
    if (window.matchMedia("(width < 48rem)").matches) next = { layout: "scroll", split, width: 0 };
    else if (total <= available + 0.5) next = { layout: "one", split, width: 0 };
    else if (longest <= available + 0.5) next = { layout: "two", split, width: 0 };
    else next = { layout: "two-scroll", split, width: Math.ceil(longest + listPad) };

    setShape((prev) =>
      prev.layout === next.layout && prev.split === next.split && prev.width === next.width ? prev : next,
    );
  }, []);

  useIsoLayoutEffect(() => {
    measure();
    const nav = scrollRef.current;
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(() => measure());
    if (observer && nav) observer.observe(nav);
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [measure, items.length]);

  // After each layout change: bring the current topic into view (sideways only, so the page
  // itself doesn't move) and refresh the hints
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const current = el.querySelector('[aria-current="page"]');
    if (current && el.scrollWidth > el.clientWidth) {
      const left = current.getBoundingClientRect().left - el.getBoundingClientRect().left + el.scrollLeft;
      el.scrollLeft = Math.max(0, left - (el.clientWidth - current.offsetWidth) / 2);
    } else {
      el.scrollLeft = 0;
    }
    updateMore();
  }, [shape, updateMore]);

  const nudge = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth * 0.6, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <div ref={barRef} data-stuck={stuck ? "" : undefined} className="ex-sticky">
      <Container className="relative motion-safe:animate-rise-in motion-safe:[animation-delay:520ms]">
        <div
          className="ex-topicwrap"
          data-layout={shape.layout ?? undefined}
          data-more-left={more.left ? "" : undefined}
          data-more-right={more.right ? "" : undefined}
          style={shape.width ? { "--ex-rows-w": `${shape.width}px` } : undefined}
        >
          <nav ref={scrollRef} onScroll={updateMore} aria-label="Topics" className="ex-topicbar">
            <ul className="ex-topics">
              {items.map((item, index) => (
                <Fragment key={item.slug}>
                  {/* Line break for the two-line layouts */}
                  {index === shape.split ? <li role="presentation" aria-hidden="true" className="ex-topics-break" /> : null}
                  <li className="shrink-0">
                    <Link href={item.href} aria-current={item.slug === active ? "page" : undefined} className="ex-tab">
                      {item.title}
                    </Link>
                  </li>
                </Fragment>
              ))}
            </ul>
          </nav>

          {/* Scroll hints. Pointer aids only: every topic is still reachable by swiping, and
              keyboard focus scrolls the links into view on its own. */}
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => nudge(-1)}
            className="ex-topicarrow ex-topicarrow-prev"
          >
            <Icon name="caret-down" width={16} height={16} className="block" />
          </button>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => nudge(1)}
            className="ex-topicarrow ex-topicarrow-next"
          >
            <Icon name="caret-down" width={16} height={16} className="block" />
          </button>
        </div>
      </Container>
    </div>
  );
}
