import Link from "next/link";
import Container from "@/components/ui/Container";
import SortSelect from "./SortSelect";

/**
 * Collection links (All, Journals, Workbooks…) on the left, the count and sort on the right,
 * resting on a hairline. On phones the links scroll sideways.
 * `relative z-20` so the sort menu opens over the product grid below.
 */
export default function CollectionBar({ collections, active = "all", count, sort }) {
  const items = [
    { handle: "all", title: "All", href: "/shop" },
    ...collections.map((c) => ({ ...c, href: `/shop/${c.handle}` })),
  ];
  const query = sort && sort !== "featured" ? `?sort=${sort}` : "";

  return (
    <Container className="relative z-20 motion-safe:animate-rise-in motion-safe:[animation-delay:480ms]">
      <div className="flex flex-col gap-4 border-b border-divider md:flex-row md:items-end md:justify-between md:gap-8">
        <nav aria-label="Collections" className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:px-0">
          <ul className="flex gap-7 md:gap-9">
            {items.map((item) => {
              const current = item.handle === active;
              return (
                <li key={item.handle} className="shrink-0">
                  <Link
                    href={`${item.href}${query}`}
                    aria-current={current ? "page" : undefined}
                    scroll={false}
                    className="shop-tab"
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center justify-between gap-6 pb-3 md:justify-end">
          <p className="font-sans text-xs tracking-[0.08em] text-fg-muted tabular-nums" aria-live="polite">
            {count} {count === 1 ? "piece" : "pieces"}
          </p>
          <SortSelect value={sort} />
        </div>
      </div>
    </Container>
  );
}
