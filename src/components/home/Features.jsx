import Artwork from "@/components/ui/Artwork";
import IconHalo from "@/components/ui/IconHalo";
import SectionHeading from "./SectionHeading";
import { features } from "@/lib/content";

export default function Features() {
  return (
    <section className="@container relative overflow-x-clip pt-[60px] pb-24 md:pb-40">
      {/* Background mist rising from the bottom edge */}
      <Artwork
        // Dark: the reworked mist is bright, so it's softened, faded in from the top, and
        // faded out on the right before it meets the bonsai.
        className="absolute bottom-0 left-0 aspect-[1440/503] w-[max(100cqw,720px)] dark:[mask-composite:intersect] dark:[mask-image:linear-gradient(to_bottom,transparent,black_42%),linear-gradient(to_right,black_52%,transparent_78%)]"
        light={{ src: "/images/light/mist-b.png", crop: [100, 190.85, 0, -90.85] }}
        dark={{ src: "/images/dark/night-mist-bank.png", crop: [100, 190.85, 0, -90.85], opacity: 0.4 }}
        data-reveal="fade"
        style={{ "--reveal-dur": "2s" }}
      />
      <div className="fade-to-bg absolute inset-x-0 bottom-0 h-[87px]" aria-hidden="true" />

      {/* Bonsai on the right */}
      <Artwork
        className="absolute right-[-11.875cqw] bottom-0 aspect-[453/583] w-[max(31.46cqw,190px)] max-lg:opacity-50"
        light={{ src: "/images/light/mist-a.png", crop: [191.6, 210.73, 0, -79.38] }}
        dark={{ src: "/images/dark/night-bonsai.png", crop: [130.81, 143.87, -0.37, -39.3], opacity: 0.43 }}
        sizes="(min-width: 768px) 60vw, 380px"
        data-reveal="right"
        style={{ "--reveal-dur": "2s", "--delay": "200ms" }}
      />

      {/* Cloud curl, top left */}
      <Artwork
        className="absolute top-[-70px] left-[-9.93cqw] aspect-[465/207] w-[max(32.29cqw,220px)]"
        light={{ src: "/images/light/mist-b.png", crop: [159.12, 238.21, -59.12, -31.51] }}
        dark={{ src: "/images/dark/night-cloud-wave.png", crop: [122.25, 183.01, -24.25, 1.87] }}
        sizes="(min-width: 768px) 52vw, 350px"
        data-reveal="left"
        style={{ "--reveal-dur": "1.8s" }}
      />

      <div className="page-gutter relative z-10 mx-auto flex max-w-[1440px] flex-col items-center gap-[60px]">
        <SectionHeading title="Every page has been considered" />

        <ul className="grid w-full max-w-[844px] grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
          {features.map((feature, index) => (
            <li
              key={`${feature.title}-${index}`}
              data-reveal=""
              style={{ "--i": index % 2, "--delay": `${Math.floor(index / 2) * 160}ms` }}
              className="flex flex-col items-center px-0 text-center sm:px-6"
            >
              <IconHalo icon={feature.icon} blob={feature.blob} />
              <div className="flex flex-col items-center gap-2 text-fg">
                <h3 className="text-title">{feature.title}</h3>
                <p className="text-body">{feature.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
