import Artwork from "@/components/ui/Artwork";
import Button from "@/components/ui/Button";
import { articles } from "@/lib/content";

export default function Articles() {
  return (
    <section className="@container relative overflow-x-clip py-24 md:py-40">
      <Artwork
        flip
        className="absolute bottom-0 left-0 aspect-[1440/503] w-[max(100cqw,720px)] dark:[mask-image:linear-gradient(to_bottom,transparent,black_24%)]"
        light={{ src: "/images/light/mist-b.png", crop: [100, 190.85, 0, -90.85], opacity: 0.42 }}
        dark={{ src: "/images/dark/night-mist-bank.png", crop: [100, 190.85, 0, -90.85], opacity: 0.42 }}
        data-reveal="fade"
        style={{ "--reveal-dur": "2s" }}
      />
      <div className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]" aria-hidden="true" />

      <div className="page-gutter relative mx-auto flex max-w-[1440px] flex-col gap-12 lg:flex-row lg:items-center lg:gap-[120px]">
        <div data-reveal="" className="flex flex-col gap-4 text-fg lg:w-[550px] lg:shrink-0">
          <h2 data-part="blur" className="text-heading">
            Yes. And perhaps especially for you.
          </h2>
          <div className="flex flex-col gap-2 text-body-lg leading-[26px]">
            <p data-part="rise" style={{ "--j": 0 }}>
              If you&rsquo;ve kept journals all your life, there&rsquo;s plenty here to sink into nuanced
              prompts, layered ideas, thoughtfully paced spaces that invite you to go as deeply as you wish.
            </p>
            <p data-part="rise" style={{ "--j": 1 }}>
              Write for pages. Jot down a sentence. Leave a prompt untouched. Or simply follow the little
              stories for the pleasure of them.
            </p>
            <p data-part="rise" style={{ "--j": 2 }}>
              For lifelong journalers, curious wanderers, deep thinkers, occasional scribblers, and people
              who simply love a beautiful book there is room for you here.
            </p>
          </div>
        </div>

        <ul className="flex flex-1 flex-col lg:py-[60px]">
          {articles.map((article, index) => (
            <li
              key={article.href}
              data-reveal="right"
              style={{ "--i": index, "--delay": "250ms" }}
              className="hover-group relative flex items-center gap-4 py-6 first:pt-0 last:pb-0"
            >
              {/* Divider draws in from the left */}
              {index > 0 ? (
                <span data-part="line" aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-divider" />
              ) : null}
              <div className="flex min-w-0 flex-1 flex-col gap-2 text-fg">
                <h3 className="hover-nudge text-title">{article.title}</h3>
                <p className="text-body">{article.description}</p>
              </div>
              <Button href={article.href} size="sm" aria-label={`Read: ${article.title}`}>
                Read
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
