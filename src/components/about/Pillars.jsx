import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import IconHalo from "@/components/ui/IconHalo";
import SectionHeading from "@/components/home/SectionHeading";
import { pillars } from "@/lib/about";

export default function Pillars() {
  const { title, description, items } = pillars;

  return (
    <section className="@container relative overflow-x-clip pt-24 md:pt-40">
      {/* Cloud curl, top left */}
      <Artwork
        className="absolute top-0 left-[-23.33cqw] aspect-[671/299] w-[max(46.6cqw,300px)]"
        light={{ src: "/images/light/mist-b.png", crop: [159.12, 238.21, -59.12, -31.51] }}
        dark={{ src: "/images/dark/night-cloud-wave.png", crop: [122.25, 183.01, -24.25, 1.87] }}
        sizes="(min-width: 640px) 75vw, 480px"
        data-reveal="left"
        style={{ "--reveal-dur": "1.8s" }}
      />

      <Container className="relative flex flex-col items-center gap-12">
        <SectionHeading title={title} description={description} />

        <ul className="grid w-full grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li
              key={item.title}
              data-reveal=""
              style={{ "--i": index }}
              className="flex flex-col items-center gap-5 rounded-2xl p-6 text-center text-fg"
            >
              <IconHalo icon={item.icon} blob={item.blob} />
              <div className="flex flex-col items-center gap-2">
                <h3 className="text-title">{item.title}</h3>
                <p className="text-body">{item.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>

      {/* Sailboat landscape rising from the bottom */}
      <div className="relative mt-7 aspect-[1440/373] w-full min-w-[640px]">
        <Artwork
          className="absolute inset-0"
          light={{ src: "/images/about/landscape-sailboat.png" }}
          dark={{ src: "/images/about/landscape-sailboat-night.png" }}
          sizes="max(100vw, 640px)"
          data-reveal="fade"
          style={{ "--reveal-dur": "2.2s" }}
        />
        <div className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]" aria-hidden="true" />
      </div>
    </section>
  );
}
