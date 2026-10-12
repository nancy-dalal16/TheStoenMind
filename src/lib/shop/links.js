/** Canonical product URL: /shop/{collection}/{handle} ("all" when it isn't in a collection). */
export const productHref = (product) => `/shop/${product.collection?.handle ?? "all"}/${product.handle}`;
