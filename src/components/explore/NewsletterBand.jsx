import { newsletter } from "@/lib/explore/copy";
import NewsletterForm from "./NewsletterForm";

/** Full-width sign-up band (article and topic pages), on the same pale band as GiftBand "soft". */
export default function NewsletterBand() {
  return (
    <section aria-labelledby="letter-band" className="bg-band-soft text-fg">
      <div className="page-gutter mx-auto flex max-w-[1440px] flex-col items-center py-14 text-center md:py-[72px]">
        <div data-reveal="" className="flex max-w-[40rem] flex-col items-center gap-4">
          <p data-part="rise" className="ex-rubric">
            {newsletter.eyebrow}
          </p>
          <h2 id="letter-band" data-part="blur" className="text-heading">
            {newsletter.title}
          </h2>
          <p data-part="rise" style={{ "--j": 1 }} className="text-body-lg leading-[1.45]">
            {newsletter.text}
          </p>
          <div data-part="rise" style={{ "--j": 2 }} className="mt-4 w-full max-w-[30rem]">
            <NewsletterForm id="letter-band" />
          </div>
        </div>
      </div>
    </section>
  );
}
