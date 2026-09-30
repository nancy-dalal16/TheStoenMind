import Image from "next/image";

/**
 * A decorative, theme-aware illustration.
 *
 * `className` places the frame (position / size / aspect-ratio).
 * `light` and `dark` describe what fills it in each theme; pass `image`
 * instead when both themes share one asset. Each variant accepts:
 *   - src      path under /public
 *   - crop     [width%, height%, left%, top%] — reproduces a Figma image crop
 *              (the image is oversized inside the frame and offset).
 *              Omit for `object-cover`.
 *   - position object-position when not cropping (default "center")
 *   - opacity  0–1
 *   - brightness CSS brightness() multiplier (e.g. 1.12); lifts night art
 *              without changing its colours
 *
 * `important` raises fetch priority for above-the-fold art that can be the LCP
 * element (the hero). Images stay lazy on purpose: eager loading would also
 * download the inactive theme's copy.
 *
 * Only the active theme's image is displayed; the other is `display: none`
 * and — because it is lazy-loaded — never downloaded.
 */
export default function Artwork({
  image,
  light = image,
  dark = image,
  sizes = "100vw",
  flip = false,
  important = false,
  className = "",
  ...rest
}) {
  const shared = light === dark;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none overflow-hidden select-none ${className}`}
      {...rest}
    >
      {/* The mirror lives on an inner wrapper: the reveal system resets `scale` on
          [data-reveal] roots (reduced motion / no-JS), which would silently un-flip the art. */}
      <div className={`absolute inset-0 ${flip ? "-scale-x-100" : ""}`}>
      {shared ? (
        <Layer variant={light} sizes={sizes} important={important} />
      ) : (
        <>
          {light ? <Layer variant={light} sizes={sizes} important={important} theme="light" className="dark:hidden" /> : null}
          {dark ? <Layer variant={dark} sizes={sizes} important={important} theme="dark" className="hidden dark:block" /> : null}
        </>
      )}
      </div>
    </div>
  );
}

// `theme` marks theme-only art (data-theme-art) so the theme store can load and
// decode it before a switch, instead of letting it pop in afterwards.
function Layer({ variant, sizes, important, theme, className = "" }) {
  const { src, crop, position = "center", opacity, brightness } = variant;
  const layerStyle =
    opacity == null && brightness == null
      ? undefined
      : {
          ...(opacity == null ? {} : { opacity }),
          ...(brightness == null ? {} : { filter: `brightness(${brightness})` }),
        };
  const priority = important ? { fetchPriority: "high" } : {};

  if (crop) {
    // Oversized, offset box (same aspect as the image) clipped by the frame.
    const [width, height, left, top] = crop;
    return (
      <div className={`absolute inset-0 ${className}`} style={layerStyle} data-theme-art={theme}>
        <div
          className="absolute"
          style={{ width: `${width}%`, height: `${height}%`, left: `${left}%`, top: `${top}%` }}
        >
          <Image src={src} alt="" fill sizes={sizes} {...priority} className="object-cover" draggable={false} />
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 ${className}`} style={layerStyle} data-theme-art={theme}>
      <Image
        src={src}
        alt=""
        fill
        sizes={sizes}
        {...priority}
        className="object-cover"
        style={{ objectPosition: position }}
        draggable={false}
      />
    </div>
  );
}
