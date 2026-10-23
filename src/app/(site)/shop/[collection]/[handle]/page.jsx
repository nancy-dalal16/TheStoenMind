import Link from "next/link";
import { notFound } from "next/navigation";
import Artwork from "@/components/ui/Artwork";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/home/SectionHeading";
import ProductCard from "@/components/shop/ProductCard";
import ProductView from "@/components/shop/ProductView";
import { getProduct, getRelated, productHref } from "@/lib/shop/catalog";

export async function generateMetadata({ params }) {
  const product = await getProduct((await params).handle);
  if (!product) return {};
  const image = product.images[0];
  return {
    title: product.title,
    description: product.description.slice(0, 160),
    alternates: { canonical: productHref(product) },
    openGraph: image
      ? { images: [{ url: image.src, width: image.width, height: image.height, alt: image.alt }] }
      : undefined,
  };
}

export default async function ProductPage({ params }) {
  const { handle } = await params;
  const product = await getProduct(handle);
  if (!product) notFound();
  const related = await getRelated(product);

  return (
    <>
      <section className="@container relative overflow-x-clip pt-6 pb-24 md:pt-10 md:pb-32">
        {/* A single cloud drifting past the top right, behind the details */}
        <Artwork
          flip
          className="absolute top-[-6px] right-[-9cqw] aspect-[701/212] w-[max(26cqw,240px)] opacity-70 motion-safe:animate-cloud-in motion-safe:[animation-delay:700ms] max-lg:hidden"
          light={{ src: "/images/about/cloud-drift.png" }}
          dark={{ src: "/images/about/cloud-drift-night.png", brightness: 1.15, opacity: 0.8 }}
          sizes="34vw"
        />

        <Container className="relative">
          <nav aria-label="Breadcrumb" className="mb-8 md:mb-10">
            <ol className="flex flex-wrap items-center gap-2 font-sans text-xs tracking-[0.08em] text-fg-muted">
              <li>
                <Link href="/shop" className="link-draw hover:text-fg">
                  Shop
                </Link>
              </li>
              {product.collection ? (
                <>
                  <li aria-hidden="true">/</li>
                  <li>
                    <Link href={`/shop/${product.collection.handle}`} className="link-draw hover:text-fg">
                      {product.collection.title}
                    </Link>
                  </li>
                </>
              ) : null}
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-fg">
                {product.title}
              </li>
            </ol>
          </nav>

          <ProductView product={product} />
        </Container>
      </section>

      {related.length ? (
        <section className="pb-24 md:pb-40">
          <Container className="flex flex-col gap-12 md:gap-[60px]">
            <SectionHeading title="You may also wander with" />
            <ul className="grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:gap-x-[30px] lg:grid-cols-4">
              {related.map((item, index) => (
                <ProductCard key={item.id} product={item} index={index} sizes="(min-width: 1024px) 290px, 45vw" />
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
