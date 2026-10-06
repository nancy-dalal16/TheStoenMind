import Image from "next/image";
import Link from "next/link";
import Artwork from "./Artwork";

/**
 * Brand mark.
 *
 * variant="full" (default): cloud + "the STOEN mind" lettering. The Figma export has
 *   generous padding, cropped here to the 140×62 frame. Used in the footer.
 * variant="cloud": the cloud on its own (header). logo-cloud.svg is traced from the
 *   logo PNG in the brand colour Misty Blue #9BBABF, so it stays crisp at any size and
 *   matches the full logo exactly.
 */
export default function Logo({ variant = "full", className = "" }) {
  if (variant === "cloud") {
    return (
      <Link href="/" aria-label="the STOEN mind - home" className={`logo-float block shrink-0 ${className}`}>
        <Image
          src="/images/shared/logo-cloud.svg"
          alt=""
          width={1716}
          height={976}
          unoptimized
          loading="eager"
          draggable={false}
          className="h-11 w-auto md:h-[52px]"
        />
      </Link>
    );
  }

  return (
    <Link href="/" aria-label="the STOEN mind - home" className={`relative block h-[62px] w-[140px] shrink-0 ${className}`}>
      <Artwork
        className="absolute inset-0"
        image={{ src: "/images/shared/logo.png", crop: [192.6, 316.11, -47.51, -82.52] }}
        sizes="270px"
      />
    </Link>
  );
}
