import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import GiftBand from "@/components/home/GiftBand";
import ShopHero from "./ShopHero";
import CollectionBar from "./CollectionBar";
import ProductCard from "./ProductCard";

/** Shared body of /shop and /shop/[collection]: intro, collection bar, product grid, gift band. */
export default function ShopListing({ hero, collections, active, products, sort }) {
  return (
    <>
      <ShopHero {...hero} />
      <CollectionBar collections={collections} active={active} count={products.length} sort={sort} />

      <section aria-label="Products" className="pt-10 pb-24 md:pt-14 md:pb-40">
        <Container>
          {products.length ? (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 md:gap-x-[30px] md:gap-y-16 xl:grid-cols-4">
              {products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col items-center gap-6 py-16 text-center">
              <p className="font-serif text-card text-fg">Nothing here just yet</p>
              <p className="max-w-[36ch] text-body">
                New pieces are on their way. In the meantime, the rest of the shop is open.
              </p>
              <Button href="/shop">See everything</Button>
            </div>
          )}
        </Container>
      </section>

      <GiftBand />
    </>
  );
}
