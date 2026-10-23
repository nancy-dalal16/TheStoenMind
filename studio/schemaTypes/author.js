import { UserIcon } from "@sanity/icons/User";
import { defineField, defineType } from "sanity";
import { altField } from "./objects/media";

export default defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: UserIcon,
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "name" } }),
    defineField({ name: "role", type: "string", description: "e.g. Writer & Editor" }),
    defineField({ name: "bio", type: "text", rows: 3, description: "One or two sentences, shown at the end of each story." }),
    defineField({ name: "photo", type: "image", options: { hotspot: true }, fields: [altField] }),
  ],
  preview: { select: { title: "name", subtitle: "role", media: "photo" } },
});
