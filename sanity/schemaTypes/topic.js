import { defineField, defineType } from "sanity";

/** An Explore section (Short Stories, Wanderings…). Each gets /explore/topic/[slug]. */
export default defineType({
  name: "topic",
  title: "Topic",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "description", type: "text", rows: 2, description: "Shown under the topic title." }),
    defineField({ name: "order", type: "number", description: "Position in the topic bar (1 = first)." }),
  ],
  orderings: [{ title: "Topic bar order", name: "order", by: [{ field: "order", direction: "asc" }] }],
});
