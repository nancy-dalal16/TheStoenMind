import { BlockquoteIcon } from "@sanity/icons/Blockquote";
import { BulbOutlineIcon } from "@sanity/icons/BulbOutline";
import { RemoveIcon } from "@sanity/icons/Remove";
import { CodeIcon } from "@sanity/icons/Code";
import { HighlightIcon } from "@sanity/icons/Highlight";
import { LinkIcon } from "@sanity/icons/Link";
import { TextIcon } from "@sanity/icons/Text";
import { defineArrayMember, defineField, defineType } from "sanity";
import ModuleArrayInput from "../components/modules/ModuleArrayInput";
import ModuleItem from "../components/modules/ModuleItem";
import {
  ColorSwatchInput,
  DisplayStyle,
  FontSizeIcon,
  FontSizeMark,
  HighlightMark,
  LabelStyle,
  LeadStyle,
  SmallCapsIcon,
  SmallCapsMark,
  SmallStyle,
  SubIcon,
  SubMark,
  SupIcon,
  SupMark,
  TextColorIcon,
  TextColorMark,
  TypefaceIcon,
  TypefaceMark,
} from "../components/editor/TextMarks";
import { FONT_FAMILIES, FONT_SIZE_LIST, LINE_SPACINGS, TEXT_ALIGNS } from "../../src/lib/explore/editorOptions";

/*
 * A story is built by stacking modules (like Kathart's "Project Content"): Text, Picture, Side by
 * side, Gallery, GIF, Video, Audio, Embed, Picture + text, Pull quote, Prompt, Callout, Columns,
 * Numbers, Button, Story card, Product card, Section break, Space.
 * Drag to reorder; ↑ ↓ duplicate and delete on each module; "+" between modules or
 * "+ Add module" at the end opens the picker. Every type has a renderer on the site
 * (src/components/explore/PortableText.jsx).
 */

const linkAnnotation = {
  name: "link",
  type: "object",
  title: "Link",
  icon: LinkIcon,
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
};

/**
 * Rich text used inside a Text module. Toolbar, left to right:
 *   style menu  Paragraph, Lead, Small print, Display heading, Heading, Subheading, Small heading, Label, Quote
 *   marks       bold, italic, underline, strike, highlight, superscript, subscript, small caps, code
 *   lists       bullets, numbered
 *   annotations link, font size (10–120 px or custom), text colour, typeface
 * Alignment and line spacing are set on the Text module itself (below the text).
 */
export const richText = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Lead paragraph (larger)", value: "lead", component: LeadStyle },
        { title: "Small print", value: "small", component: SmallStyle },
        { title: "Display heading (very large)", value: "display", component: DisplayStyle },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
        { title: "Small heading", value: "h4" },
        { title: "Label (small capitals)", value: "label", component: LabelStyle },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullets", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Bold", value: "strong" },
          { title: "Italic", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          { title: "Highlight", value: "highlight", icon: HighlightIcon, component: HighlightMark },
          { title: "Superscript", value: "sup", icon: SupIcon, component: SupMark },
          { title: "Subscript", value: "sub", icon: SubIcon, component: SubMark },
          { title: "Small caps", value: "smallcaps", icon: SmallCapsIcon, component: SmallCapsMark },
          { title: "Code", value: "code", icon: CodeIcon },
        ],
        annotations: [
          linkAnnotation,
          {
            name: "fontSize",
            type: "object",
            title: "Font size",
            icon: FontSizeIcon,
            components: { annotation: FontSizeMark },
            fields: [
              defineField({
                name: "size",
                title: "Size",
                type: "string",
                description: "The body text is about 20 px. Sizes from 28 px get a little smaller on phones.",
                options: { list: FONT_SIZE_LIST },
                initialValue: "24",
                validation: (r) => r.required(),
              }),
              defineField({
                name: "custom",
                title: "Custom size (px)",
                type: "number",
                hidden: ({ parent }) => parent?.size !== "custom",
                validation: (r) =>
                  r.custom((value, { parent }) => (parent?.size === "custom" && !value ? "Enter a size in px." : true)).min(6).max(240),
              }),
            ],
          },
          {
            name: "textColor",
            type: "object",
            title: "Text colour",
            icon: TextColorIcon,
            components: { annotation: TextColorMark },
            fields: [
              defineField({
                name: "color",
                title: "Colour",
                type: "string",
                description: "Palette colours adjust for night mode.",
                components: { input: ColorSwatchInput },
                validation: (r) => r.required(),
              }),
              defineField({
                name: "custom",
                title: "Custom colour",
                type: "string",
                description: "A hex code, e.g. #205a79. It stays the same in night mode.",
                hidden: ({ parent }) => parent?.color !== "custom",
                validation: (r) =>
                  r.custom((value, { parent }) =>
                    parent?.color !== "custom" ? true : /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value ?? "") ? true : "Use a hex code like #205a79.",
                  ),
              }),
            ],
          },
          {
            name: "typeface",
            type: "object",
            title: "Typeface",
            icon: TypefaceIcon,
            components: { annotation: TypefaceMark },
            fields: [
              defineField({
                name: "family",
                title: "Typeface",
                type: "string",
                options: { list: FONT_FAMILIES.map(({ title, value }) => ({ title, value })), layout: "radio" },
                initialValue: "sans",
                validation: (r) => r.required(),
              }),
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
  description: "Paragraphs, headings, lists, links, font sizes and colours.",
  type: "object",
  icon: TextIcon,
  fieldsets: [{ name: "layout", title: "Alignment & spacing", options: { columns: 2 } }],
  fields: [
    defineField({ name: "content", title: "Text", type: "richText" }),
    defineField({
      name: "align",
      title: "Alignment",
      type: "string",
      fieldset: "layout",
      options: { list: TEXT_ALIGNS, layout: "radio", direction: "horizontal" },
      initialValue: "left",
    }),
    defineField({
      name: "spacing",
      title: "Line spacing",
      type: "string",
      fieldset: "layout",
      options: { list: LINE_SPACINGS.map(({ title, value }) => ({ title, value })), layout: "radio", direction: "horizontal" },
      initialValue: "normal",
    }),
  ],
  preview: {
    select: { content: "content", align: "align" },
    prepare: ({ content = [], align }) => {
      const text = content
        .filter((b) => b._type === "block")
        .map((b) => (b.children ?? []).map((c) => c.text).join(""))
        .join(" ");
      const words = text.split(/\s+/).filter(Boolean).length;
      const where = align && align !== "left" ? ` · ${TEXT_ALIGNS.find((a) => a.value === align)?.title.toLowerCase()}` : "";
      return { title: text.slice(0, 90) || "Empty text", subtitle: `${words} words${where}` };
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
