import "server-only";

/**
 * Shopify Storefront API (GraphQL) - server side only, so the access token never reaches the browser.
 *
 * Env (.env.local, see .env.example):
 *   SHOPIFY_STORE_DOMAIN              your-store.myshopify.com
 *   SHOPIFY_STOREFRONT_ACCESS_TOKEN   Storefront API token (Headless channel or a custom app)
 *   SHOPIFY_STOREFRONT_TOKEN_TYPE     "public" (default) or "private"
 *   SHOPIFY_API_VERSION               default 2026-10
 *
 * Everything returned from here is normalised to the shape of lib/shop/sample.js.
 */

const domain = process.env.SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, "").replace(/\/$/, "");
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const tokenType = process.env.SHOPIFY_STOREFRONT_TOKEN_TYPE === "private" ? "private" : "public";
const version = process.env.SHOPIFY_API_VERSION || "2026-10";

export const shopifyConfigured = Boolean(domain && token);

/** Product data is cached for a few minutes; cart calls are never cached. */
const PRODUCT_REVALIDATE = 300;

export async function shopifyFetch(query, variables = {}, { cache = true } = {}) {
  if (!shopifyConfigured) throw new Error("Shopify is not configured");

  const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(tokenType === "private"
        ? { "Shopify-Storefront-Private-Token": token }
        : { "X-Shopify-Storefront-Access-Token": token }),
    },
    body: JSON.stringify({ query, variables }),
    ...(cache ? { next: { revalidate: PRODUCT_REVALIDATE, tags: ["shopify"] } } : { cache: "no-store" }),
  });

  const json = await response.json().catch(() => ({}));
  if (!response.ok || json.errors?.length) {
    const message = json.errors?.map((e) => e.message).join("; ") || response.statusText;
    throw new Error(`Shopify Storefront API: ${message}`);
  }
  return json.data;
}

/* ── Fragments ─────────────────────────────────────────────── */

const IMAGE = /* GraphQL */ `
  fragment Img on Image {
    url
    altText
    width
    height
  }
`;

const CARD = /* GraphQL */ `
  fragment Card on Product {
    id
    handle
    title
    productType
    createdAt
    availableForSale
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    compareAtPriceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }
    collections(first: 1) {
      nodes {
        handle
        title
      }
    }
    images(first: 2) {
      nodes {
        ...Img
      }
    }
  }
`;

const FULL = /* GraphQL */ `
  fragment Full on Product {
    ...Card
    description
    descriptionHtml
    gallery: images(first: 12) {
      nodes {
        ...Img
      }
    }
    options {
      name
      optionValues {
        name
        swatch {
          color
        }
      }
    }
    variants(first: 100) {
      nodes {
        id
        title
        availableForSale
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        selectedOptions {
          name
          value
        }
        image {
          ...Img
        }
      }
    }
  }
`;

/* ── Normalisers ───────────────────────────────────────────── */

const image = (node, fallbackAlt = "") =>
  node
    ? { src: node.url, alt: node.altText || fallbackAlt, width: node.width, height: node.height, fit: "contain" }
    : null;

function normaliseProduct(node) {
  if (!node) return null;
  const images = ((node.gallery ?? node.images)?.nodes ?? []).map((n) => image(n, node.title));
  const compare = node.compareAtPriceRange?.minVariantPrice;
  const price = node.priceRange.minVariantPrice;
  // Shopify's default single option is "Title" / "Default Title" - hide it.
  const options = (node.options ?? [])
    .filter((o) => !(o.name === "Title" && o.optionValues.length === 1))
    .map((o) => ({
      name: o.name,
      values: o.optionValues.map((v) => ({ name: v.name, swatch: v.swatch?.color ?? null })),
    }));

  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    subtitle: node.productType || node.collections?.nodes?.[0]?.title || "",
    collection: node.collections?.nodes?.[0] ?? null,
    description: node.description ?? "",
    descriptionHtml: node.descriptionHtml ?? "",
    availableForSale: node.availableForSale,
    price,
    compareAtPrice: compare && Number(compare.amount) > Number(price.amount) ? compare : null,
    images,
    options,
    variants: (node.variants?.nodes ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      availableForSale: v.availableForSale,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      selectedOptions: v.selectedOptions.filter((o) => !(o.name === "Title" && o.value === "Default Title")),
      image: image(v.image, node.title),
    })),
    createdAt: node.createdAt,
  };
}

export function normaliseCart(cart) {
  if (!cart) return null;
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    subtotal: cart.cost.subtotalAmount,
    lines: cart.lines.nodes.map((line) => ({
      id: line.id,
      quantity: line.quantity,
      total: line.cost.totalAmount,
      variantId: line.merchandise.id,
      variantTitle: line.merchandise.title === "Default Title" ? "" : line.merchandise.title,
      price: line.merchandise.price,
      image: image(line.merchandise.image ?? line.merchandise.product.featuredImage, line.merchandise.product.title),
      product: {
        handle: line.merchandise.product.handle,
        title: line.merchandise.product.title,
        collection: line.merchandise.product.collections.nodes[0]?.handle ?? "all",
      },
    })),
  };
}

/* ── Catalogue ─────────────────────────────────────────────── */

// ?sort= → Shopify sort keys (collections and the product list use different enums)
const SORTS = {
  featured: { collection: "COLLECTION_DEFAULT", products: "BEST_SELLING", reverse: false },
  newest: { collection: "CREATED", products: "CREATED_AT", reverse: true },
  "price-asc": { collection: "PRICE", products: "PRICE", reverse: false },
  "price-desc": { collection: "PRICE", products: "PRICE", reverse: true },
};

export async function getCollections() {
  const data = await shopifyFetch(/* GraphQL */ `
    query Collections {
      collections(first: 20, sortKey: TITLE) {
        nodes {
          handle
          title
          description
        }
      }
    }
  `);
  return data.collections.nodes.filter((c) => c.handle !== "frontpage" && c.handle !== "all");
}

export async function getProducts({ collection, sort = "featured" } = {}) {
  const s = SORTS[sort] ?? SORTS.featured;
  if (collection) {
    const data = await shopifyFetch(
      /* GraphQL */ `
        query CollectionProducts($handle: String!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean) {
          collection(handle: $handle) {
            handle
            title
            description
            products(first: 100, sortKey: $sortKey, reverse: $reverse) {
              nodes {
                ...Card
              }
            }
          }
        }
        ${CARD}
        ${IMAGE}
      `,
      { handle: collection, sortKey: s.collection, reverse: s.reverse },
    );
    if (!data.collection) return null;
    return data.collection.products.nodes.map(normaliseProduct);
  }

  const data = await shopifyFetch(
    /* GraphQL */ `
      query AllProducts($sortKey: ProductSortKeys, $reverse: Boolean) {
        products(first: 100, sortKey: $sortKey, reverse: $reverse) {
          nodes {
            ...Card
          }
        }
      }
      ${CARD}
      ${IMAGE}
    `,
    { sortKey: s.products, reverse: s.reverse },
  );
  return data.products.nodes.map(normaliseProduct);
}

export async function getProduct(handle) {
  const data = await shopifyFetch(
    /* GraphQL */ `
      query Product($handle: String!) {
        product(handle: $handle) {
          ...Full
        }
      }
      ${FULL}
      ${CARD}
      ${IMAGE}
    `,
    { handle },
  );
  return normaliseProduct(data.product);
}

export async function getRecommendations(productId) {
  const data = await shopifyFetch(
    /* GraphQL */ `
      query Recs($productId: ID!) {
        productRecommendations(productId: $productId) {
          ...Card
        }
      }
      ${CARD}
      ${IMAGE}
    `,
    { productId },
  );
  return (data.productRecommendations ?? []).map(normaliseProduct);
}

/* ── Cart ──────────────────────────────────────────────────── */

const CART = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    checkoutUrl
    totalQuantity
    cost {
      subtotalAmount {
        amount
        currencyCode
      }
    }
    lines(first: 100) {
      nodes {
        id
        quantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        merchandise {
          ... on ProductVariant {
            id
            title
            price {
              amount
              currencyCode
            }
            image {
              ...Img
            }
            product {
              handle
              title
              featuredImage {
                ...Img
              }
              collections(first: 1) {
                nodes {
                  handle
                }
              }
            }
          }
        }
      }
    }
  }
  ${IMAGE}
`;

async function cartMutation(query, variables, field) {
  const data = await shopifyFetch(`${query}\n${CART}`, variables, { cache: false });
  const result = data[field];
  if (result.userErrors?.length) throw new Error(result.userErrors.map((e) => e.message).join("; "));
  return normaliseCart(result.cart);
}

export async function getCart(cartId) {
  const data = await shopifyFetch(
    /* GraphQL */ `
      query Cart($cartId: ID!) {
        cart(id: $cartId) {
          ...CartFields
        }
      }
      ${CART}
    `,
    { cartId },
    { cache: false },
  );
  return normaliseCart(data.cart);
}

export const createCart = (lines) =>
  cartMutation(
    /* GraphQL */ `
      mutation Create($lines: [CartLineInput!]) {
        cartCreate(input: { lines: $lines }) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    { lines },
    "cartCreate",
  );

export const addLines = (cartId, lines) =>
  cartMutation(
    /* GraphQL */ `
      mutation Add($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, lines },
    "cartLinesAdd",
  );

export const updateLines = (cartId, lines) =>
  cartMutation(
    /* GraphQL */ `
      mutation Update($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
        cartLinesUpdate(cartId: $cartId, lines: $lines) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, lines },
    "cartLinesUpdate",
  );

export const removeLines = (cartId, lineIds) =>
  cartMutation(
    /* GraphQL */ `
      mutation Remove($cartId: ID!, $lineIds: [ID!]!) {
        cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
          cart {
            ...CartFields
          }
          userErrors {
            message
          }
        }
      }
    `,
    { cartId, lineIds },
    "cartLinesRemove",
  );
