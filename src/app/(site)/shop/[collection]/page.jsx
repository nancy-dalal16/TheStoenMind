import { notFound, redirect } from "next/navigation";
import ShopListing from "@/components/shop/ShopListing";
import { getCollection, getCollections, getProducts } from "@/lib/shop/catalog";
import { shopHero, sortOptions } from "@/lib/shop/copy";

const validSort = (value) => (sortOptions.some((o) => o.value === value) ? value : "featured");

export async function generateMetadata({ params }) {
  const collection = await getCollection((await params).collection);
  if (!collection) return {};
  return { title: `${collection.title} · Shop`, description: collection.description };
}

export default async function CollectionPage({ params, searchParams }) {
  const { collection: handle } = await params;
  const sort = validSort((await searchParams)?.sort);
  if (handle === "all") redirect(sort === "featured" ? "/shop" : `/shop?sort=${sort}`);

  const [collections, collection, products] = await Promise.all([
    getCollections(),
    getCollection(handle),
    getProducts({ collection: handle, sort }),
  ]);
  if (!collection || !products) notFound();

  return (
    <ShopListing
      hero={{
        eyebrow: collection.label ? `${shopHero.eyebrow} · ${collection.label}` : shopHero.eyebrow,
        title: collection.title,
        intro: collection.description,
      }}
      collections={collections}
      active={collection.handle}
      products={products}
      sort={sort}
    />
  );
}
