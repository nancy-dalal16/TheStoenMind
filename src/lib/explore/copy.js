/**
 * Explore page copy that isn't a post. Placeholder wording by Claude - edit freely.
 * (Once Sanity is in, these could move into an "explorePage" singleton document.)
 */

export const exploreMasthead = {
  title: "Explore",
  intro: "Stories, wanderings and quiet notes from the STOEN mind - to read slowly, and return to.",
};

/** The topic that gets its own tinted band on the front page. */
export const spotlightTopic = "short-stories";

/** Pull-quote band on the front page; links to the story it came from. */
export const frontQuote = {
  text: "The lights are not for me. I am simply allowed to watch - and there is a rest in that I hadn’t known I was missing.",
  slug: "the-harbour-at-the-edge-of-evening",
};

/** "A small picture" - a single drawing with a caption, in the spirit of a magazine's daily cartoon. */
export const smallPicture = {
  label: "A small picture",
  image: {
    alt: "A pagoda on a misty lake beneath a drifting cloud, in soft blue ink",
    fit: "contain",
    light: { src: "/images/products/web/diary-pagoda.jpg", width: 1054, height: 1492 },
    dark: null,
  },
  caption: "“I’ve decided the mist isn’t hiding anything. It’s just keeping things soft until we’re ready.”",
  credit: "From the Diaries · the Pagoda",
};

export const newsletter = {
  eyebrow: "Letters, now and then",
  title: "A slow letter for your inbox",
  text: "New stories, a prompt or two and the occasional painting - once a month, never more.",
  success: "Thank you. Your first letter will find its way to you soon.",
};

export const exploreLabels = {
  latest: "The latest",
  picks: "Worth lingering over",
  readNext: "Keep wandering",
  seeAll: "See all",
};
