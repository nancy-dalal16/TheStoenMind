import Image from "next/image";

/**
 * A story's illustration on the soft "stage" (the shop's --stage tint), swapping to its night
 * painting in dark mode when it has one. Only the active theme's copy is displayed, and as
 * both are lazy the other never downloads (same approach as <Artwork />, but with alt text).
 *
 * `image`: { alt, fit: "cover" | "contain", light: { src, width, height, position? }, dark? }
 * `className` sizes the frame (usually an aspect-ratio utility).
 */
export default function StoryImage({ image, sizes = "100vw", important = false, className = "", style }) {
  if (!image?.light) return <div aria-hidden="true" className={`ex-frame ${className}`} style={style} />;

  const contain = image.fit === "contain";
  const layers = image.dark
    ? [
        { variant: image.light, theme: "light", className: "dark:hidden" },
        { variant: image.dark, theme: "dark", className: "hidden dark:block" },
      ]
    : [{ variant: image.light }];

  return (
    <div className={`ex-frame relative overflow-hidden ${className}`} style={style}>
      {/* Reveal settles this wrapper (scale); hover zooms the one inside (transform) */}
      <div data-part="img" className="absolute inset-0">
        <div className="ex-zoom absolute inset-0">
          {layers.map(({ variant, theme, className: show = "" }) => (
            <div
              key={variant.src}
              data-theme-art={theme}
              className={`absolute ${contain ? "ex-contain" : "inset-0"} ${show}`}
            >
              <Image
                src={variant.src}
                alt={image.alt ?? ""}
                fill
                sizes={sizes}
                {...(important ? { fetchPriority: "high" } : {})}
                className={contain ? `object-contain ${/\.jpe?g$/i.test(variant.src) ? "ex-float" : ""}` : "object-cover"}
                style={contain ? undefined : { objectPosition: variant.position ?? "center" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
