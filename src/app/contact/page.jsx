import ContactHero from "@/components/contact/ContactHero";
import ContactForm from "@/components/contact/ContactForm";
import StudioInfo from "@/components/contact/StudioInfo";
import Faq from "@/components/contact/Faq";
import Container from "@/components/ui/Container";
import GiftBand from "@/components/home/GiftBand";

export const metadata = {
  title: "Contact",
  description:
    "Order questions, custom monograms, studio visits or simply a thought to share — connect with the STOEN mind.",
};

export default function ContactPage() {
  return (
    <>
      <ContactHero />
      <section className="py-24 md:py-40">
        <Container className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[625fr_575fr] lg:gap-20">
          <ContactForm />
          <StudioInfo />
        </Container>
      </section>
      <Faq />
      <GiftBand variant="soft" />
    </>
  );
}
