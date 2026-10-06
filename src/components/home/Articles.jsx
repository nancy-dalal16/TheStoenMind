import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import { audiences } from "@/lib/content";

export default function Articles() {
  return (
    <section className="@container relative overflow-x-clip pt-[60px] pb-24 md:pb-40">
      <Artwork
        flip
        className="articles-mist absolute bottom-0 left-0 aspect-[1440/503] w-[max(100cqw,720px)] dark:[mask-image:linear-gradient(to_bottom,transparent,black_24%)]"
        light={{
          src: "/images/light/mist-b.png",
          crop: [100, 190.85, 0, -90.85],
          opacity: 0.42,
        }}
        dark={{
          src: "/images/dark/night-mist-bank.png",
          crop: [100, 190.85, 0, -90.85],
          opacity: 0.58,
        }}
        data-reveal="fade"
        style={{ "--reveal-dur": "2s" }}
      />
      <div
        className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]"
        aria-hidden="true"
      />

      <div className="page-gutter relative mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row lg:items-center lg:gap-[120px]">
        <div
          data-reveal=""
          className="flex flex-col gap-4 text-fg lg:w-[550px] lg:shrink-0"
        >
          <p
            data-part="rise"
            className="font-serif text-xl leading-6 tracking-[0.04em] text-eyebrow"
          >
            And you ask, is this for me?
          </p>
          <h2 data-part="blur" className="text-heading text-balance">
            Yes. And perhaps especially for you.
          </h2>
          {/* Wrapper carries the reveal so the button keeps its own hover lift */}
          <div data-part="rise" style={{ "--j": 1 }} className="mt-4">
            <Button href="/shop" iconEnd="arrow-right">
              Find your book
            </Button>
          </div>
        </div>

        <ul className="flex flex-1 flex-col lg:py-[60px]">
          {audiences.map((item, index) => (
            <li
              key={item.title}
              data-reveal="right"
              style={{ "--i": index, "--delay": "250ms" }}
              className="relative flex flex-col gap-2 py-6 text-fg first:pt-0 last:pb-0"
            >
              {/* Divider draws in from the left */}
              {index > 0 ? (
                <span
                  data-part="line"
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-divider"
                />
              ) : null}
              <h3 className="text-title font-semibold">{item.title}</h3>
              <p className="text-body">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
