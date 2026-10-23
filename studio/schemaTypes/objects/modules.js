import { BasketIcon } from "@sanity/icons/Basket";
import { BookmarkIcon } from "@sanity/icons/Bookmark";
import { DoubleQuoteIcon } from "@sanity/icons/DoubleQuote";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { InfoOutlineIcon } from "@sanity/icons/InfoOutline";
import { LaunchIcon } from "@sanity/icons/Launch";
import { LinkIcon } from "@sanity/icons/Link";
import { PanelLeftIcon } from "@sanity/icons/PanelLeft";
import { SplitHorizontalIcon } from "@sanity/icons/SplitHorizontal";
import { SplitVerticalIcon } from "@sanity/icons/SplitVertical";
import { TextIcon } from "@sanity/icons/Text";
import { ThLargeIcon } from "@sanity/icons/ThLarge";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { BarChartIcon } from "@sanity/icons/BarChart";
import { SparklesIcon } from "@sanity/icons/Sparkles";
import { defineArrayMember, defineField, defineType } from "sanity";
import { altField } from "./media";

/*
 * Extra building blocks ("modules").
 *   In a story body: image + text, callout, button, columns, spacer, story card, product card.
 *   On the Explore page ("Extra sections"): text band, picture band, quote band, story row,
 *   call-to-action band, video/embed band and newsletter band - each placed where you choose.
 */

const linkFields = [
  defineField({ name: "label", type: "string" }),
  defineField({
    name: "href",
    title: "Link",
    type: "url",
    description: "A page on this site (/shop/journals) or a full address (https://…).",
    validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
  }),
];

const BUTTON_STYLES = {
  list: [
    { title: "Filled", value: "primary" },
    { title: "Outline", value: "outline" },
    { title: "Text link", value: "text" },
  ],
  layout: "radio",
  direction: "horizontal",
};

/* ── Story body modules ─────────────────────────────────────────────── */

export const imageText = defineType({
  name: "imageText",
  title: "Picture + text",
  description: "A picture beside a heading, words and an optional link.",
  type: "object",
  icon: PanelLeftIcon,
  fields: [
    defineField({ name: "image", title: "Picture", type: "image", options: { hotspot: true }, fields: [altField], validation: (r) => r.required() }),
    defineField({ name: "night", title: "Night version", type: "image", options: { hotspot: true } }),
    defineField({
      name: "imageSide",
      title: "Picture on the",
      type: "string",
      options: { list: [{ title: "Left", value: "left" }, { title: "Right", value: "right" }], layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "text", type: "text", rows: 5 }),
    defineField({ name: "link", title: "Button (optional)", type: "object", fields: linkFields, options: { collapsible: true, collapsed: true } }),
  ],
  preview: {
    select: { title: "heading", subtitle: "text", media: "image" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Picture + text", subtitle, media }),
  },
});

export const callout = defineType({
  name: "callout",
  title: "Callout",
  description: "A highlighted note set apart from the text.",
  type: "object",
  icon: InfoOutlineIcon,
  fields: [
    defineField({
      name: "tone",
      type: "string",
      options: {
        list: [
          { title: "Soft mist", value: "soft" },
          { title: "Vanilla", value: "warm" },
          { title: "Outline", value: "outline" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "soft",
    }),
    defineField({ name: "title", type: "string" }),
    defineField({ name: "text", type: "text", rows: 4, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "title", subtitle: "text" }, prepare: ({ title, subtitle }) => ({ title: title || "Callout", subtitle }) },
});

export const button = defineType({
  name: "button",
  title: "Button",
  description: "A link styled as a button - filled, outline or text.",
  type: "object",
  icon: LinkIcon,
  fields: [
    ...linkFields.map((f) => ({ ...f, validation: (r) => r.required() })),
    defineField({ name: "style", type: "string", options: BUTTON_STYLES, initialValue: "primary" }),
    defineField({
      name: "align",
      type: "string",
      options: { list: ["left", "center"], layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
  ],
  preview: { select: { title: "label", subtitle: "href" }, prepare: ({ title, subtitle }) => ({ title: title || "Button", subtitle }) },
});

export const columns = defineType({
  name: "columns",
  title: "Columns",
  description: "Two or three short columns of text with headings.",
  type: "object",
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: "items",
      title: "Columns",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "column",
          fields: [defineField({ name: "heading", type: "string" }), defineField({ name: "text", type: "text", rows: 5 })],
          preview: { select: { title: "heading", subtitle: "text" } },
        }),
      ],
      validation: (r) => r.min(2).max(3),
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare: ({ items = [] }) => ({ title: `${items.length} columns`, subtitle: items.map((i) => i.heading).filter(Boolean).join(" · ") }),
  },
});

export const spacer = defineType({
  name: "spacer",
  title: "Space",
  description: "Blank space between blocks - small, medium or large.",
  type: "object",
  icon: SplitVerticalIcon,
  fields: [
    defineField({
      name: "size",
      type: "string",
      options: { list: [{ title: "Small", value: "s" }, { title: "Medium", value: "m" }, { title: "Large", value: "l" }], layout: "radio", direction: "horizontal" },
      initialValue: "m",
    }),
  ],
  preview: { select: { size: "size" }, prepare: ({ size }) => ({ title: `Space (${{ s: "small", m: "medium", l: "large" }[size] ?? "medium"})` }) },
});

export const storyLink = defineType({
  name: "storyLink",
  title: "Story card",
  description: "A card linking to another story.",
  type: "object",
  icon: BookmarkIcon,
  fields: [
    defineField({ name: "label", type: "string", initialValue: "Read also" }),
    defineField({ name: "story", type: "reference", to: [{ type: "post" }], validation: (r) => r.required() }),
  ],
  preview: {
    select: { title: "story.title", subtitle: "label", media: "story.cover" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Story card", subtitle, media }),
  },
});

export const productLink = defineType({
  name: "productLink",
  title: "Product card",
  description: "A card for a journal or diary in the shop.",
  type: "object",
  icon: BasketIcon,
  fields: [
    defineField({ name: "image", type: "image", options: { hotspot: true }, fields: [altField] }),
    defineField({ name: "eyebrow", type: "string", initialValue: "From the shop" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 3 }),
    defineField({ name: "price", type: "string", description: "Optional, e.g. ₹1,450" }),
    defineField({ name: "href", title: "Link", type: "url", initialValue: "/shop", validation: (r) => r.uri({ allowRelative: true }) }),
    defineField({ name: "label", title: "Button", type: "string", initialValue: "See it in the shop" }),
  ],
  preview: { select: { title: "title", subtitle: "price", media: "image" } },
});

export const imagePair = defineType({
  name: "imagePair",
  title: "Side by side",
  description: "Two pictures next to each other, with a width balance you choose.",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Pictures",
      type: "array",
      of: [defineArrayMember({ type: "image", options: { hotspot: true }, fields: [altField, defineField({ name: "caption", type: "string" })] })],
      options: { layout: "grid" },
      validation: (r) => r.length(2).error("Add exactly two pictures."),
    }),
    defineField({
      name: "ratio",
      title: "Balance",
      type: "string",
      options: {
        list: [
          { title: "Equal", value: "equal" },
          { title: "Wider left", value: "left" },
          { title: "Wider right", value: "right" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "equal",
    }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    select: { images: "images", caption: "caption" },
    prepare: ({ images = [], caption }) => ({ title: caption || "Side by side", media: images[0]?.asset ? images[0] : ImagesIcon }),
  },
});

export const stats = defineType({
  name: "stats",
  title: "Numbers",
  description: "A row of figures with short labels - pages, readers, days…",
  type: "object",
  icon: BarChartIcon,
  fields: [
    defineField({ name: "heading", type: "string" }),
    defineField({
      name: "items",
      title: "Figures",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({ name: "value", type: "string", description: "e.g. 120, 3k, 7 days", validation: (r) => r.required() }),
            defineField({ name: "label", type: "string" }),
          ],
          preview: { select: { title: "value", subtitle: "label" } },
        }),
      ],
      validation: (r) => r.min(2).max(4),
    }),
  ],
  preview: {
    select: { items: "items", heading: "heading" },
    prepare: ({ items = [], heading }) => ({ title: heading || "Numbers", subtitle: items.map((i) => i.value).join(" · ") }),
  },
});

export const gif = defineType({
  name: "gif",
  title: "Animated GIF",
  description: "Upload a looping .gif - it keeps moving on the site.",
  type: "image",
  icon: SparklesIcon,
  options: { accept: "image/gif" },
  fields: [
    altField,
    defineField({ name: "caption", type: "string" }),
    defineField({
      name: "size",
      type: "string",
      options: {
        list: [
          { title: "Text width", value: "column" },
          { title: "Wide", value: "wide" },
          { title: "Full width", value: "full" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "column",
    }),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "asset" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Animated GIF", subtitle, media }),
  },
});

export const bodyModules = [imageText, imagePair, stats, gif, callout, button, columns, spacer, storyLink, productLink];

/* ── Explore page sections ──────────────────────────────────────────── */

const PLACEMENT = defineField({
  name: "placement",
  title: "Where on the page",
  type: "string",
  options: {
    list: [
      { title: "After the top stories", value: "afterTop" },
      { title: "After “The latest”", value: "afterLatest" },
      { title: "After the tinted topic band", value: "afterSpotlight" },
      { title: "After the large quote", value: "afterQuote" },
      { title: "At the end (before the gift band)", value: "end" },
    ],
  },
  initialValue: "end",
});

const BACKGROUND = defineField({
  name: "background",
  type: "string",
  options: {
    list: [
      { title: "Page", value: "page" },
      { title: "Soft mist band", value: "soft" },
      { title: "Misty Blue band", value: "band" },
    ],
    layout: "radio",
    direction: "horizontal",
  },
  initialValue: "page",
});

const withPreview = (title, icon, fields, select = {}) => ({
  icon,
  preview: {
    select: { heading: "heading", text: "text", placement: "placement", media: "image", ...select },
    prepare: ({ heading, text, placement, media }) => ({
      title: heading || text || title,
      subtitle: `${title} · ${
        { afterTop: "after the top stories", afterLatest: "after the latest", afterSpotlight: "after the band", afterQuote: "after the quote", end: "at the end" }[placement] ?? "at the end"
      }`,
      media: media ?? icon,
    }),
  },
  fields,
});

export const textSection = defineType({
  name: "textSection",
  title: "Text band",
  description: "Heading, words and up to two buttons on a plain or tinted band.",
  type: "object",
  ...withPreview("Text band", TextIcon, [
    PLACEMENT,
    defineField({ name: "eyebrow", type: "string" }),
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "text", type: "text", rows: 4 }),
    defineField({ name: "buttons", type: "array", of: [defineArrayMember({ type: "button" })], validation: (r) => r.max(2) }),
    BACKGROUND,
    defineField({
      name: "align",
      type: "string",
      options: { list: ["center", "left"], layout: "radio", direction: "horizontal" },
      initialValue: "center",
    }),
  ]),
});

export const pictureSection = defineType({
  name: "pictureSection",
  title: "Picture band",
  description: "One wide or full-width picture.",
  type: "object",
  ...withPreview(
    "Picture band",
    ImageIcon,
    [
      PLACEMENT,
      defineField({ name: "picture", type: "picture", validation: (r) => r.required() }),
      defineField({ name: "heading", type: "string", description: "Optional, above the picture." }),
    ],
    { media: "picture" },
  ),
});

export const quoteSection = defineType({
  name: "quoteSection",
  title: "Quote band",
  description: "A large quote, optionally linked to its story.",
  type: "object",
  ...withPreview("Quote band", DoubleQuoteIcon, [
    PLACEMENT,
    defineField({ name: "text", title: "Quote", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", type: "string" }),
    defineField({ name: "story", title: "From the story", type: "reference", to: [{ type: "post" }] }),
  ]),
});

export const storiesSection = defineType({
  name: "storiesSection",
  title: "Story row",
  description: "A row of chosen stories, or the newest from a topic.",
  type: "object",
  ...withPreview("Story row", ThLargeIcon, [
    PLACEMENT,
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({
      name: "stories",
      title: "Stories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      description: "Pick 2–4 stories - or leave empty and choose a topic below.",
      validation: (r) => r.max(4).unique(),
    }),
    defineField({ name: "topic", title: "…or the newest from a topic", type: "reference", to: [{ type: "topic" }] }),
    BACKGROUND,
  ]),
});

export const ctaSection = defineType({
  name: "ctaSection",
  title: "Call-to-action band",
  description: "Heading, words, buttons and an optional picture.",
  type: "object",
  ...withPreview("Call-to-action band", LaunchIcon, [
    PLACEMENT,
    defineField({ name: "heading", type: "string", validation: (r) => r.required() }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ name: "buttons", type: "array", of: [defineArrayMember({ type: "button" })], validation: (r) => r.min(1).max(2) }),
    defineField({ name: "image", title: "Picture (optional)", type: "image", options: { hotspot: true }, fields: [altField] }),
    BACKGROUND,
  ]),
});

export const embedSection = defineType({
  name: "embedSection",
  title: "Video / embed band",
  description: "An uploaded video or a YouTube, Vimeo or Spotify link.",
  type: "object",
  ...withPreview("Video / embed band", PanelLeftIcon, [
    PLACEMENT,
    defineField({ name: "heading", type: "string" }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ name: "video", title: "Uploaded video", type: "video" }),
    defineField({ name: "embed", title: "…or an embed link", type: "embed" }),
  ]),
});

export const newsletterSection = defineType({
  name: "newsletterSection",
  title: "Newsletter band",
  description: "The email sign-up, wherever you want it.",
  type: "object",
  ...withPreview("Newsletter band", EnvelopeIcon, [
    PLACEMENT,
    defineField({
      name: "heading",
      title: "Heading (optional)",
      type: "string",
      description: "Leave empty to use the wording from the Newsletter tab.",
    }),
  ]),
});

export const sectionTypes = [textSection, pictureSection, quoteSection, storiesSection, ctaSection, embedSection, newsletterSection];
