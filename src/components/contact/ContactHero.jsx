import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import Glow from "@/components/ui/Glow";
import IconHalo from "@/components/ui/IconHalo";
import { contactChannels, contactHero } from "@/lib/contact";

/** Title, the four ways to reach us, then the sailboat landscape. */
export default function ContactHero() {
  const { eyebrow, title, intro } = contactHero;

  return (
    <section className="@container relative overflow-x-clip">
      <Glow src="/images/dark/glow-hero.svg" className="top-[-495px] left-1/2 size-[1660px] -translate-x-1/2" />

      {/* Clouds drifting at either edge */}
      <Artwork
        className="absolute top-[66px] left-[-32.78cqw] aspect-[701/212] w-[max(48.68cqw,320px)] motion-safe:animate-cloud-in motion-safe:[animation-delay:600ms] max-md:hidden"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png" }}
        sizes="50vw"
      />
      <Artwork
        className="absolute top-[203px] left-[60.56cqw] aspect-[701/212] w-[max(48.68cqw,320px)] motion-safe:animate-cloud-in motion-safe:[animation-delay:800ms] max-md:hidden"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png" }}
        sizes="50vw"
      />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-8 pt-12 text-center md:pt-[120px]">
        <p className="font-serif text-2xl leading-5 tracking-[0.06em] text-eyebrow motion-safe:animate-rise-in motion-safe:[animation-delay:80ms]">
          {eyebrow}
        </p>
        <div className="flex flex-col items-center gap-3">
          <h1 className="max-w-[698px] text-page text-fg motion-safe:animate-rise-in-blur motion-safe:[animation-delay:180ms]">
            {title}
          </h1>
          <p className="max-w-[610px] text-lead leading-[1.34] text-fg motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]">
            {intro}
          </p>
        </div>
      </div>

      <Container className="relative z-10 mt-[60px]">
        <ul className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {contactChannels.map((channel, index) => (
            <li
              key={channel.title}
              data-reveal=""
              style={{ "--i": index }}
              className="flex flex-col items-center gap-5 rounded-2xl bg-linear-to-b from-surface to-surface-soft p-6 text-center"
            >
              <IconHalo icon={channel.icon} iconSize={48} />
              <div className="flex w-full flex-1 flex-col items-center gap-4">
                <div className="flex flex-1 flex-col items-center gap-2 text-fg">
                  <h2 className="text-title">{channel.title}</h2>
                  <p className="text-body">{channel.description}</p>
                </div>
                <span data-part="line" aria-hidden="true" className="h-px w-full bg-divider" />
                {channel.link ? (
                  <a
                    href={channel.link.href}
                    className="font-sans text-sm leading-[17px] text-primary underline decoration-primary/50 underline-offset-4 transition-colors hover:text-fg hover:decoration-current dark:text-eyebrow dark:decoration-eyebrow/50 dark:hover:text-fg"
                  >
                    {channel.link.label}
                  </a>
                ) : (
                  <p className="font-sans text-sm leading-[17px] text-primary dark:text-eyebrow">{channel.note}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Sailboat landscape (same painting as About → Pillars) */}
      <div className="relative mt-[60px] aspect-[1440/373] w-full min-w-[640px]">
        <Artwork
          className="absolute inset-0"
          light={{ src: "/images/about/landscape-sailboat.png" }}
          dark={{ src: "/images/about/landscape-sailboat-night.png" }}
          sizes="max(100vw, 640px)"
          data-reveal="fade"
          style={{ "--reveal-dur": "2.2s" }}
        />
        <div className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]" aria-hidden="true" />
      </div>
    </section>
  );
}
