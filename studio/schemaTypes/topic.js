import { TagIcon } from "@sanity/icons/Tag";
import { defineField, defineType } from "sanity";

/** An Explore topic (Short Stories, Wanderings…). Each gets its own page at /explore/topic/[slug]. */
export default defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      description: "Used in the link: /explore/topic/…",
      options: { source: "title", maxLength: 64 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "description", type: "text", rows: 2, description: "Shown under the topic name on the front page and on its own page." }),
    defineField({
      name: "order",
      title: "Position",
      type: "number",
      description: "Order in the topic bar and on the front page (1 = first).",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "showInNav",
      title: "Show in the topic bar",
      type: "boolean",
      initialValue: true,
    }),
    defineField({ name: "seoDescription", title: "Search description", type: "text", rows: 2, description: "Optional - for search engines and link previews. Falls back to the description." }),
  ],
  orderings: [{ title: "Position", name: "order", by: [{ field: "order", direction: "asc" }] }],
  preview: {
    select: { title: "title", order: "order", description: "description" },
    prepare: ({ title, order, description }) => ({ title: `${order != null ? `${order}. ` : ""}${title ?? ""}`, subtitle: description }),
  },
});
