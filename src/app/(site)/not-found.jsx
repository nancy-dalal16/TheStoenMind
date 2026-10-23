import Button from "@/components/ui/Button";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <section className="page-gutter mx-auto flex max-w-[1440px] flex-col items-center gap-5 py-28 text-center md:py-40">
      <p className="font-serif text-xl tracking-[0.06em] text-eyebrow">404</p>
      <h1 className="text-page text-fg">This page has wandered off</h1>
      <p className="max-w-[34rem] text-lead">It may have moved, or it was never quite here. The rest of the site is just where you left it.</p>
      <div className="mt-3 flex flex-wrap justify-center gap-4">
        <Button href="/">Back to home</Button>
        <Button href="/explore" variant="inverse" className="border border-field-line">
          Explore stories
        </Button>
      </div>
    </section>
  );
}
