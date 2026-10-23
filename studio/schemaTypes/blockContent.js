import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { RemoveIcon } from "@sanity/icons/Remove";
import { TextIcon } from "@sanity/icons/Text";
import { defineArrayMember, defineField, defineType } from "sanity";
import ModuleArrayInput from "../components/modules/ModuleArrayInput";
import ModuleItem from "../components/modules/ModuleItem";

/*
 * A story is built by stacking modules (like Kathart's "Project Content"): Text, Picture, Side by
 * side, Gallery, GIF, Video, Audio, Embed, Picture + text, Pull quote, Prompt, Callout, Columns,
 * Numbers, Button, Story card, Product card, Section break, Space.
 * Drag to reorder; ↑ ↓ duplicate and delete on each module; "+" between modules or
 * "+ Add module" at the end opens the picker. Every type has a renderer on the site
 * (src/components/explore/PortableText.jsx).
 */

/** Rich text used inside a Text module (and anywhere else a few paragraphs are needed). */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Small heading", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Emphasis", value: "em" },
          { title: "Strong", value: "strong" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [
              defineField({
                name: "href",
                type: "url",
                title: "Link",
                description: "A full address (https://…), a page on this site (/shop) or an email (mailto:…).",
                validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto", "tel"] }),
              }),
              defineField({ name: "blank", title: "Open in a new tab", type: "boolean", initialValue: false }),
            ],
          },
        ],
      },
    }),
  ],
});

export const textBlock = defineType({
  name: "textBlock",
  title: "Text",
  description: "Paragraphs, headings, lists and links.",
  type: "object",
  icon: TextIcon,
  fields: [defineField({ name: "content", title: "Text", type: "richText" })],
  preview: {
    select: { content: "content" },
    prepare: ({ content = [] }) => {
      const text = content
        .filter((b) => b._type === "block")
        .map((b) => (b.children ?? []).map((c) => c.text).join(""))
        .join(" ");
      const words = text.split(/\s+/).filter(Boolean).length;
      return { title: text.slice(0, 90) || "Empty text", subtitle: `${words} words` };
    },
  },
});

export const pullQuote = defineType({
  name: "pullQuote",
  title: "Pull quote",
  description: "A line from the story, set large.",
  type: "object",
  icon: BlockquoteIcon,
  fields: [
    defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
    defineField({ name: "attribution", type: "string" }),
  ],
  preview: { select: { title: "text", subtitle: "attribution" } },
});

export const prompt = defineType({
  name: "prompt",
  title: "Prompt card",
  description: "A journalling prompt in its own card.",
  type: "object",
  icon: BulbOutlineIcon,
  fields: [
    defineField({ name: "heading", type: "string", initialValue: "A prompt to carry with you" }),
    defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: "text", subtitle: "heading" } },
});

export const sectionBreak = defineType({
  name: "sectionBreak",
  title: "Section break",
  description: "A little cloud, a thin line or three dots.",
  type: "object",
  icon: RemoveIcon,
  fields: [
    defineField({
      name: "style",
      type: "string",
      options: {
        list: [
          { title: "Little cloud", value: "cloud" },
          { title: "Thin line", value: "line" },
          { title: "Three dots", value: "dots" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "cloud",
    }),
  ],
  preview: {
    select: { style: "style" },
    prepare: ({ style }) => ({ title: { line: "Thin line", dots: "Three dots" }[style] ?? "Little cloud" }),
  },
});

/** Module order in the picker (grouped like Kathart's "Choose a module"). */
export const STORY_MODULES = [
  "textBlock",
  "picture",
  "imagePair",
  "gallery",
  "gif",
  "video",
  "audio",
  "embed",
  "imageText",
  "pullQuote",
  "prompt",
  "callout",
  "columns",
  "stats",
  "button",
  "storyLink",
  "productLink",
  "sectionBreak",
  "spacer",
];

/** Every module gets the card frame (type label, ↑ ↓, duplicate, delete, "+" below). */
export const moduleMember = (type) => defineArrayMember({ type, components: { item: ModuleItem } });

export default defineType({
  name: "storyBody",
  title: "Story content",
  type: "array",
  of: STORY_MODULES.map(moduleMember),
  // Show every module (no "Show all N items" fold), like Kathart's project content
  options: { collapseItemsAfter: false },
  components: { input: ModuleArrayInput },
});
