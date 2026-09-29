"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Inline header links with the current page marked (Figma: active item underlined). */
export default function NavLinks({ items }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-8">
      {items.map((item) => {
        const current = item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className="relative py-1 font-sans text-sm leading-5 tracking-[0.06em] text-nav transition-colors hover:text-fg aria-[current=page]:text-fg after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
