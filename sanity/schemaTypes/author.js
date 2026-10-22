import { defineField, defineType } from "sanity";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "role", type: "string", description: "e.g. Writer & Editor" }),
    defineField({ name: "bio", type: "text", rows: 3, description: "One or two sentences under each story." }),
  ],
});
