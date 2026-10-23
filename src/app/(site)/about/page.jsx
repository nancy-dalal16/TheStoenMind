import AboutHero from "@/components/about/AboutHero";
import AboutStory from "@/components/about/AboutStory";
// import Story from "@/components/about/Story";
import Timeline from "@/components/about/Timeline";
// import Pillars from "@/components/about/Pillars"; // hidden (Nancy, Oct 6)
import Artisans from "@/components/about/Artisans";
import GiftBand from "@/components/home/GiftBand";

export const metadata = {
  title: "About",
  description:
    "Quiet words, soulful pages - the story, craft and people behind the STOEN mind's journals, workbooks and diaries.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutStory />
      {/* Replaced by <AboutStory /> (the home page's "A Small Story" card). Kept for reference. */}
      {/* <Story /> */}
      <Timeline />
      {/* "Pillars of Our Craft" hidden (Nancy, Oct 6). Component and copy kept. */}
      {/* <Pillars /> */}
      <Artisans />
      <GiftBand variant="soft" />
    </>
  );
}
