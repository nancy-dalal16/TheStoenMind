import { HomeIcon } from "@sanity/icons/Home";
import { defineField, defineType } from "sanity";
import ModuleArrayInput from "../components/modules/ModuleArrayInput";
import ModuleItem from "../components/modules/ModuleItem";
import TopicSelectInput from "../components/editor/TopicSelectInput";
import { altField, FIT_OPTIONS } from "./objects/media";

/**
 * Explore page settings (one document). Every heading, label and switch on /explore, the story
 * pages and the topic pages lives here. Anything left empty falls back to the site's defaults.
 */
const text = (name, title, initialValue, extra = {}) =>
  defineField({ name, title, type: "string", initialValue, ...extra });

export default defineType({
  name: "explorePage",
  title: "Explore page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "top", title: "Title & intro", default: true },
    { name: "front", title: "Front page" },
    { name: "picture", title: "Small picture" },
    { name: "letter", title: "Newsletter" },
    { name: "sections", title: "Extra sections" },
    { name: "labels", title: "Labels & buttons" },
    { name: "seo", title: "Search & sharing" },
  ],
  fields: [
    // Title & intro
    defineField({
      name: "eyebrow",
      title: "Above the title",
      type: "string",
      group: "top",
      options: {
        list: [
          { title: "“the STOEN mind” logo lettering", value: "wordmark" },
          { title: "My own text", value: "text" },
          { title: "Nothing", value: "none" },
        ],
        layout: "radio",
      },
      initialValue: "wordmark",
    }),
    text("eyebrowText", "Text above the title", "", { group: "top", hidden: ({ parent }) => parent?.eyebrow !== "text" }),
    text("title", "Page title", "Explore", { group: "top", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 2, group: "top", initialValue: "Stories, wanderings and quiet notes from the STOEN mind - to read slowly, and return to." }),
    defineField({ name: "showMeta", title: "Show “16 stories · Updated …” under the intro", type: "boolean", group: "top", initialValue: true }),
    text("allStoriesLabel", "First link in the topic bar", "All stories", { group: "top" }),

    // Front page
    defineField({
      name: "leadStory",
      title: "Lead story",
      type: "reference",
      to: [{ type: "post" }],
      group: "front",
      description: "Optional. Leave empty to use the newest story ticked “Lead story”, or else the newest story.",
    }),
    text("latestTitle", "“The latest” heading", "The latest", { group: "front" }),
    defineField({ name: "latestCount", title: "Stories in “The latest”", type: "number", group: "front", initialValue: 6, validation: (r) => r.integer().min(0).max(20) }),
    text("picksTitle", "Numbered list heading", "Worth lingering over", { group: "front" }),
    defineField({
      name: "picks",
      title: "Numbered list stories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "post" }] }],
      group: "front",
      description: "Optional, up to 5. Leave empty to use stories ticked “Worth lingering over”.",
      validation: (r) => r.max(5).unique(),
    }),
    defineField({ name: "showSpotlight", title: "Show the tinted topic band", type: "boolean", group: "front", initialValue: true }),
    defineField({
      name: "spotlightTopic",
      title: "Topic in the tinted band",
      type: "reference",
      to: [{ type: "topic" }],
      group: "front",
      components: { input: TopicSelectInput },
      hidden: ({ parent }) => parent?.showSpotlight === false,
    }),
    defineField({ name: "showQuote", title: "Show the large quote", type: "boolean", group: "front", initialValue: true }),
    defineField({ name: "quoteText", title: "Quote", type: "text", rows: 3, group: "front", hidden: ({ parent }) => parent?.showQuote === false }),
    defineField({
      name: "quoteStory",
      title: "Quote comes from",
      type: "reference",
      to: [{ type: "post" }],
      group: "front",
      hidden: ({ parent }) => parent?.showQuote === false,
    }),
    defineField({ name: "showTopicRails", title: "Show a row for each topic", type: "boolean", group: "front", initialValue: true }),
    defineField({ name: "showGiftBand", title: "Show the gift band at the bottom", type: "boolean", group: "front", initialValue: true }),
    text("emptyFront", "When there are no stories yet", "The first stories are on their way.", { group: "front" }),

    // Small picture
    defineField({
      name: "smallPicture",
      title: "A small picture",
      type: "object",
      group: "picture",
      description: "One drawing with a caption beside “The latest” - like a magazine's daily cartoon.",
      fields: [
        defineField({ name: "show", type: "boolean", initialValue: true }),
        text("label", "Heading", "A small picture"),
        defineField({ name: "image", title: "Picture", type: "image", options: { hotspot: true }, fields: [altField] }),
        defineField({ name: "night", title: "Night version", type: "image", options: { hotspot: true } }),
        defineField({ name: "fit", type: "string", options: FIT_OPTIONS, initialValue: "contain" }),
        defineField({ name: "caption", type: "text", rows: 2 }),
        text("credit", "Credit", ""),
      ],
    }),

    // Newsletter
    defineField({
      name: "newsletter",
      title: "Newsletter",
      type: "object",
      group: "letter",
      fields: [
        defineField({ name: "show", type: "boolean", initialValue: true }),
        text("eyebrow", "Small heading", "Letters, now and then"),
        text("title", "Heading", "A slow letter for your inbox"),
        defineField({ name: "text", type: "text", rows: 2, initialValue: "New stories, a prompt or two and the occasional painting - once a month, never more." }),
        text("placeholder", "Email field hint", "you@example.com"),
        text("button", "Button", "Sign me up"),
        text("success", "Thank-you message", "Thank you. Your first letter will find its way to you soon."),
      ],
    }),

    // Extra sections (page builder)
    defineField({
      name: "sections",
      title: "Extra sections",
      type: "array",
      group: "sections",
      description: "Add your own bands to the Explore front page - text, pictures, quotes, story rows, buttons, video or the newsletter - and choose where each one sits.",
      of: ["textSection", "pictureSection", "quoteSection", "storiesSection", "ctaSection", "embedSection", "newsletterSection"].map(
        (type) => ({ type, components: { item: ModuleItem } }),
      ),
      options: { collapseItemsAfter: false },
      components: { input: ModuleArrayInput },
    }),

    // Labels
    text("seeAll", "“See all” link", "See all", { group: "labels" }),
    text("readNextTitle", "Heading after a story", "Keep wandering", { group: "labels" }),
    text("readNextLink", "Link beside it", "All stories", { group: "labels" }),
    text("shareLabel", "Share button", "Share this story", { group: "labels" }),
    text("copiedLabel", "After copying the link", "Link copied", { group: "labels" }),
    text("moreFromLabel", "Topic button after a story (before the topic name)", "More", { group: "labels" }),
    text("byLabel", "Before an author's name", "By", { group: "labels" }),
    text("minReadLabel", "After the reading time", "min read", { group: "labels" }),
    text("emptyTopic", "Empty topic page heading", "Nothing here just yet", { group: "labels" }),
    text("emptyTopicText", "Empty topic page text", "New stories are on their way. In the meantime, the rest of Explore is open.", { group: "labels" }),

    // SEO
    text("seoTitle", "Browser tab & search title", "Explore", { group: "seo" }),
    defineField({ name: "seoDescription", title: "Search description", type: "text", rows: 2, group: "seo" }),
    defineField({ name: "shareImage", title: "Link preview picture", type: "image", group: "seo", description: "Best at 1200 × 630." }),
  ],
  preview: { prepare: () => ({ title: "Explore page", subtitle: "Titles, front page, labels" }) },
});
