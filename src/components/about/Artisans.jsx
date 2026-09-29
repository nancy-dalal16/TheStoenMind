import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/home/SectionHeading";
import { artisans } from "@/lib/about";

export default function Artisans() {
  const { title, description, people } = artisans;

  return (
    <section className="py-24 md:py-40">
      <Container className="flex flex-col items-center gap-[60px]">
        <SectionHeading title={title} description={description} />

        <ul className="grid w-full grid-cols-1 gap-[30px] md:grid-cols-3">
          {people.map((person, index) => (
            <li
              key={person.name}
              data-reveal=""
              style={{ "--i": index }}
              className="flex flex-col items-center gap-5 rounded-2xl bg-linear-to-b from-surface to-surface-soft p-6 text-center"
            >
              <Artwork
                data-part="img"
                className="relative size-40 rounded-full"
                image={person.image}
                sizes="320px"
              />
              <div className="flex flex-col items-center gap-3">
                <div className="flex flex-col items-center gap-1">
                  <h3 className="font-serif text-2xl text-fg">{person.name}</h3>
                  <p className="font-sans text-xs font-medium tracking-[0.08em] text-eyebrow uppercase">{person.role}</p>
                </div>
                <blockquote className="text-body text-fg">&ldquo;{person.quote}&rdquo;</blockquote>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
