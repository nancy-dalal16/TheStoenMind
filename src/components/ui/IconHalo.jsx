import Image from "next/image";
import Icon from "./Icon";

/**
 * Watercolour halo with a line icon — the Figma "image 16/17" + icon group used on
 * the home Features, About Pillars and Contact cards.
 * `blob` (optional) is the soft shape behind the glyph, positioned inside the 48px box.
 */
export default function IconHalo({ icon, blob, iconSize, className = "" }) {
  return (
    <div data-part="bloom" className={`relative h-[99px] w-[100px] shrink-0 ${className}`}>
      <Image
        src="/images/light/icon-bg.png"
        alt=""
        fill
        sizes="100px"
        className="object-cover opacity-(--icon-halo-opacity) dark:hidden"
      />
      <Image
        src="/images/dark/icon-bg.png"
        alt=""
        fill
        sizes="100px"
        // Without a blob behind the glyph (Contact cards) the halo is the icon's only
        // backdrop, so it's a little stronger in dark mode.
        className={`hidden object-cover dark:block ${blob ? "opacity-(--icon-halo-opacity)" : "opacity-40"}`}
      />

      <div className="absolute top-[26px] left-[26px] size-12">
        {blob ? (
          blob.shape ? (
            <Icon
              name={blob.shape}
              width={blob.width}
              height={blob.height}
              className="absolute text-icon-blob"
              style={{ left: blob.left, top: blob.top }}
            />
          ) : (
            <span
              className="absolute bg-icon-blob"
              style={{ left: blob.left, top: blob.top, width: blob.width, height: blob.height, borderRadius: blob.radius }}
            />
          )
        ) : null}
        {/* Dark-mode icon colour: deep-sea reads on the white blob, frost when there's no blob */}
        <span
          className={`absolute inset-0 flex items-center justify-center text-icon ${blob ? "" : "dark:text-eyebrow"}`}
        >
          <Icon name={icon} width={iconSize} height={iconSize} />
        </span>
      </div>
    </div>
  );
}
