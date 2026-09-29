import Link from "next/link";
import Logo from "@/components/ui/Logo";
import Artwork from "@/components/ui/Artwork";
import { brandTagline, footerColumns, socialLinks } from "@/lib/content";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="@container relative overflow-hidden">
      {/* Misty range — bottom-anchored, mirrored as in the design */}
      <Artwork
        flip
        className="absolute right-0 bottom-0 aspect-[1440/596] w-[max(100cqw,900px)] dark:[mask-image:linear-gradient(to_bottom,transparent,black_36%)]"
        light={{ src: "/images/light/footer-landscape.png", crop: [100, 161.01, 0, -61.01], opacity: 0.9 }}
        dark={{ src: "/images/dark/night-range.png", crop: [100, 161.01, 0, -61.01], opacity: 0.51 }}
        data-reveal="fade"
        style={{ "--reveal-dur": "2.2s" }}
      />
      {/* Bear & bird */}
      <Artwork
        className="absolute bottom-0 left-0 h-[clamp(140px,14.93cqw,215px)] aspect-[198/215]"
        light={{ src: "/images/light/mist-a.png", crop: [444.73, 580.54, -218.57, -355.25] }}
        dark={{ src: "/images/dark/night-bear.png", crop: [261.44, 341.27, -145.19, -210.58] }}
        sizes="(min-width: 1440px) 880px, 60vw"
        data-reveal="left"
        style={{ "--reveal-dur": "2s", "--delay": "400ms" }}
      />

      <div className="page-gutter relative mx-auto flex w-full max-w-[1440px] flex-col gap-12 pt-16 pb-[clamp(220px,24cqw,380px)] md:gap-16 md:pt-[100px]">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div data-reveal="" className="flex flex-col gap-6">
            <Logo />
            <p className="text-body text-fg">
              {brandTagline}
            </p>
          </div>

          {footerColumns.map((column, index) => (
            <nav
              key={column.heading}
              aria-label={column.heading}
              data-reveal=""
              style={{ "--i": index + 1 }}
              className="flex flex-col gap-4"
            >
              <h2 className="text-title text-fg">{column.heading}</h2>
              <ul className="flex flex-col gap-4 text-body">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="link-draw text-fg hover:text-eyebrow"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div
          data-reveal="fade"
          style={{ "--delay": "300ms" }}
          className="flex flex-col gap-3 font-sans text-sm leading-[22px] text-fg-muted"
        >
          <p>© {year} the Stoen Mind. All rights reserved.</p>
          <p>
            {socialLinks.map((link, index) => (
              <span key={link.href}>
                {index > 0 ? <span aria-hidden="true"> | </span> : null}
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
