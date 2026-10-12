/**
 * Shop copy - one place to edit the words around the products.
 * Product titles, prices and descriptions come from Shopify (or the sample catalogue).
 */
export const shopHero = {
  eyebrow: "The shop",
  title: "Small worlds to carry with you",
  intro:
    "Journals, workbooks, diaries and notebooks - each one made to be opened slowly, wandered through, and returned to.",
};

/** Sort options shown in the collection bar. `value` is the ?sort= search param. */
export const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

/**
 * Shared notes under every product's own description (product page accordion).
 * Placeholder wording written by Claude (Oct 7) - replace with the studio's real policies.
 */
export const productNotes = [
  {
    title: "Shipping",
    body: "Every order is wrapped by hand and sent from our studio. Delivery times and costs for your address are shown at checkout.",
  },
  {
    title: "Gifting",
    body: "Sending it to someone else? Add a note at checkout and we will tuck it inside, with no prices on the packing slip.",
  },
  {
    title: "Returns",
    body: "If something isn't quite right, we will make it right.",
    link: { label: "Returns and refund policy", href: "/policies/returns" },
  },
];

export const cartCopy = {
  title: "Your bag",
  emptyTitle: "Nothing here yet but sky",
  emptyBody: "Wander through the shop - something may want to come home with you.",
  note: "Shipping and taxes are calculated at checkout.",
  checkout: "Checkout",
  // Shown instead of checkout until the Shopify env vars are set (see .env.example)
  previewNote: "Preview mode - checkout opens once the Shopify store is connected.",
};
