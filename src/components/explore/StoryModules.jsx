import Link from "next/link";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import StoryCard from "./StoryCard";
import StoryImage from "./StoryImage";

/*
 * Extra story-body modules from the Studio: picture + text, callout, button, columns, space,
 * story card and product card. (Pictures, galleries, video, audio and embeds: StoryMedia.jsx.)
 */

const external = (href = "") => /^(https?:|mailto:|tel:)/.test(href);

/** A Studio button: filled, outline or a quiet text link. */
export function StoryButton({ label, href, style = "primary" }) {
  if (!label || !href) return null;
  const ext = external(href) ? { target: "_blank", rel: "noopener noreferrer" } : {};
  if (style === "text") {
    return (
      <Link href={href} className="ex-more" {...ext}>
        {label}
        <Icon name="arrow-right" width={18} height={18} />
      </Link>
    );
  }
  return (
    <Button href={href} variant={style === "outline" ? "inverse" : "primary"} className={style === "outline" ? "border border-field-line" : ""} {...ext}>
      {label}
    </Button>
  );
}

export function ImageText({ node }) {
  const right = node.imageSide === "right";
  return (
    <section className={`ex-imagetext ex-media-wide ${right ? "is-right" : ""}`}>
      {node.image ? <StoryImage image={node.image} sizes="(min-width: 1024px) 460px, 100vw" className="aspect-[4/5]" /> : null}
      <div className="ex-imagetext-copy">
        {node.heading ? <h3>{node.heading}</h3> : null}
        {node.text ? <p>{node.text}</p> : null}
        {node.link?.label && node.link?.href ? (
          <div className="mt-2">
            <StoryButton label={node.link.label} href={node.link.href} style="text" />
          </div>
        ) : null}
      </div>
    </section>
  );
}

export function Callout({ node }) {
  return (
    <aside className={`ex-callout ex-callout-${node.tone ?? "soft"}`}>
      {node.title ? <p className="ex-callout-title">{node.title}</p> : null}
      {node.text ? <p className="ex-callout-text">{node.text}</p> : null}
    </aside>
  );
}

export function ButtonBlock({ node }) {
  return (
    <div className={`ex-buttonblock ${node.align === "center" ? "is-center" : ""}`}>
      <StoryButton label={node.label} href={node.href} style={node.style} />
    </div>
  );
}

export function Columns({ node }) {
  const items = node.items ?? [];
  if (!items.length) return null;
  return (
    <div className="ex-columns ex-media-wide" style={{ "--cols": Math.min(items.length, 3) }}>
      {items.map((item, i) => (
        <div key={item._key ?? i}>
          {item.heading ? <h3>{item.heading}</h3> : null}
          {item.text ? <p>{item.text}</p> : null}
        </div>
      ))}
    </div>
  );
}

export function Spacer({ node }) {
  return <div aria-hidden="true" className={`ex-spacer ex-spacer-${node.size ?? "m"}`} />;
}

export function StoryLinkCard({ node }) {
  if (!node.story) return null;
  return (
    <aside className="ex-storylink" aria-label={node.label || "Read also"}>
      {node.label ? <p className="ex-rubric">{node.label}</p> : null}
      <StoryCard post={node.story} variant="compact" as="div" heading="p" reveal={undefined} className="mt-3" />
    </aside>
  );
}

export function ProductCard({ node }) {
  return (
    <aside className="ex-product">
      {node.image ? (
        <div className="ex-product-media">
          <StoryImage image={{ alt: node.alt ?? "", fit: "contain", light: node.image, dark: null }} sizes="200px" className="aspect-square" />
        </div>
      ) : null}
      <div className="ex-product-copy">
        {node.eyebrow ? <p className="ex-rubric">{node.eyebrow}</p> : null}
        <p className="ex-product-title">{node.title}</p>
        {node.text ? <p className="ex-product-text">{node.text}</p> : null}
        {node.price ? <p className="ex-product-price">{node.price}</p> : null}
        {node.href ? (
          <div className="mt-3">
            <StoryButton label={node.label || "See it in the shop"} href={node.href} style="outline" />
          </div>
        ) : null}
      </div>
    </aside>
  );
}

/** Two pictures side by side; "left"/"right" makes that one wider. */
export function ImagePair({ node }) {
  const images = node.images ?? [];
  if (images.length < 2) return null;
  const cols = node.ratio === "left" ? "3fr 2fr" : node.ratio === "right" ? "2fr 3fr" : "1fr 1fr";
  return (
    <figure className="ex-figure ex-media-wide">
      <div className="ex-pair" style={{ "--pair": cols }}>
        {images.slice(0, 2).map((image) => (
          <div key={image._key ?? image.light.src}>
            <StoryImage image={image} sizes="(min-width: 1024px) 480px, 50vw" className="ex-pair-frame" />
            {image.caption ? <p className="ex-pair-caption">{image.caption}</p> : null}
          </div>
        ))}
      </div>
      {node.caption ? <figcaption className="ex-caption">{node.caption}</figcaption> : null}
    </figure>
  );
}

/** A row of figures with labels. */
export function Stats({ node }) {
  const items = node.items ?? [];
  if (!items.length) return null;
  return (
    <section className="ex-stats ex-media-wide" aria-label={node.heading || "In numbers"}>
      {node.heading ? <p className="ex-rubric">{node.heading}</p> : null}
      <dl style={{ "--cols": Math.min(items.length, 4) }}>
        {items.map((item, i) => (
          <div key={item._key ?? i}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
