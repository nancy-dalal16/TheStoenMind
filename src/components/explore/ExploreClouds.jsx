import Artwork from "@/components/ui/Artwork";

/**
 * The two watercolour clouds that drift in from the edges behind the Explore nameplate - also
 * behind a story's headline. Place inside a `@container relative overflow-x-clip` section and
 * give the content above them `relative z-10`.
 */
export default function ExploreClouds() {
  return (
    <>
      <Artwork
        className="pointer-events-none absolute top-[34px] left-[-22cqw] aspect-[701/212] w-[max(36cqw,260px)] opacity-80 motion-safe:animate-cloud-in motion-safe:[animation-delay:500ms] max-md:top-[4px] max-md:left-[-50cqw]"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="36vw"
      />
      <Artwork
        flip
        className="pointer-events-none absolute top-[120px] right-[-20cqw] aspect-[701/212] w-[max(32cqw,240px)] opacity-70 motion-safe:animate-cloud-in motion-safe:[animation-delay:750ms] max-md:hidden"
        light={{ src: "/images/about/cloud-drift.png" }}
        dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15 }}
        sizes="32vw"
      />
    </>
  );
}
