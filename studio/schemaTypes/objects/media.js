import { DocumentVideoIcon } from "@sanity/icons/DocumentVideo";
import { ImageIcon } from "@sanity/icons/Image";
import { ImagesIcon } from "@sanity/icons/Images";
import { LaunchIcon } from "@sanity/icons/Launch";
import { PlayIcon } from "@sanity/icons/Play";
import { defineArrayMember, defineField, defineType } from "sanity";

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

const SIZE_OPTIONS = {
  list: [
    { title: "Text width", value: "column" },
    { title: "Wide", value: "wide" },
    { title: "Full width", value: "full" },
  ],
  layout: "radio",
  direction: "horizontal",
};

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
    defineField({ name: "size", type: "string", options: SIZE_OPTIONS, initialValue: "column" }),
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
    defineField({ name: "size", type: "string", options: SIZE_OPTIONS, initialValue: "wide" }),
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
  ],
  preview: {
    select: { title: "caption", subtitle: "url" },
    prepare: ({ title, subtitle }) => ({ title: title || "Embed", subtitle, media: LaunchIcon }),
  },
});

export const mediaTypes = [picture, gallery, video, audio, embed];
