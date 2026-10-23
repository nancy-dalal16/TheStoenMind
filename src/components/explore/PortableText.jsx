import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { Audio, Embed, Gallery, Picture, Video } from "./StoryMedia";
import { ButtonBlock, Callout, Columns, ImagePair, ImageText, ProductCard, Spacer, Stats, StoryLinkCard } from "./StoryModules";

/**
 * Renders a Sanity Portable Text body (the demo posts use the same structure) without any
 * extra packages. Supports:
 *   blocks   normal, h2, h3, h4, blockquote · bullet / number lists
 *   marks    em, strong, underline, code, link (internal links use next/link)
 *   types    picture (image / GIF / SVG), gallery, video, audio, embed, imageText, callout, button,
 *            columns, spacer, storyLink, productLink, pullQuote, prompt, sectionBreak (cloud / line / dots)
 * The first paragraph gets a drop cap and the last one the end mark (a small cloud).
 * Unknown types render nothing, so new Studio blocks never break a page.
 */
export default function PortableText({ value = [] }) {
  const nodes = groupLists(value);
  const isPara = (n) => n._type === "block" && (n.style ?? "normal") === "normal";
  const first = nodes.findIndex(isPara);
  const last = nodes.findLastIndex(isPara);

  return (
    <div className="ex-prose">
      {nodes.map((node, index) => (
        <Node key={node._key ?? index} node={node} dropcap={index === first} end={index === last} />
      ))}
    </div>
  );
}

/** Consecutive list items become one <ul>/<ol> node. */
function groupLists(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block._type === "block" && block.listItem) {
      const prev = out.at(-1);
      if (prev?._type === "list" && prev.listItem === block.listItem) prev.items.push(block);
      else out.push({ _type: "list", _key: `list-${block._key}`, listItem: block.listItem, items: [block] });
    } else {
      out.push(block);
    }
  }
  return out;
}

function Node({ node, dropcap, end }) {
  switch (node._type) {
    case "block":
      return <Block block={node} dropcap={dropcap} end={end} />;
    case "list": {
      const List = node.listItem === "number" ? "ol" : "ul";
      return (
        <List>
          {node.items.map((item) => (
            <li key={item._key}>
              <Spans block={item} />
            </li>
          ))}
        </List>
      );
    }
    case "picture":
    case "gif":
    case "image": // older documents
      return <Picture node={node} />;
    case "gallery":
      return <Gallery node={node} />;
    case "video":
      return <Video node={node} />;
    case "audio":
      return <Audio node={node} />;
    case "embed":
      return <Embed node={node} />;
    case "imageText":
      return <ImageText node={node} />;
    case "imagePair":
      return <ImagePair node={node} />;
    case "stats":
      return <Stats node={node} />;
    case "callout":
      return <Callout node={node} />;
    case "button":
      return <ButtonBlock node={node} />;
    case "columns":
      return <Columns node={node} />;
    case "spacer":
      return <Spacer node={node} />;
    case "storyLink":
      return <StoryLinkCard node={node} />;
    case "productLink":
      return <ProductCard node={node} />;
    case "pullQuote":
      return node.text ? (
        <figure className="ex-pull">
          <blockquote>
            <p>“{node.text.replace(/^[“"]|[”"]$/g, "")}”</p>
          </blockquote>
          {node.attribution ? <figcaption className="ex-byline justify-center">{node.attribution}</figcaption> : null}
        </figure>
      ) : null;
    case "prompt":
      return (
        <aside className="ex-prompt" aria-label={node.heading || "A prompt"}>
          <Icon name="cloud" width={36} height={20} className="ex-prompt-cloud" />
          {node.heading ? <p className="ex-rubric">{node.heading}</p> : null}
          {node.text ? <p className="ex-prompt-text">{node.text}</p> : null}
        </aside>
      );
    case "sectionBreak":
      return (
        <div role="separator" className={`ex-break ex-break-${node.style ?? "cloud"}`}>
          {node.style === "line" ? <span className="ex-break-line" /> : node.style === "dots" ? <span className="ex-break-dots">· · ·</span> : <Icon name="cloud" width={40} height={23} />}
        </div>
      );
    default:
      return null;
  }
}

function Block({ block, dropcap, end }) {
  const content = <Spans block={block} end={end} />;

  switch (block.style) {
    case "h2":
      return <h2>{content}</h2>;
    case "h3":
      return <h3>{content}</h3>;
    case "h4":
      return <h4>{content}</h4>;
    case "blockquote":
      return (
        <blockquote>
          <p>{content}</p>
        </blockquote>
      );
    default:
      return <p className={dropcap ? "ex-dropcap" : undefined}>{content}</p>;
  }
}

function Spans({ block, end = false }) {
  const defs = Object.fromEntries((block.markDefs ?? []).map((d) => [d._key, d]));
  const marked = (text, span) => {
    let node = withBreaks(text);
    for (const mark of span.marks ?? []) node = wrap(node, mark, defs[mark]);
    return node;
  };
  const children = block.children ?? [];

  return children.map((span, index) => {
    const text = span.text ?? "";
    if (!end || index !== children.length - 1) return <span key={span._key ?? index}>{marked(text, span)}</span>;

    // Last span of the last paragraph: the final word and the end mark (a small cloud) are
    // kept together, so the mark never drops onto a line of its own.
    const cut = text.trimEnd().lastIndexOf(" ") + 1;
    return (
      <span key={span._key ?? index}>
        {cut ? marked(text.slice(0, cut), span) : null}
        <span className="whitespace-nowrap">
          {marked(text.slice(cut), span)}
          <Icon name="cloud" width={26} height={15} className="ex-endmark" />
        </span>
      </span>
    );
  });
}

function withBreaks(text) {
  if (!text.includes("\n")) return text;
  return text.split("\n").flatMap((line, i) => (i ? [<br key={i} />, line] : [line]));
}

function wrap(children, mark, def) {
  switch (mark) {
    case "em":
      return <em>{children}</em>;
    case "strong":
      return <strong>{children}</strong>;
    case "underline":
      return <u>{children}</u>;
    case "strike-through":
      return <s>{children}</s>;
    case "code":
      return <code>{children}</code>;
    default:
      if (def?._type === "link" && def.href) {
        const internal = (def.href.startsWith("/") || def.href.startsWith("#")) && !def.blank;
        return internal ? (
          <Link href={def.href}>{children}</Link>
        ) : (
          <a href={def.href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
      return children;
  }
}
