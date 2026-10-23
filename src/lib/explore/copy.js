/**
 * Defaults for every heading, label and switch on the Explore pages. The Studio's
 * "Explore page" document overrides any of them; whatever is left empty there falls back to
 * these. In demo mode (no Sanity) the site uses these as they are.
 *
 * Shape = what getExplorePage() returns (lib/explore/posts.js).
 */
export const defaultExplorePage = {
  eyebrow: "wordmark", // "wordmark" | "text" | "none"
  eyebrowText: "",
  title: "Explore",
  intro: "Stories, wanderings and quiet notes from the STOEN mind - to read slowly, and return to.",
  showMeta: true,
  allStoriesLabel: "All stories",

  leadSlug: null, // a story chosen as the lead (else the newest "Lead story", else the newest)
  latestTitle: "The latest",
  latestCount: 6,
  picksTitle: "Worth lingering over",
  pickSlugs: [], // chosen stories for the numbered list (else editors' picks)
  showSpotlight: true,
  spotlightTopic: "short-stories",
  showQuote: true,
  quoteText:
    "The lights are not for me. I am simply allowed to watch - and there is a rest in that I hadn’t known I was missing.",
  quoteSlug: "the-harbour-at-the-edge-of-evening",
  showTopicRails: true,
  showGiftBand: true,
  emptyFront: "The first stories are on their way.",

  smallPicture: {
    show: true,
    label: "A small picture",
    image: {
      alt: "A pagoda on a misty lake beneath a drifting cloud, in soft blue ink",
      fit: "contain",
      light: { src: "/images/products/web/diary-pagoda.jpg", width: 1054, height: 1492 },
      dark: null,
    },
    caption: "“I’ve decided the mist isn’t hiding anything. It’s just keeping things soft until we’re ready.”",
    credit: "From the Diaries · the Pagoda",
  },

  newsletter: {
    show: true,
    eyebrow: "Letters, now and then",
    title: "A slow letter for your inbox",
    text: "New stories, a prompt or two and the occasional painting - once a month, never more.",
    placeholder: "you@example.com",
    button: "Sign me up",
    success: "Thank you. Your first letter will find its way to you soon.",
  },

  labels: {
    seeAll: "See all",
    readNextTitle: "Keep wandering",
    readNextLink: "All stories",
    share: "Share this story",
    copied: "Link copied",
    moreFrom: "More",
    by: "By",
    minRead: "min read",
    emptyTopic: "Nothing here just yet",
    emptyTopicText: "New stories are on their way. In the meantime, the rest of Explore is open.",
  },

  // Extra sections added in the Studio (Explore page → Extra sections)
  sections: [],

  seo: {
    title: "Explore",
    description: "Stories, wanderings and quiet notes from the STOEN mind - to read slowly, and return to.",
    image: null,
  },
};
