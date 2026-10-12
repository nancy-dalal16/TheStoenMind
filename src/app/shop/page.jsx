import ShopListing from "@/components/shop/ShopListing";
import { getCollections, getProducts } from "@/lib/shop/catalog";
import { shopHero, sortOptions } from "@/lib/shop/copy";

export const metadata = {
  title: "Shop",
  description: "Journals, workbooks, diaries and notebooks from the STOEN mind - small worlds to carry with you.",
};

const validSort = (value) => (sortOptions.some((o) => o.value === value) ? value : "featured");

export default async function ShopPage({ searchParams }) {
  const sort = validSort((await searchParams)?.sort);
  const [collections, products] = await Promise.all([getCollections(), getProducts({ sort })]);

  return <ShopListing hero={shopHero} collections={collections} active="all" products={products ?? []} sort={sort} />;
}
