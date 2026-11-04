import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { LaunchIcon } from "@sanity/icons/Launch";
import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";
import { COVER_SIZE_LIST, isFixedSize, MEDIA_ALIGNS, MEDIA_SHAPE_LIST, MEDIA_SIZE_LIST, parseShape } from "../../../src/lib/explore/editorOptions";

/*
 * Media building blocks used by stories and the Explore page.
 *   picture  - image (JPG, PNG, WebP, AVIF, SVG and animated GIF) with an optional night version
 *   gallery  - several pictures in a grid
 *   video    - an uploaded video file (MP4 / WebM / MOV) or GIF-style looping clip
 *   audio    - an uploaded sound file (MP3, WAV, M4A, OGG, AAC, FLAC)
 *   embed    - YouTube, Vimeo, Spotify, SoundCloud or any embeddable link
 */

/** Text width / wide / full - for modules that always follow the layout. */
export const LAYOUT_WIDTHS = [
  { title: "Text width", value: "column" },
  { title: "Wide", value: "wide" },
  { title: "Full width", value: "full" },
];

export const FIT_OPTIONS = {
  list: [
    { title: "Fill the frame", value: "cover" },
    { title: "Float on a soft background", value: "contain" },
  ],
  layout: "radio",
  direction: "horizontal",
};

/*
 * Where a picture / video sits decides which size options it shows:
 *   cover, coverVideo  - the top of a story: "Cover size" (wide / text width / full bleed /
 *                        fixed px / custom) + shape. (Older covers already store size: "column"
 *                        from the body default, so covers use their own field, coverSize.)
 *   featuredImage      - the thumbnail on story cards: shape only (width follows the card)
 *   anywhere else      - size (fixed px / layout widths / custom), position, and shape
 */
const isCoverPath = (path = []) => ["cover", "coverVideo"].includes(path[0]);
const isFeaturedPath = (path = []) => path[0] === "featuredImage";
const sizeOf = (parent, path) => (isCoverPath(path) ? (parent?.coverSize ?? "wide") : parent?.size);

/**
 * Shape (aspect ratio) of the frame: default, the picture's own shape, presets from 1:1 to
 * 3:1, or a custom W:H. `when(parent, path)` hides it where it doesn't apply.
 */
export function shapeFields({ title = "Shape", description, when } = {}) {
  const hidden = ({ parent, path }) => (when ? !when(parent, path) : false);
  return [
    defineField({
      name: "shape",
      title,
      type: "string",
      description:
        description ??
        "The frame's proportions - the picture is cropped to fit (around its hotspot). “Default” (or empty) keeps what this spot does now.",
      options: { list: MEDIA_SHAPE_LIST },
      initialValue: "auto",
      hidden,
    }),
    defineField({
      name: "customShape",
      title: "Custom shape (width : height)",
      type: "string",
      description: "For example 5:4, 7:3 or 1200x800.",
      placeholder: "5:4",
      hidden: (ctx) => ctx.parent?.shape !== "custom" || hidden(ctx),
      validation: (r) =>
        r.custom((value, { parent }) =>
          parent?.shape !== "custom" || parseShape(value) ? true : "Type a shape like 5:4 or 1200x800 (no more than 10 times wider than tall).",
        ),
    }),
  ];
}

/** Shape applies unless a fixed size already sets both width and height. */
const shapeApplies = (parent, path) => {
  const size = sizeOf(parent, path);
  if (!isFixedSize(size)) return true;
  return size === "custom" && !parent?.customHeight;
};

/**
 * Size options for pictures, GIFs, videos and embeds: fixed frames from 200 × 200 px up, the
 * layout widths (text width / wide / full) or a custom width × height, where a smaller frame
 * sits (left, centre, right, or with the text flowing around it), and the frame's shape.
 * Covers get the same options under "Cover size"; featured images get the shape only.
 */
export function sizeFields(initialSize = "column") {
  return [
    defineField({
      name: "size",
      type: "string",
      description: "Fixed sizes shrink to fit on small phones.",
      options: { list: MEDIA_SIZE_LIST },
      initialValue: initialSize,
      hidden: ({ path }) => isCoverPath(path) || isFeaturedPath(path),
    }),
    defineField({
      name: "coverSize",
      title: "Cover size",
      type: "string",
      description: "How wide the cover is at the top of the story. Empty = Wide (1120 px, the standard). Fixed sizes shrink to fit on small phones.",
      options: { list: COVER_SIZE_LIST },
      hidden: ({ path }) => !isCoverPath(path),
    }),
    defineField({
      name: "customWidth",
      title: "Width (px)",
      type: "number",
      hidden: ({ parent, path }) => sizeOf(parent, path) !== "custom" || isFeaturedPath(path),
      validation: (r) =>
        r
          .custom((value, { parent, path }) => (sizeOf(parent, path) === "custom" && !value ? "Enter a width for the custom size." : true))
          .integer()
          .min(40)
          .max(2400),
    }),
    defineField({
      name: "customHeight",
      title: "Height (px)",
      type: "number",
      description: "Leave empty to keep the picture's own shape (or use Shape below).",
      hidden: ({ parent, path }) => sizeOf(parent, path) !== "custom" || isFeaturedPath(path),
      validation: (r) => r.integer().min(40).max(2400),
    }),
    defineField({
      name: "align",
      title: "Position",
      type: "string",
      description: "For a cover, the “text flows around it” options sit left or right.",
      options: { list: MEDIA_ALIGNS },
      initialValue: "center",
      hidden: ({ parent, path }) => !isFixedSize(sizeOf(parent, path)) || isFeaturedPath(path),
    }),
    ...shapeFields({
      description:
        "The frame's proportions - the picture is cropped to fit (around its hotspot). Default (or empty): story cards follow their layout, the cover is 16:10 (4:3 on phones), pictures in a story keep their own shape.",
      when: (parent, path) => isFeaturedPath(path) || shapeApplies(parent, path),
    }),
  ];
}

/** Alt text, required on every picture - read aloud by screen readers and used by search engines. */
export const altField = defineField({
  name: "alt",
  title: "Alt text",
  type: "string",
  description: "Describe the picture for someone who can't see it.",
  validation: (r) => r.required().warning("Add alt text so everyone can enjoy the picture."),
});

export const picture = defineType({
  name: "picture",
  title: "Picture",
  type: "image",
  icon: ImageIcon,
  description: "JPG, PNG, WebP, AVIF, SVG or animated GIF. GIFs keep their animation.",
  options: { hotspot: true, accept: "image/*" },
  fields: [
    altField,
    defineField({ name: "caption", type: "string" }),
    defineField({ name: "credit", type: "string" }),
    defineField({
      name: "night",
      title: "Night version",
      type: "image",
      description: "Optional - shown instead when a visitor has the site in dark mode.",
      options: { hotspot: true, accept: "image/*" },
    }),
    defineField({ name: "fit", type: "string", options: FIT_OPTIONS, initialValue: "cover" }),
    ...sizeFields("column"),
  ],
  preview: {
    select: { title: "caption", subtitle: "alt", media: "asset" },
    prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || "Picture", subtitle: title ? subtitle : "", media }),
  },
});

export const gallery = defineType({
  name: "gallery",
  title: "Gallery",
  description: "A grid of pictures, two to four across.",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "images",
      title: "Pictures",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true, accept: "image/*" },
          fields: [altField, defineField({ name: "caption", type: "string" })],
        }),
      ],
      options: { layout: "grid" },
      validation: (r) => r.min(2).error("A gallery needs at least two pictures."),
    }),
    defineField({
      name: "columns",
      type: "number",
      options: { list: [2, 3, 4], layout: "radio", direction: "horizontal" },
      initialValue: 2,
    }),
    defineField({
      name: "size",
      title: "Width",
      type: "string",
      options: { list: LAYOUT_WIDTHS, layout: "radio", direction: "horizontal" },
      initialValue: "wide",
    }),
    ...shapeFields({ title: "Picture shape", description: "Every picture in the grid gets this shape. Default: square." }),
    defineField({ name: "caption", type: "string" }),
  ],
  preview: {
    select: { images: "images", caption: "caption" },
    prepare: ({ images = [], caption }) => ({
      title: caption || "Gallery",
      subtitle: `${images.length} pictures`,
      media: images[0]?.asset ? images[0] : ImagesIcon,
    }),
  },
});

export const video = defineType({
  name: "video",
  title: "Video",
  description: "Upload a video - with controls, or looping silently.",
  type: "object",
  icon: DocumentVideoIcon,
  fields: [
    defineField({
      name: "file",
      title: "Video file",
      type: "file",
      description: "MP4 (H.264) plays everywhere. WebM and MOV also work in most browsers.",
      options: { accept: "video/mp4,video/webm,video/quicktime,video/*" },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "poster",
      title: "Still picture",
      type: "image",
      description: "Shown before the video plays (and as the card picture when used as a cover).",
      options: { hotspot: true },
    }),
    defineField({
      name: "playback",
      type: "string",
      options: {
        list: [
          { title: "With play controls", value: "controls" },
          { title: "Loop silently, like a GIF", value: "loop" },
        ],
        layout: "radio",
      },
      initialValue: "controls",
    }),
    defineField({ name: "title", title: "Description", type: "string", description: "For screen readers." }),
    defineField({ name: "caption", type: "string" }),
    ...sizeFields("wide"),
  ],
  preview: {
    select: { title: "caption", subtitle: "title", media: "poster" },
    prepare: ({ title, subtitle, media }) => ({ title: title || subtitle || "Video", subtitle: "Video", media: media ?? DocumentVideoIcon }),
  },
});

export const audio = defineType({
  name: "audio",
  title: "Audio",
  description: "A sound file in the site's own player.",
  type: "object",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "file",
      title: "Sound file",
      type: "file",
      description: "MP3 or M4A play everywhere. WAV, OGG, AAC and FLAC also work in most browsers.",
      options: { accept: "audio/mpeg,audio/mp4,audio/x-m4a,audio/wav,audio/ogg,audio/aac,audio/flac,audio/*" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Reader / subtitle", type: "string" }),
    defineField({ name: "artwork", type: "image", options: { hotspot: true } }),
    defineField({ name: "transcript", type: "text", rows: 6, description: "Optional - shown under the player." }),
  ],
  preview: {
    select: { title: "title", subtitle: "subtitle", media: "artwork" },
    prepare: ({ title, subtitle, media }) => ({ title: title || "Audio", subtitle: subtitle || "Audio", media: media ?? PlayIcon }),
  },
});

export const embed = defineType({
  name: "embed",
  title: "Embed",
  description: "YouTube, Vimeo, Spotify, SoundCloud and other links.",
  type: "object",
  icon: LaunchIcon,
  fields: [
    defineField({
      name: "url",
      title: "Link",
      type: "url",
      description: "Paste a YouTube, Vimeo, Spotify, SoundCloud or other embed link.",
      validation: (r) => r.required(),
    }),
    defineField({ name: "title", title: "Description", type: "string", description: "For screen readers." }),
    defineField({ name: "caption", type: "string" }),
    ...sizeFields("wide"),
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({ title: title || "Embed", subtitle, media: LaunchIcon }),
  },
});

export const mediaTypes = [picture, gallery, video, audio, embed];
