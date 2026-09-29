import Button from "@/components/ui/Button";

/**
 * "Sometimes, the kindest gift…" band.
 * - variant="home": sky band with a single white button (home page design).
 * - variant="soft": pale band with a primary + white button pair (About / Contact designs).
 */
export default function GiftBand({ variant = "home" }) {
  const soft = variant === "soft";

  return (
    <section className={soft ? "bg-band-soft text-fg" : "bg-band text-band-fg"}>
      <div className="page-gutter mx-auto flex max-w-[1440px] flex-col items-center gap-6 py-12 text-center md:py-[60px]">
        <div data-reveal="" className="flex flex-col items-center gap-6">
          <h2 data-part="blur" className="text-heading">
            Sometimes, the kindest gift is a little unhurried time.
          </h2>
          <div data-part="rise" style={{ "--j": 1 }} className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <Button href="/gift-cards" variant={soft ? "primary" : "inverse"}>
              Send a Stoen journal
            </Button>
            {soft ? (
              <Button href="/shop" variant="inverse">
                Explore the collection
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
