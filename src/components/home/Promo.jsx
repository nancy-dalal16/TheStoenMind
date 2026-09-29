import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Glow from "@/components/ui/Glow";

/** Seasonal campaign banner — swap `image`/`href`/`alt` per campaign. */
const campaign = {
  href: "/shop",
  image: "/images/shared/promo-banner.png",
  alt: "Happy Ganesh Chaturthi — up to 25% off on all books. Read, learn, grow. Shop now.",
};

export default function Promo() {
  return (
    <section className="relative py-10 md:py-20">
      <Glow src="/images/dark/glow-features.svg" className="top-[-121px] right-[-806px] size-[1660px]" />

      <Container>
        <Link
          href={campaign.href}
          data-reveal="zoom"
          style={{ "--reveal-dur": "1.4s" }}
          className="group relative block aspect-[1774/887] overflow-hidden rounded-2xl"
        >
          <Image
            src={campaign.image}
            alt={campaign.alt}
            fill
            quality={90}
            sizes="(min-width: 1440px) 1280px, 92vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          />
        </Link>
      </Container>
    </section>
  );
}
