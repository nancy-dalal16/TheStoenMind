import Logo from "@/components/ui/Logo";
import ThemeToggle from "@/components/theme/ThemeToggle";
import StickyHeader from "./StickyHeader";
import SiteMenu from "./SiteMenu";
import NavLinks from "./NavLinks";
import { brandTagline, mainNav, socialLinks } from "@/lib/content";

// Shared transition for the pieces that swap when the page starts scrolling.
const SWAP = "transition-[opacity,translate,visibility] duration-500 ease-soft motion-reduce:transition-none";

/**
 * Sticky header.
 * - At the top of the page (md+): logo + inline links + theme toggle, as in the design.
 * - Once the page scrolls: the bar slims (transparent, with only a soft page-colour fade behind it), the inline links fade out and the
 *   "Menu" button fades in, opening <SiteMenu />, which slides in from the right.
 * - Below md there's no room for inline links, so the Menu button is always shown.
 * Hidden states use `invisible` (not just opacity) so they drop out of the tab order.
 */
export default function Header() {
  return (
    <StickyHeader>
      <div className="pointer-events-auto relative h-full transition-[height] duration-500 ease-soft group-data-[scrolled]/header:h-16 motion-reduce:transition-none md:group-data-[scrolled]/header:h-[72px]">
        {/* Soft fade behind the scrolled header (no bar, no blur) — see .header-fade in globals.css */}
        <div aria-hidden="true" className="header-fade" />

        <div className="page-gutter relative mx-auto flex h-full max-w-[1440px] items-center justify-between motion-safe:animate-drop-in">
          <Logo
            variant="cloud"
            className="origin-left transition-transform duration-500 ease-soft group-data-[scrolled]/header:scale-[0.8] motion-reduce:transition-none"
          />

          <div className="flex items-center gap-3 md:gap-8">
            <div className="relative flex items-center">
              {/* Inline links — top of the page, md+ */}
              <nav
                aria-label="Main"
                className={`hidden md:block ${SWAP} group-data-[scrolled]/header:pointer-events-none group-data-[scrolled]/header:invisible group-data-[scrolled]/header:-translate-y-1 group-data-[scrolled]/header:opacity-0`}
              >
                <NavLinks items={mainNav} />
              </nav>

              {/* Menu button — always below md; on md+ it takes over once scrolled */}
              <div
                className={`md:absolute md:inset-y-0 md:right-0 md:flex md:items-center ${SWAP} md:pointer-events-none md:invisible md:translate-y-1 md:opacity-0 md:group-data-[scrolled]/header:pointer-events-auto md:group-data-[scrolled]/header:visible md:group-data-[scrolled]/header:translate-y-0 md:group-data-[scrolled]/header:opacity-100`}
              >
                <SiteMenu items={mainNav} tagline={brandTagline} social={socialLinks} />
              </div>
            </div>

            <ThemeToggle />
          </div>
        </div>
      </div>
    </StickyHeader>
  );
}
