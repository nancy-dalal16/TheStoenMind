import Container from "@/components/ui/Container";
import Icon from "@/components/ui/Icon";
import SanctuaryMark from "./SanctuaryMark";
import { aboutStory } from "@/lib/about";

export default function Story() {
  const { title, paragraphs, stats, card, badge } = aboutStory;

  return (
    <section id="our-story" className="py-24 md:py-40">
      <Container className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-20">
        {/* Sanctuary card + floating badge */}
        <div data-reveal="left" className="hover-group relative w-full max-w-[516px] shrink-0 pb-6 lg:w-[516px]">
          <div className="hover-rise rounded-[20px] bg-surface p-3 shadow-[0_20px_24px_-6px_var(--color-surface-shadow)]">
            <div className="flex flex-col items-center justify-center gap-5 overflow-clip rounded-2xl border border-surface-line bg-linear-to-b from-surface-soft to-surface px-6 py-16 text-center sm:py-[100px]">
              <div data-part="bloom" className="flex size-[180px] items-center justify-center rounded-full bg-surface-tint">
                <SanctuaryMark />
              </div>
              <div className="flex flex-col items-center gap-1">
                <p className="font-serif text-2xl text-fg">{card.title}</p>
                <p className="font-sans text-xs font-medium tracking-[0.08em] text-eyebrow uppercase">{card.caption}</p>
              </div>
            </div>
          </div>

          <div
            data-part="rise"
            style={{ "--j": 3 }}
            className="hover-float absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-2xl bg-surface p-4 whitespace-nowrap shadow-[0_4px_6px_rgb(0_0_0/0.16)] sm:right-[49px] sm:left-auto sm:translate-x-0"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-surface-tint text-primary">
              <Icon name="check" />
            </span>
            <span className="flex flex-col gap-1 font-sans text-fg">
              <span className="text-base font-semibold">{badge.title}</span>
              <span className="text-xs">{badge.caption}</span>
            </span>
          </div>
        </div>

        {/* Copy + stats */}
        <div data-reveal="" className="flex min-w-0 flex-1 flex-col gap-6 text-fg">
          <div className="flex flex-col gap-2">
            <h2 data-part="blur" className="text-heading">
              {title}
            </h2>
            {paragraphs.map((text, index) => (
              <p key={index} data-part="rise" style={{ "--j": index }} className="text-body-lg leading-[26px]">
                {text}
              </p>
            ))}
          </div>
          <span data-part="line" aria-hidden="true" className="h-px w-full bg-divider" />
          <dl className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <div key={stat.label} data-part="rise" style={{ "--j": index + 3 }} className="flex flex-col-reverse">
                <dt className="font-sans text-xs">{stat.label}</dt>
                <dd className="font-serif text-2xl leading-8 font-bold">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
