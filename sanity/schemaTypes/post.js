import { defineField, defineType } from "sanity";

/**
 * A story on /explore. Field names match the GROQ in src/lib/explore/sanity.js -
 * rename one here and it must be renamed there too.
 */
export default defineType({
  name: "post",
  title: "Story",
  type: "document",
  groups: [
    { name: "story", title: "Story", default: true },
    { name: "art", title: "Picture" },
    { name: "front", title: "Front page" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "story", validation: (r) => r.required().max(110) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "story",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dek",
      title: "Standfirst",
      description: "One or two sentences under the headline - also used for search engines and link previews.",
      type: "text",
      rows: 3,
      group: "story",
      validation: (r) => r.required().max(240),
    }),
    defineField({ name: "topic", type: "reference", to: [{ type: "topic" }], group: "story", validation: (r) => r.required() }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], group: "story" }),
    defineField({
      name: "publishedAt",
      title: "Published",
      description: "Stories with a future date stay hidden until then.",
      type: "datetime",
      group: "story",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({ name: "body", type: "blockContent", group: "story" }),

    defineField({
      name: "coverImage",
      title: "Picture (day)",
      type: "image",
      group: "art",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
        defineField({ name: "caption", type: "string" }),
        defineField({ name: "credit", type: "string", initialValue: "Illustration · the STOEN mind" }),
      ],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "coverImageNight",
      title: "Picture (night)",
      description: "Optional night painting, shown in dark mode. Leave empty to use the day picture in both.",
      type: "image",
      group: "art",
      options: { hotspot: true },
    }),
    defineField({
      name: "coverFit",
      title: "Picture fit",
      description: "Fill the frame (paintings, photos) or float the piece on a soft background (book covers, medallions).",
      type: "string",
      group: "art",
      options: { list: [{ title: "Fill", value: "cover" }, { title: "Float", value: "contain" }], layout: "radio", direction: "horizontal" },
      initialValue: "cover",
    }),

    defineField({
      name: "featured",
      title: "Lead story",
      description: "Leads the Explore front page. If several are ticked, the newest wins.",
      type: "boolean",
      group: "front",
      initialValue: false,
    }),
    defineField({
      name: "editorsPick",
      title: "Worth lingering over",
      description: "Can appear in the numbered list on the front page.",
      type: "boolean",
      group: "front",
      initialValue: false,
    }),
  ],
  orderings: [{ title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] }],
  preview: {
    select: { title: "title", topic: "topic.title", date: "publishedAt", media: "coverImage" },
    prepare: ({ title, topic, date, media }) => ({
      title,
      subtitle: [topic, date && new Date(date).toLocaleDateString("en-IN")].filter(Boolean).join(" · "),
      media,
    }),
  },
});
