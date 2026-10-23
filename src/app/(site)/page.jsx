import Hero from "@/components/home/Hero";
import Welcome from "@/components/home/Welcome";
import Categories from "@/components/home/Categories";
import Features from "@/components/home/Features";
import Articles from "@/components/home/Articles";
import GiftBand from "@/components/home/GiftBand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Welcome />
      <Categories />
      {/* Nancy (Oct 6): "Is this for me?" now comes before "What makes these pages feel a little different?" */}
      <Articles />
      <Features />
      <GiftBand />
    </>
  );
}
