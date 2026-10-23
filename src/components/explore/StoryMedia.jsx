import { AudioPlayer, StoryVideo } from "./MediaPlayers";
import StoryImage from "./StoryImage";

/*
 * Media inside a story (and the story's cover video). Sizes: "column" sits in the text column,
 * "wide" breaks out a little either side, "full" spans the page.
 */

const sizeClass = (size) => (size === "full" ? "ex-media-full" : size === "wide" ? "ex-media-wide" : "ex-media-column");

function Caption({ caption, credit }) {
  if (!caption && !credit) return null;
  return (
    <figcaption className="ex-caption">
      {caption}
      {credit ? <span className="ex-credit">{credit}</span> : null}
    </figcaption>
  );
}

const frameStyle = (image) =>
  image.fit === "contain" || !image.light?.width ? undefined : { aspectRatio: `${image.light.width} / ${image.light.height}` };

/** A picture (photo, painting, animated GIF or SVG), with its night version in dark mode. */
export function Picture({ node }) {
  if (!node.light) return null;
  const full = node.size === "full";
  return (
    <figure className={`ex-figure ${sizeClass(node.size)}`}>
      <StoryImage
        image={node}
        sizes={full ? "100vw" : node.size === "wide" ? "(min-width: 1024px) 960px, 100vw" : "(min-width: 768px) 760px, 100vw"}
        className={node.fit === "contain" ? "aspect-[4/3]" : ""}
        style={frameStyle(node)}
      />
      <Caption caption={node.caption} credit={node.credit} />
    </figure>
  );
}

/** Two to four pictures in a grid, one shared caption. */
export function Gallery({ node }) {
  const images = node.images ?? [];
  if (!images.length) return null;
  const cols = Math.min(Math.max(node.columns ?? 2, 2), 4);
  return (
    <figure className="ex-figure ex-media-wide">
      <ul className="ex-gallery" style={{ "--cols": cols }}>
        {images.map((image) => (
          <li key={image._key ?? image.light.src}>
            <StoryImage image={{ ...image, fit: "cover" }} sizes={`(min-width: 1024px) ${Math.round(960 / cols)}px, 50vw`} className="aspect-square" />
          </li>
        ))}
      </ul>
      <Caption caption={node.caption} />
    </figure>
  );
}

/** An uploaded video file - with controls, or looping silently like a GIF. */
export function Video({ node, className = "" }) {
  if (!node.src) return null;
  return (
    <figure className={`ex-figure ${sizeClass(node.size)} ${className}`}>
      <div className="ex-video-frame">
        <StoryVideo src={node.src} mime={node.mime} poster={node.poster} loop={node.loop} title={node.title} />
      </div>
      <Caption caption={node.caption} />
    </figure>
  );
}

/** An uploaded sound file in the site's own player. */
export function Audio({ node }) {
  if (!node.src) return null;
  return (
    <figure className="ex-figure ex-media-column">
      <AudioPlayer src={node.src} mime={node.mime} title={node.title} subtitle={node.subtitle} artwork={node.artwork} />
      {node.transcript ? (
        <details className="ex-transcript">
          <summary>Transcript</summary>
          <p>{node.transcript}</p>
        </details>
      ) : null}
    </figure>
  );
}

/** Turns a share link into an embeddable player address (null if we don't know the service). */
export function embedFor(rawUrl) {
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");

  if (host === "youtu.be") return { src: `https://www.youtube-nocookie.com/embed/${url.pathname.slice(1)}`, ratio: "16 / 9" };
  if (host.endsWith("youtube.com")) {
    const id = url.searchParams.get("v") ?? url.pathname.match(/\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
    return id ? { src: `https://www.youtube-nocookie.com/embed/${id}`, ratio: url.pathname.startsWith("/shorts") ? "9 / 16" : "16 / 9" } : null;
  }
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    const id = url.pathname.match(/(\d+)/)?.[1];
    return id ? { src: `https://player.vimeo.com/video/${id}?dnt=1`, ratio: "16 / 9" } : null;
  }
  if (host === "open.spotify.com") {
    const path = url.pathname.replace(/^\/(intl-[a-z]+\/)?/, "/").replace(/^\/embed/, "");
    const tall = /^\/(playlist|album|show|artist)/.test(path);
    return { src: `https://open.spotify.com/embed${path}`, height: tall ? 380 : 152 };
  }
  if (host === "soundcloud.com") {
    return { src: `https://w.soundcloud.com/player/?url=${encodeURIComponent(url.href)}&color=%235d8a8f&visual=false`, height: 166 };
  }
  if (host === "w.soundcloud.com") return { src: url.href, height: 166 };
  // Anything else that is already an embed address
  if (/\/embed\b|player\./.test(url.href)) return { src: url.href, ratio: "16 / 9" };
  return null;
}

/** YouTube, Vimeo, Spotify, SoundCloud… (unknown links show as a plain link). */
export function Embed({ node }) {
  const embed = node.url ? embedFor(node.url) : null;
  if (!embed) {
    return node.url ? (
      <p>
        <a href={node.url} target="_blank" rel="noopener noreferrer">
          {node.title || node.caption || node.url}
        </a>
      </p>
    ) : null;
  }
  return (
    <figure className={`ex-figure ${embed.height ? "ex-media-column" : "ex-media-wide"}`}>
      <div className="ex-embed" style={embed.height ? { height: embed.height } : { aspectRatio: embed.ratio }}>
        <iframe
          src={embed.src}
          title={node.title || node.caption || "Embedded media"}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <Caption caption={node.caption} />
    </figure>
  );
}
