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
      <Features />
      <Articles />
      <GiftBand />
    </>
  );
}
