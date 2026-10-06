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

/**
 * Home "Ways to wander". `images` are swipeable in the card (web copies of Nancy's
 * public/images/products uploads, made Oct 4). No prices yet: add a `price` here when ready.
 * Optional `cta` overrides the button text (default "Explore {title}") and `label` the carousel's name.
 */
export const categories = [
  {
    // Nancy (Oct 6): was JOURNALS. Cover from Drive "Letters From the Universe (Journal).pdf".
    title: "Journal / Workbook - Night",
    cta: "Explore NIGHT",
    description: `Little story worlds to step into, slow down and stay awhile, with space to reflect and discover what your mind has been quietly waiting to say. A familiar character wanders with you, and may just become a friend.`,
    href: "/shop/journals",
    images: [
      {
        src: "/images/products/web/journal-letters-from-the-universe-night.jpg",
        alt: "Letters From the Universe journal cover: a figure reaching for a cloud in a deep navy night sky, titled The Universe Speaks at Night",
        width: 1000,
        height: 1532,
      },
    ],
  },
  {
    // Nancy (Oct 6): was WORKBOOKS. Cover from Drive "The Life I Am Creating (Workbook) JPEG.pdf".
    title: "Journal / Workbook - Day",
    cta: "Explore DAY",
    description: `Story worlds with a character beside you from beginning to end. Each chapter brings things to notice, ideas to sit with, little exercises to try and space for your own reflections, at whatever pace feels right.`,
    href: "/shop/workbooks",
    images: [
      {
        src: "/images/products/web/workbook-life-i-am-creating-day.jpg",
        alt: "The Life I Am Creating workbook cover: a sunlit watercolour path past trees and a duck pond, Workbook - Season 1",
        width: 1000,
        height: 1324,
      },
    ],
  },
  {
    title: "DIARIES",
    description: `Mostly blank pages, with one small surprise tucked inside: a whimsical, wise or simply wandering character with a tiny story to tell, before leaving the rest of the pages, and all their possibility, to you.`,
    href: "/shop/diaries",
    images: [
      {
        src: "/images/products/web/diary-goose.jpg",
        alt: "Diary cover: a goose in a coat leaning on a field fence, in rose ink",
        width: 1054,
        height: 1492,
      },
      {
        src: "/images/products/web/diary-horse.jpg",
        alt: "Diary cover: a horse before a chateau, in plum ink",
        width: 1054,
        height: 1492,
      },
      {
        src: "/images/products/web/diary-aviators.jpg",
        alt: "Diary cover: two aviators beside a vintage plane, in sepia ink",
        width: 1054,
        height: 1492,
      },
      {
        src: "/images/products/web/diary-pagoda.jpg",
        alt: "Diary cover: a pagoda on a misty lake, in soft blue ink",
        width: 1054,
        height: 1492,
      },
    ],
  },
  {
    title: "NOTEBOOKS",
    description: `Little blank spaces made to come along with you: light, easy to carry, and ready for notes, lists, passing thoughts, sudden ideas, little squiggles and whatever else happens to find you along the way.`,
    href: "/shop/books",
    images: [
      {
        src: "/images/products/web/notebook-thoughts-olive.jpg",
        alt: "Thoughts notebook, olive cover with a stone bridge sketch",
        width: 400,
        height: 600,
      },
      {
        src: "/images/products/web/notebook-thoughts-umber.jpg",
        alt: "Thoughts notebook, deep umber cover with a greyhound sketch",
        width: 400,
        height: 600,
      },
      {
        src: "/images/products/web/notebook-thoughts-slate.jpg",
        alt: "Thoughts notebook, slate cover with an elephant sketch",
        width: 400,
        height: 600,
      },
    ],
  },
];

/**
 * Home "What makes these pages feel a little different?".
 * `art` is a watercolour medallion: transparent in light mode, on a cool paper disc in dark mode
 * (made by design/content-source/feature-medallions-cutout.py from Nancy's three uploads).
 */
export const features = [
  {
    title: "Short stories",
    description:
      "Sometimes it is nice to be taken somewhere before you have to find the words yourself. So there are little stories and worlds for you to disappear into, smile at, think about, or simply enjoy for what they are.",
    art: {
      light: "/images/features/short-stories.png",
      dark: "/images/features/short-stories-night.png",
    },
  },
  {
    title: "A quiet companion",
    description:
      "You do not have to wander these pages alone. Meet Rahi, your constant companion - a little like you, and a little like all of us. He has travelled these lands before, and now he is extending a hand so you can wander them together.",
    art: {
      light: "/images/features/companion.png",
      dark: "/images/features/companion-night.png",
    },
  },
  {
    title: "Space to wander",
    description:
      "There is plenty of space for you. For everything you know, everything you are still figuring out, and the thoughts that arrive without needing to become anything at all. Write, wonder, doodle, linger, or simply let your mind explore.",
    art: {
      light: "/images/features/wander.png",
      dark: "/images/features/wander-night.png",
    },
  },
];

/** "Is this for me?" - the three kinds of wanderer in the Articles section. */
export const audiences = [
  {
    title: "If you’ve journalled for years",
    description:
      "There is plenty here to sink into. Layered ideas, thoughtful reflections and little worlds that give your already-familiar practice somewhere new to journey.",
  },
  {
    title: "If you’ve never journalled before",
    description:
      "Lovely. You don’t need to know how. The stories and characters give you somewhere to begin, and the pages gently make room for whatever comes next.",
  },
  {
    title: "If you’re not quite sure",
    description:
      "You might be a wonderfully curious kind of wanderer. Read the stories, meet the characters, scribble a thought or leave a page untouched. There are no rules here, only plenty of lovely ways to make the book your own.",
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
  "A quiet companion for the inner world - journals, workbooks and diaries, made to be returned to.";

export const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

/**
 * Home → About teleprompter ("A Small Story").
 * Source: TSM Website Pdf.pdf (Drive › Website Copy), ABOUT section, Oct 3 2026.
 * Each entry is one block of the prompter. A string is plain copy; an array mixes plain
 * strings with styled runs `{ text, tone }`, matching the emphasis in the PDF:
 *   names     letter-spaced ("Esha & Prachi")
 *   sky       deep sky blue
 *   present   soft warm grey
 *   expansive widely letter-spaced
 *   cloud     misty blue
 * `kind`: "title" (bold italic), "closing" (italic, letter-spaced), `gap: "lg"` adds a pause before it.
 */
/**
 * Home welcome teleprompter: the HOME section of the copy deck (TSM Website Pdf, page 1).
 * Kinds and tones mirror the deck's emphasis (see KINDS / TONES in AboutPrompter.jsx).
 */
export const homeWelcome = {
  blocks: [
    {
      kind: "lead",
      content: "What a wonderful moment for you to have arrived…",
    },
    {
      kind: "italic",
      content:
        "The world will continue perfectly well for a few moments without your attention.",
    },
    { kind: "aside", content: "You may as well stay." },
    { gap: "lg", kind: "title", content: "Perhaps you know the feeling…" },
    {
      content: [
        "You begin the day with every intention of paying ",
        { text: "attention", tone: "small" },
        ".",
      ],
    },
    { content: ["Then come the ", { text: "errands", tone: "large" }, "."] },
    { content: ["The ", { text: "messages", tone: "raised" }, "."] },
    {
      content: [
        "The things that seemed important at the ",
        { text: "time", tone: "narrow" },
        ".",
      ],
    },
    {
      content:
        "And before long, another beautiful day has slipped past unassumingly.",
    },
    {
      kind: "indent",
      content: "I wouldn’t say, ‘wasted’, but unlived in some corners.",
    },
    { gap: "lg", kind: "title", content: "That is why this place exists…" },
    { content: "For thoughts to drift freely." },
    { content: "For questions to form without deadlines." },
    { content: "For the rare pleasure of keeping company with yourself." },
    { kind: "muted", content: "Nothing more ambitious than that." },
  ],
};

export const aboutStory = {
  label: "About",
  blocks: [
    { kind: "title", content: "A Small Story" },
    { content: "Hello." },
    {
      content: [
        "We are ",
        { text: "Esha & Prachi", tone: "names" },
        ", two people who have, in our own curious ways, tried to explore life and the mind’s play in it. And we found so many surprises along the way that we could not stop exploring.",
      ],
    },
    {
      content:
        "The Stoen Mind began with our love for imagination and stories.",
    },
    {
      content:
        "Stories in books, stories people carry, stories we tell ourselves, stories we outgrow, and stories that somehow find us at just the right time.",
    },
    {
      content:
        "Along the way, we found ourselves wandering into philosophy, reflection, curiosity, and all the strange and wonderful places the mind likes to go.",
    },
    {
      content:
        "And the more we explored, the more we realised that the mind is not really a thing to be solved.",
    },
    {
      content: [
        "It is more like a ",
        { text: "sky", tone: "sky" },
        ". Always ",
        { text: "present", tone: "present" },
        " and ",
        { text: "expansive", tone: "expansive" },
        ".",
      ],
    },
    {
      content: [
        "And somewhere within it drifts a ",
        { text: "cloud", tone: "cloud" },
        ". A cloud of thoughts, feelings, imaginings, questions, and countless other things that pass through us.",
      ],
    },
    { content: "Sometimes light and playful." },
    { content: "Sometimes vast and mysterious." },
    { content: "Sometimes full of questions." },
    { content: "Sometimes carrying a storm." },
    { content: "Sometimes taking shapes that seem to mean something." },
    { content: "Sometimes simply floating by." },
    { content: "The Stoen Mind is a space for that cloud." },
    { content: "A place where you can sit beside it for a while." },
    { content: "Observe it." },
    { content: "Wonder about it." },
    { content: "Rest beside it." },
    { content: "Follow where it leads." },
    { content: "Shape it if you wish." },
    { content: "Or let it shape itself." },
    { content: "Or simply rest and let it all be." },
    { kind: "closing", content: "…Now we want you to come along with us." },
    {
      gap: "lg",
      content:
        "So, we created small portals for you to travel into that space.",
    },
    {
      content:
        "Through stories, journals, workbooks, reflections, and other thoughtful things that invite you to explore your own Stoen Mind.",
    },
    {
      content:
        "Things that add a little lightness and spaciousness, and somehow become difficult to part with.",
    },
  ],
};
