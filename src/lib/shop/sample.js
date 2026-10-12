/**
 * Sample catalogue - what the shop shows until the Shopify Storefront API is connected
 * (SHOPIFY_STORE_DOMAIN + SHOPIFY_STOREFRONT_ACCESS_TOKEN in .env.local).
 *
 * Same shape the Shopify normaliser returns (lib/shop/shopify.js), so every page and
 * component works identically in both modes. Images are the web copies of Nancy's
 * product uploads (public/images/products/web). Prices are placeholders.
 *
 * Image `fit`: "contain" floats a cover on the stage with a soft shadow,
 * "cover" fills the stage edge to edge (lifestyle photos).
 */

const INR = (amount) => ({ amount: String(amount), currencyCode: "INR" });

const img = (file, alt, width, height, fit = "contain") => ({
  src: `/images/products/web/${file}`,
  alt,
  width,
  height,
  fit,
});

export const sampleCollections = [
  {
    handle: "journals",
    title: "Journals",
    label: "Night",
    description:
      "Little story worlds to step into, slow down and stay awhile, with space to reflect and discover what your mind has been quietly waiting to say.",
  },
  {
    handle: "workbooks",
    title: "Workbooks",
    label: "Day",
    description:
      "Story worlds with a character beside you from beginning to end - things to notice, ideas to sit with, and space for your own reflections.",
  },
  {
    handle: "diaries",
    title: "Diaries",
    description:
      "Mostly blank pages, with one small surprise tucked inside: a whimsical, wise or simply wandering character with a tiny story to tell.",
  },
  {
    handle: "notebooks",
    title: "Notebooks",
    description:
      "Little blank spaces made to come along with you: light, easy to carry, and ready for notes, lists, passing thoughts and sudden ideas.",
  },
];

const byHandle = Object.fromEntries(sampleCollections.map((c) => [c.handle, { handle: c.handle, title: c.title }]));

/** One variant per product unless it has options (Notebook colours). */
function single(id, price, image) {
  return [
    {
      id: `${id}-default`,
      title: "Default Title",
      availableForSale: true,
      price,
      compareAtPrice: null,
      selectedOptions: [],
      image,
    },
  ];
}

function product({
  id,
  handle,
  title,
  subtitle,
  collection,
  price,
  description,
  images,
  variants,
  options = [],
  createdAt,
}) {
  const paragraphs = description.map((p) => `<p>${p}</p>`).join("");
  return {
    id,
    handle,
    title,
    subtitle,
    collection: byHandle[collection],
    description: description.join(" "),
    descriptionHtml: paragraphs,
    availableForSale: true,
    price,
    compareAtPrice: null,
    images,
    options,
    variants: variants ?? single(id, price, images[0]),
    createdAt,
  };
}

const journal = img(
  "journal-letters-from-the-universe-night.jpg",
  "Letters From the Universe journal cover: a figure reaching for a cloud in a deep navy night sky",
  1000,
  1532,
);
const workbook = img(
  "workbook-life-i-am-creating-day.jpg",
  "The Life I Am Creating workbook cover: a sunlit watercolour path past trees and a duck pond",
  1000,
  1324,
);
const olive = img("notebook-thoughts-olive.jpg", "Thoughts notebook, olive cover with a stone bridge sketch", 400, 600);
const slate = img("notebook-thoughts-slate.jpg", "Thoughts notebook, slate cover with an elephant sketch", 400, 600);
const umber = img(
  "notebook-thoughts-umber.jpg",
  "Thoughts notebook, deep umber cover with a greyhound sketch",
  400,
  600,
);

export const sampleProducts = [
  product({
    id: "sample-letters-from-the-universe",
    handle: "letters-from-the-universe",
    title: "Letters From the Universe",
    subtitle: "Journal · Night",
    collection: "journals",
    price: INR(1450),
    createdAt: "2026-10-01",
    description: [
      "The universe speaks at night. This journal is a little story world to step into after the day has gone quiet - somewhere to slow down, stay awhile and discover what your mind has been waiting to say.",
      "A familiar character wanders with you through its pages, and may just become a friend.",
    ],
    images: [
      journal,
      img(
        "journal-night-carnival.jpg",
        "A night carnival drawn in fine silver lines on deep blue: a Ferris wheel, tents and a shooting star",
        1536,
        1024,
        "cover",
      ),
    ],
  }),
  product({
    id: "sample-the-life-i-am-creating",
    handle: "the-life-i-am-creating",
    title: "The Life I Am Creating",
    subtitle: "Workbook · Day · Season 1",
    collection: "workbooks",
    price: INR(1650),
    createdAt: "2026-09-24",
    description: [
      "A story world with a character beside you from beginning to end. Each chapter brings things to notice, ideas to sit with, little exercises to try and space for your own reflections.",
      "Work through it at whatever pace feels right - there is no deadline here.",
    ],
    images: [
      workbook,
      img(
        "workbook-life-i-am-creating.jpg",
        "The Life I Am Creating workbook lying on white paper beside a brass pen",
        1516,
        1600,
        "cover",
      ),
      img(
        "workbook-life-i-am-creating-basket.jpg",
        "The Life I Am Creating workbook tucked into a woven basket with a blue handle",
        1200,
        1600,
        "cover",
      ),
    ],
  }),
  product({
    id: "sample-the-goose-diary",
    handle: "the-goose-diary",
    title: "The Goose Diary",
    subtitle: "Diary · Rose ink",
    collection: "diaries",
    price: INR(950),
    createdAt: "2026-09-20",
    description: [
      "A goose in a good coat leans on a field fence, with a tiny story to tell before he leaves the rest of the pages, and all their possibility, to you.",
    ],
    images: [
      img("diary-goose.jpg", "Diary cover: a goose in a coat leaning on a field fence, in rose ink", 1054, 1492),
    ],
  }),
  product({
    id: "sample-the-horse-diary",
    handle: "the-horse-diary",
    title: "The Horse Diary",
    subtitle: "Diary · Plum ink",
    collection: "diaries",
    price: INR(950),
    createdAt: "2026-09-20",
    description: [
      "A horse waits before a quiet chateau. One small surprise is tucked inside; the rest of the pages are mostly blank, and entirely yours.",
    ],
    images: [img("diary-horse.jpg", "Diary cover: a horse before a chateau, in plum ink", 1054, 1492)],
  }),
  product({
    id: "sample-the-aviators-diary",
    handle: "the-aviators-diary",
    title: "The Aviators Diary",
    subtitle: "Diary · Sepia ink",
    collection: "diaries",
    price: INR(950),
    createdAt: "2026-09-18",
    description: [
      "Two aviators beside a vintage plane, with clouds curling overhead - for the days that feel like the beginning of a journey.",
    ],
    images: [img("diary-aviators.jpg", "Diary cover: two aviators beside a vintage plane, in sepia ink", 1054, 1492)],
  }),
  product({
    id: "sample-the-pagoda-diary",
    handle: "the-pagoda-diary",
    title: "The Pagoda Diary",
    subtitle: "Diary · Soft blue ink",
    collection: "diaries",
    price: INR(950),
    createdAt: "2026-09-18",
    description: [
      "A pagoda on a misty lake, drawn in soft blue. Mostly blank pages, kept quiet on purpose, for whatever wants to be written.",
    ],
    images: [img("diary-pagoda.jpg", "Diary cover: a pagoda on a misty lake, in soft blue ink", 1054, 1492)],
  }),
  product({
    id: "sample-thoughts-notebook",
    handle: "thoughts-notebook",
    title: "Thoughts",
    subtitle: "Notebook · Three colours",
    collection: "notebooks",
    price: INR(450),
    createdAt: "2026-09-12",
    description: [
      "A little blank space made to come along with you: light, easy to carry, and ready for notes, lists, passing thoughts, sudden ideas and little squiggles.",
      "Each colour carries its own small pencil sketch on the cover.",
    ],
    images: [olive, slate, umber],
    options: [
      {
        name: "Colour",
        values: [
          { name: "Olive", swatch: "#b8b67d" },
          { name: "Slate", swatch: "#6c7b7b" },
          { name: "Umber", swatch: "#33120a" },
        ],
      },
    ],
    variants: [
      ["Olive", olive],
      ["Slate", slate],
      ["Umber", umber],
    ].map(([colour, image]) => ({
      id: `sample-thoughts-notebook-${colour.toLowerCase()}`,
      title: colour,
      availableForSale: true,
      price: INR(450),
      compareAtPrice: null,
      selectedOptions: [{ name: "Colour", value: colour }],
      image,
    })),
  }),
];
