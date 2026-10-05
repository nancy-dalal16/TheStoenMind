import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import SectionHeading from "./SectionHeading";
import ProductCarousel from "./ProductCarousel";
import { categories } from "@/lib/content";

/**
 * "Ways to wander": one tall, spacious box per category, with the swipeable product images
 * floating in the upper part and the copy and button resting at the foot of the same box
 * (layout after Nancy's postcard-shelf reference, Oct 4). The section itself has no background;
 * only the boxes carry a soft paper tone (--shelf). Prices: none yet (add `price` in content.js).
 */
export default function Categories() {
  return (
    <section className="relative pt-[60px] pb-24 md:pb-40">
      <Container className="relative flex flex-col items-center gap-[60px]">
        <SectionHeading
          title="Ways to wander"
          // description={
          //   <>
          //     Different objects for different moods — a book you follow start to
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
              className="hover-card flex flex-col rounded-ui bg-shelf"
            >
              <div data-part="img" className="px-3 pt-3 sm:px-4 sm:pt-4">
                <ProductCarousel
                  images={category.images}
                  label={`${category.title.charAt(0)}${category.title.slice(1).toLowerCase()}`}
                  sizes="(min-width: 1024px) 230px, (min-width: 640px) 40vw, 80vw"
                />
              </div>

              <div className="flex flex-1 flex-col gap-6 px-6 pt-4 pb-6 sm:px-7 sm:pb-7">
                <div className="flex flex-1 flex-col gap-2 text-fg">
                  <h3 className="text-title">{category.title}</h3>
                  <p className="text-body">{category.description}</p>
                  {category.price ? (
                    <p className="mt-1 font-sans text-base tracking-[0.04em] text-fg-muted">{category.price}</p>
                  ) : null}
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
