import "server-only";
import * as shopify from "./shopify";
import { sampleCollections, sampleProducts } from "./sample";

/**
 * The one door the pages use. Reads from Shopify when it's configured, otherwise from the
 * sample catalogue, and falls back to the sample if Shopify errors so the shop never blanks.
 */
export const shopMode = shopify.shopifyConfigured ? "shopify" : "preview";

async function fromShopify(fn, fallback) {
  if (!shopify.shopifyConfigured) return fallback();
  try {
    return await fn();
  } catch (error) {
    console.error(error);
    return fallback();
  }
}

function sortSample(list, sort) {
  const copy = [...list];
  if (sort === "price-asc") copy.sort((a, b) => a.price.amount - b.price.amount);
  if (sort === "price-desc") copy.sort((a, b) => b.price.amount - a.price.amount);
  if (sort === "newest") copy.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return copy;
}

export function getCollections() {
  return fromShopify(
    () => shopify.getCollections(),
    () => sampleCollections,
  );
}

export async function getCollection(handle) {
  const collections = await getCollections();
  return collections.find((c) => c.handle === handle) ?? null;
}

/** `null` when the collection doesn't exist. */
export function getProducts({ collection, sort } = {}) {
  return fromShopify(
    () => shopify.getProducts({ collection, sort }),
    () => {
      if (collection && !sampleCollections.some((c) => c.handle === collection)) return null;
      const list = collection ? sampleProducts.filter((p) => p.collection.handle === collection) : sampleProducts;
      return sortSample(list, sort);
    },
  );
}

export function getProduct(handle) {
  return fromShopify(
    () => shopify.getProduct(handle),
    () => sampleProducts.find((p) => p.handle === handle) ?? null,
  );
}

/** Up to four companions: same collection first, then the rest. */
export async function getRelated(product) {
  const pick = (list) => list.filter((p) => p && p.handle !== product.handle).slice(0, 4);
  return fromShopify(
    async () => {
      const recs = await shopify.getRecommendations(product.id);
      return pick(recs.length ? recs : await shopify.getProducts());
    },
    () => {
      const same = sampleProducts.filter((p) => p.collection.handle === product.collection?.handle);
      const others = sampleProducts.filter((p) => p.collection.handle !== product.collection?.handle);
      return pick([...same, ...others]);
    },
  );
}

export { productHref } from "./links";
