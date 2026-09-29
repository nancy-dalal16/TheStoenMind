/**
 * Site copy & navigation in one place, so new pages (and a future CMS)
 * can reuse it without touching component markup.
 */

export const mainNav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Explore", href: "/explore" },
  { label: "Shop", href: "/shop" },
];

export const categories = [
  {
    title: "Journals",
    description: "Story-led worlds to sink into, chapter by chapter, at whatever pace feels right.",
    href: "/shop/journals",
    image: "/images/shared/journals.png",
  },
  {
    title: "Workbooks",
    description: "Nuanced prompts and reflections, gently tied to a theme you choose to sit with.",
    href: "/shop/workbooks",
    image: "/images/shared/workbooks.png",
  },
  {
    title: "Diaries",
    description: "An unhurried place to keep time — for the days worth remembering quietly.",
    href: "/shop/diaries",
    image: "/images/shared/diaries.png",
  },
  {
    title: "Books",
    description: "For the pleasure of a real book in your hands — to read, keep, and return to.",
    href: "/shop/books",
    image: "/images/shared/books.png",
  },
];

/** `blob` is the soft shape behind each icon, positioned inside the 48px icon box. */
export const features = [
  {
    title: "Short stories",
    description:
      "Each book carries you into its own imaginary world — with a new concept, cast and pace, unfolding gently from one chapter to the next.",
    icon: "notebook",
    blob: { left: 8, top: 4, width: 35, height: 40, radius: "9px" },
  },
  {
    title: "A quiet companion",
    description:
      "A recurring character meets you in every book, offering a little clarity when you want it. Beyond that, each prompt is yours to wander through.",
    icon: "user",
    blob: { left: 5, top: 5, width: 38, height: 38, radius: "10px" },
  },
  {
    title: "Space to wander",
    description:
      "Spacious pages to write, doodle, make lists, or simply leave blank. There's no mandate to reflect, improve, or arrive anywhere.",
    icon: "file",
    blob: { left: 7, top: 4, width: 34, height: 40, radius: "9px 9px 14px 9px" },
  },
  {
    // NOTE: duplicated title/copy is as supplied in the Figma file — replace when final copy lands.
    title: "Short stories",
    description:
      "Each book carries you into its own imaginary world — with a new concept, cast and pace, unfolding gently from one chapter to the next.",
    icon: "cookie",
    blob: { left: 4.1, top: 3.7, width: 38.81, height: 40.15, shape: "cookie-blob" },
  },
];

export const articles = [
  {
    title: "On keeping a book that has no rules",
    description: "Why a Stoen journal is never late, never behind, and never needs finishing.",
    href: "/explore/a-book-with-no-rules",
  },
  {
    title: "The companions who live in the margins",
    description: "Meet the recurring characters who quietly walk beside every Stoen story.",
    href: "/explore/companions-in-the-margins",
  },
  {
    title: "A short audio for slow evenings",
    description: "Ten unhurried minutes to sit with, whenever your day needs a softer close.",
    href: "/explore/audio-for-slow-evenings",
  },
];

export const footerColumns = [
  {
    heading: "Find your way",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Shop", href: "/shop" },
      { label: "Explore", href: "/explore" },
    ],
  },
  {
    heading: "Policies",
    links: [
      { label: "Privacy policy", href: "/policies/privacy" },
      { label: "Security policy", href: "/policies/security" },
      { label: "Terms of sale", href: "/policies/terms-of-sale" },
      { label: "Returns and refund", href: "/policies/returns" },
    ],
  },
  {
    heading: "Customer Service",
    links: [
      { label: "Contact us", href: "/contact" },
      { label: "Frequently asked questions", href: "/faq" },
      { label: "Gift cards", href: "/gift-cards" },
      { label: "Gift packaging", href: "/gift-packaging" },
    ],
  },
];

export const brandTagline =
  "A quiet companion for the inner world — journals, workbooks and diaries, made to be returned to.";

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];
