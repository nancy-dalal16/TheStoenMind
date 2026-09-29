import AboutHero from "@/components/about/AboutHero";
import Story from "@/components/about/Story";
import Timeline from "@/components/about/Timeline";
import Pillars from "@/components/about/Pillars";
import Artisans from "@/components/about/Artisans";
import GiftBand from "@/components/home/GiftBand";

export const metadata = {
  title: "About",
  description:
    "Quiet words, soulful pages — the story, craft and people behind the STOEN mind's journals, workbooks and diaries.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <Story />
      <Timeline />
      <Pillars />
      <Artisans />
      <GiftBand variant="soft" />
    </>
  );
}
