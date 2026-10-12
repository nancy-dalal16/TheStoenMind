import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "./SectionHeading";
import ProductCarousel from "./ProductCarousel";
import { categories } from "@/lib/content";

/**
 * "Ways to wander": one tall, spacious box per category, with the swipeable product images
 * floating in the upper part and the copy and button resting at the foot of the same box
 * (layout after Nancy's postcard-shelf reference, Oct 4). The section itself has no background.
 * Light: each box is just a soft grey hairline (Oct 5); dark: a tinted box (.shelf-card in globals.css).
 * Prices: none yet (add `price` in content.js).
 * Oct 12 (Nancy): book images ~10% larger (ProductCarousel inset), the description is no longer
 * shown (still in content.js), smaller box, and every card's button reads "Buy Now".
 */
export default function Categories() {
  return (
    <section className="relative pt-[60px] pb-24 md:pb-40">
      <Container className="relative flex flex-col items-center gap-[60px]">
        <SectionHeading
          title="Ways to wander"
          // description={
          //   <>
          //     Different objects for different moods - a book you follow start to
          //     finish, <br className="hidden lg:block" />a companion for daily
          //     pages, or a diary that simply keeps time with you.
          //   </>
          // }
        />

        <ul className="grid w-full grid-cols-1 gap-x-[30px] gap-y-[30px] sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <li
              key={category.title}
              data-reveal=""
              style={{ "--i": index }}
              className="hover-card shelf-card flex flex-col rounded-ui"
            >
              <div data-part="img" className="px-3 pt-3 sm:px-4 sm:pt-4">
                <ProductCarousel
                  images={category.images}
                  label={category.label ?? `${category.title.charAt(0)}${category.title.slice(1).toLowerCase()}`}
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 44vw, 88vw"
                />
              </div>

              {/* Oct 12 (Nancy): description removed, compact foot, one clear "Buy Now" */}
              <div className="flex flex-1 flex-col gap-4 px-5 pt-1 pb-5 sm:px-6 sm:pb-6">
                <div className="flex flex-1 flex-col gap-1 text-fg">
                  <h3 className="text-title">{category.title}</h3>
                  {category.price ? (
                    <p className="font-sans text-base tracking-[0.04em] text-fg-muted">
                      {category.price}
                    </p>
                  ) : null}
                </div>
                <Button
                  href={category.href}
                  icon="handbag"
                  fullWidth
                  aria-label={`Buy now: ${category.title}`}
                >
                  Buy Now
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
