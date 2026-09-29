import Image from "next/image";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Glow from "@/components/ui/Glow";
import SectionHeading from "./SectionHeading";
import { categories } from "@/lib/content";

export default function Categories() {
  return (
    <section className="relative pt-[60px] pb-24 md:pb-40">
      <Glow src="/images/dark/glow-categories.svg" className="top-[-1019px] right-[-1248px] size-[3075px]" />

      <Container className="relative flex flex-col items-center gap-[60px]">
        <SectionHeading
          title="Four ways to wander"
          description={
            <>
              Different objects for different moods — a book you follow start to finish,{" "}
              <br className="hidden lg:block" />a companion for daily pages, or a diary that simply keeps time with you.
            </>
          }
        />

        <ul className="grid w-full grid-cols-1 gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <li key={category.title} data-reveal="" style={{ "--i": index }} className="group hover-group flex flex-col gap-6">
              <div className="hover-frame relative aspect-square overflow-hidden rounded-2xl border border-media-border bg-media-bg">
                {/* Settles from a gentle zoom on reveal; the photo itself eases in on hover */}
                <div data-part="img" className="absolute inset-0">
                  <Image
                    src={category.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 284px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-4">
                <div className="flex flex-1 flex-col gap-2 text-fg">
                  <h3 className="text-title">{category.title}</h3>
                  <p className="text-body">{category.description}</p>
                </div>
                <Button href={category.href} fullWidth>
                  Explore {category.title}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
