import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * The story body. Every type here has a renderer in src/components/explore/PortableText.jsx;
 * a new type added here will simply be skipped on the site until it gets one.
 */
export default defineType({
  name: "blockContent",
  title: "Body",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Paragraph", value: "normal" },
        { title: "Heading", value: "h2" },
        { title: "Subheading", value: "h3" },
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
                title: "URL",
                description: "Full address, or a site path such as /shop",
                validation: (r) => r.uri({ allowRelative: true, scheme: ["http", "https", "mailto"] }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "image",
      title: "Picture",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() }),
        defineField({ name: "caption", type: "string" }),
        defineField({ name: "night", title: "Night version (optional)", type: "image" }),
        defineField({
          name: "fit",
          type: "string",
          options: { list: [{ title: "Fill", value: "cover" }, { title: "Float", value: "contain" }], layout: "radio" },
          initialValue: "cover",
        }),
      ],
    }),
    defineArrayMember({
      name: "pullQuote",
      title: "Pull quote",
      type: "object",
      fields: [
        defineField({ name: "text", type: "text", rows: 2, validation: (r) => r.required() }),
        defineField({ name: "attribution", type: "string" }),
      ],
      preview: { select: { title: "text", subtitle: "attribution" } },
    }),
    defineArrayMember({
      name: "prompt",
      title: "Prompt card",
      type: "object",
      fields: [
        defineField({ name: "heading", type: "string", initialValue: "A prompt to carry with you" }),
        defineField({ name: "text", type: "text", rows: 3, validation: (r) => r.required() }),
      ],
      preview: { select: { title: "text", subtitle: "heading" } },
    }),
    defineArrayMember({
      name: "sectionBreak",
      title: "Cloud break",
      type: "object",
      fields: [defineField({ name: "style", type: "string", hidden: true, initialValue: "cloud" })],
      preview: { prepare: () => ({ title: "☁︎  Section break" }) },
    }),
  ],
});
