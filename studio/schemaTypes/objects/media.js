import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { LaunchIcon } from "@sanity/icons/Launch";
import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";
import { isFixedSize, MEDIA_ALIGNS, MEDIA_SIZE_LIST } from "../../../src/lib/explore/editorOptions";

/*
 * Media building blocks used by stories and the Explore page.
 *   picture  - image (JPG, PNG, WebP, AVIF, SVG and animated GIF) with an optional night version
 *   gallery  - several pictures in a grid
 *   video    - an uploaded video file (MP4 / WebM / MOV) or GIF-style looping clip
 *   audio    - an uploaded sound file (MP3, WAV, M4A, OGG, AAC, FLAC)
 *   embed    - YouTube, Vimeo, Spotify, SoundCloud or any embeddable link
 */

export const FIT_OPTIONS = {
  list: [
    { title: "Fill the frame", value: "cover" },
    { title: "Float on a soft background", value: "contain" },
  ],
  layout: "radio",
  direction: "horizontal",
};

/** Story covers, cover videos and featured images fill their own frames, so they don't show the size options. */
const isCoverPath = (path = []) => ["cover", "featuredImage", "coverVideo"].includes(path[0]);

/**
 * Size options for pictures, GIFs, videos and embeds: fixed frames from 200 × 200 px up, the
 * layout widths (text width / wide / full) or a custom width × height, plus where a smaller
 * frame sits (left, centre, right, or with the text flowing around it).
 */
export function sizeFields(initialSize = "column") {
  return [
    defineField({
      name: "size",
      type: "string",
      description: "Fixed sizes shrink to fit on small phones.",
      options: { list: MEDIA_SIZE_LIST },
      initialValue: initialSize,
      hidden: ({ path }) => isCoverPath(path),
    }),
    defineField({
      name: "customWidth",
      title: "Width (px)",
      type: "number",
      hidden: ({ parent, path }) => parent?.size !== "custom" || isCoverPath(path),
      validation: (r) =>
        r.custom((value, { parent }) => (parent?.size === "custom" && !value ? "Enter a width for the custom size." : true)).integer().min(40).max(2400),
    }),
    defineField({
      name: "customHeight",
      title: "Height (px)",
      type: "number",
      description: "Leave empty to keep the picture's own shape.",
      hidden: ({ parent, path }) => parent?.size !== "custom" || isCoverPath(path),
      validation: (r) => r.integer().min(40).max(2400),
    }),
    defineField({
      name: "align",
      title: "Position",
      type: "string",
      options: { list: MEDIA_ALIGNS },
      initialValue: "center",
      hidden: ({ parent, path }) => !isFixedSize(parent?.size) || isCoverPath(path),
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
