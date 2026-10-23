import Container from "@/components/ui/Container";
import NewsletterBand from "./NewsletterBand";
import QuoteBand from "./QuoteBand";
import SectionHeader from "./SectionHeader";
import StoryCard from "./StoryCard";
import StoryImage from "./StoryImage";
import { Embed, Video } from "./StoryMedia";
import { StoryButton } from "./StoryModules";

/*
 * "Extra sections" from the Studio's Explore page - bands added between the built-in parts of
 * the front page. Each section says where it sits (`placement`); the page renders
 * <ExploreSections at="afterTop" … /> etc. at each spot.
 */

const BG = { soft: "bg-band-soft", band: "bg-band text-band-fg" };

function Band({ background, children, className = "" }) {
  return <section className={`${BG[background] ?? ""} ${background && background !== "page" ? "py-16 md:py-24" : "pt-6 pb-20 md:pt-8 md:pb-28"} ${className}`}>{children}</section>;
}

function Buttons({ buttons = [], center }) {
  if (!buttons.length) return null;
  return (
    <div className={`mt-2 flex flex-wrap items-center gap-4 ${center ? "justify-center" : ""}`}>
      {buttons.map((b, i) => (
        <StoryButton key={b._key ?? i} label={b.label} href={b.href} style={b.style} />
      ))}
    </div>
  );
}

function TextSection({ s }) {
  const center = s.align !== "left";
  return (
    <Band background={s.background}>
      <Container>
        <div data-reveal="" className={`flex max-w-[44rem] flex-col gap-4 ${center ? "mx-auto items-center text-center" : ""}`}>
          {s.eyebrow ? (
            <p data-part="rise" className="ex-rubric">
              {s.eyebrow}
            </p>
          ) : null}
          {s.heading ? (
            <h2 data-part="blur" className="text-heading text-balance">
              {s.heading}
            </h2>
          ) : null}
          {s.text ? (
            <p data-part="rise" style={{ "--j": 1 }} className="text-body-lg leading-[1.5] whitespace-pre-line">
              {s.text}
            </p>
          ) : null}
          <div data-part="rise" style={{ "--j": 2 }}>
            <Buttons buttons={s.buttons} center={center} />
          </div>
        </div>
      </Container>
    </Band>
  );
}

function PictureSection({ s }) {
  if (!s.picture) return null;
  const full = s.picture.size === "full";
  const image = (
    <figure data-reveal="fade">
      <StoryImage
        image={s.picture}
        sizes={full ? "100vw" : "(min-width: 1440px) 1280px, 100vw"}
        className={s.picture.fit === "contain" ? "aspect-[16/9]" : ""}
        style={s.picture.fit === "contain" ? undefined : { aspectRatio: `${s.picture.light.width} / ${s.picture.light.height}` }}
      />
      {s.picture.caption || s.picture.credit ? (
        <figcaption className={`ex-caption ${full ? "page-gutter" : ""}`}>
          {s.picture.caption}
          {s.picture.credit ? <span className="ex-credit">{s.picture.credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
  return (
    <section className="pb-20 md:pb-28">
      {s.heading ? (
        <Container>
          <SectionHeader title={s.heading} className="mb-8" />
        </Container>
      ) : null}
      {full ? image : <Container>{image}</Container>}
    </section>
  );
}

function StoriesSection({ s, posts }) {
  const chosen = s.stories?.length ? s.stories : s.topicSlug ? posts.filter((p) => p.topic?.slug === s.topicSlug).slice(0, 4) : [];
  if (!chosen.length) return null;
  const cols = chosen.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3";
  return (
    <Band background={s.background} className={s.background && s.background !== "page" ? "ex-band" : ""}>
      <Container>
        <SectionHeader title={s.heading} description={s.text} />
        <ul className={`mt-10 grid gap-x-[30px] gap-y-12 sm:grid-cols-2 md:mt-12 ${cols}`}>
          {chosen.map((post, index) => (
            <StoryCard key={post.id} post={post} index={index} dek sizes="(min-width: 1024px) 400px, (min-width: 640px) 45vw, 100vw" />
          ))}
        </ul>
      </Container>
    </Band>
  );
}

function CtaSection({ s }) {
  return (
    <Band background={s.background ?? "soft"}>
      <Container>
        <div data-reveal="" className={`grid items-center gap-10 ${s.image ? "md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-16" : ""}`}>
          {s.image ? (
            <StoryImage image={{ alt: s.alt ?? "", fit: "contain", light: s.image, dark: null }} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/3]" />
          ) : null}
          <div className={`flex flex-col gap-4 ${s.image ? "" : "mx-auto max-w-[44rem] items-center text-center"}`}>
            <h2 data-part="blur" className="text-heading text-balance">
              {s.heading}
            </h2>
            {s.text ? (
              <p data-part="rise" className="text-body-lg leading-[1.5]">
                {s.text}
              </p>
            ) : null}
            <div data-part="rise" style={{ "--j": 1 }}>
              <Buttons buttons={s.buttons} center={!s.image} />
            </div>
          </div>
        </div>
      </Container>
    </Band>
  );
}

function EmbedSection({ s }) {
  if (!s.video && !s.embed?.url) return null;
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        {s.heading ? <SectionHeader title={s.heading} description={s.text} className="mb-8" /> : null}
        <div className="mx-auto max-w-[1040px]">
          {s.video ? <Video node={{ ...s.video, size: "column" }} className="ex-flush" /> : <Embed node={s.embed} />}
        </div>
      </Container>
    </section>
  );
}

export default function ExploreSections({ sections = [], at, posts = [], page }) {
  const here = sections.filter((s) => (s.placement ?? "end") === at);
  if (!here.length) return null;
  return here.map((s, i) => {
    const key = s._key ?? `${at}-${i}`;
    switch (s._type) {
      case "textSection":
        return <TextSection key={key} s={s} />;
      case "pictureSection":
        return <PictureSection key={key} s={s} />;
      case "quoteSection":
        return (
          <QuoteBand
            key={key}
            text={s.text}
            post={s.story ? { ...s.story, author: s.attribution ? { name: s.attribution } : s.story.author } : null}
            attribution={s.attribution}
          />
        );
      case "storiesSection":
        return <StoriesSection key={key} s={s} posts={posts} />;
      case "ctaSection":
        return <CtaSection key={key} s={s} />;
      case "embedSection":
        return <EmbedSection key={key} s={s} />;
      case "newsletterSection":
        return (
          <div key={key} className="pb-20 md:pb-28">
            <NewsletterBand copy={{ ...page.newsletter, show: true, ...(s.heading ? { title: s.heading } : {}) }} />
          </div>
        );
      default:
        return null;
    }
  });
}
