import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { defineField, defineType } from "sanity";
import TopicSelectInput from "../components/editor/TopicSelectInput";
import StoryFormHeader from "../components/modules/StoryFormHeader";

/** A story on /explore. Field names match the GROQ in src/lib/explore/sanity.js. */
export default defineType({
  name: "post",
  title: "Story",
  type: "document",
  icon: DocumentTextIcon,
  // One page, like Kathart's project editor: a banner, a collapsible "Story settings" card,
  // then the content built from modules.
  components: { input: StoryFormHeader },
  fieldsets: [
    { name: "settings", title: "Story settings", description: "Title · Web address · Topic · Author · Date · Featured image · Cover", options: { collapsible: true, collapsed: false } },
    { name: "front", title: "Front page", description: "Lead story and the numbered list", options: { collapsible: true, collapsed: true } },
    { name: "seo", title: "Search & sharing", description: "Title, description and picture for search engines and link previews", options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({ name: "title", type: "string", fieldset: "settings", validation: (r) => r.required().max(120) }),
    defineField({
      name: "slug",
      title: "Web address",
      type: "slug",
      fieldset: "settings",
      description: "Used in the link: /explore/…",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "dek",
      title: "Standfirst",
      description: "One or two sentences under the headline and on the story cards.",
      type: "text",
      rows: 3,
      fieldset: "settings",
      validation: (r) => r.max(260),
    }),
    defineField({
      name: "topic",
      type: "reference",
      to: [{ type: "topic" }],
      fieldset: "settings",
      components: { input: TopicSelectInput },
      validation: (r) => r.required(),
    }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }], fieldset: "settings" }),
    defineField({
      name: "publishedAt",
      title: "Publish date",
      description: "Stories dated in the future stay hidden until then.",
      type: "datetime",
      fieldset: "settings",
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured image (thumbnail)",
      type: "picture",
      fieldset: "settings",
      description: "The picture on story cards, in story rows and in link previews. Animated GIFs keep moving.",
      validation: (r) =>
        r.custom((value, { document }) => {
          if (value?.asset) return true;
          // Older stories have only a cover - cards use it until a featured image is added
          return document?.cover?.asset ? true : "Add a featured image - it is the story's thumbnail.";
        }),
    }),
    defineField({
      name: "cover",
      title: "Cover photo (optional)",
      type: "picture",
      fieldset: "settings",
      description: "The large picture at the top of the story. Leave empty for a story without one - the cards still use the featured image.",
    }),
    defineField({
      name: "coverVideo",
      title: "Cover video (optional)",
      type: "video",
      fieldset: "settings",
      description: "Plays at the top of the story instead of the cover photo. Cards still show the featured image.",
      options: { collapsible: true, collapsed: true },
    }),

    defineField({
      name: "featured",
      title: "Lead story",
      description: "Leads the Explore front page (unless the Explore page picks a lead). If several are ticked, the newest wins.",
      type: "boolean",
      fieldset: "front",
      initialValue: false,
    }),
    defineField({
      name: "editorsPick",
      title: "Worth lingering over",
      description: "Can appear in the numbered list on the front page.",
      type: "boolean",
      fieldset: "front",
      initialValue: false,
    }),

    defineField({
      name: "body",
      title: "Story content",
      description: "Build the story by stacking modules - text, pictures, video and more. Drag a module by its header to move it, or use ↑ ↓.",
      type: "storyBody",
    }),

    defineField({ name: "seoTitle", title: "Search title", type: "string", fieldset: "seo", description: "Optional - defaults to the title." }),
    defineField({ name: "seoDescription", title: "Search description", type: "text", rows: 2, fieldset: "seo", description: "Optional - defaults to the standfirst." }),
    defineField({ name: "shareImage", title: "Link preview picture", type: "image", fieldset: "seo", description: "Optional - defaults to the featured image. Best at 1200 × 630." }),
  ],
  orderings: [
    { title: "Newest first", name: "publishedDesc", by: [{ field: "publishedAt", direction: "desc" }] },
    { title: "Title A–Z", name: "titleAsc", by: [{ field: "title", direction: "asc" }] },
  ],
  preview: {
    select: { title: "title", topic: "topic.title", date: "publishedAt", thumb: "featuredImage", cover: "cover", featured: "featured", pick: "editorsPick" },
    prepare: ({ title, topic, date, thumb, cover, featured, pick }) => ({
      title,
      subtitle: [
        featured ? "★ Lead" : pick ? "☆ Pick" : null,
        topic,
        date && new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
      ]
        .filter(Boolean)
        .join("  ·  "),
      media: thumb?.asset ? thumb : cover,
    }),
  },
});
