import Image from "next/image";

/**
 * Dark-mode-only ambient glow (blurred ellipse exported from Figma).
 * Sits behind all content (`-z-10` inside the isolated <main>).
 * `className` positions the full SVG canvas (circle + blur margin).
 */
export default function Glow({ src, className = "" }) {
  return (
    <div aria-hidden="true" data-theme-art="dark" className={`pointer-events-none absolute -z-10 hidden dark:block ${className}`}>
      <Image src={src} alt="" fill unoptimized className="object-contain" />
    </div>
  );
}
