/**
 * Contact page copy (Figma: "Contact page - Light", 316:149).
 * FAQ answers are placeholder copy — Figma designs the questions only.
 */

export const contactHero = {
  eyebrow: "Across the silence",
  title: "Connect With Us",
  intro: "Whether you have an order question, want custom monograms, or just wish to share a thought—we are here.",
};

/**
 * `blob` fills each icon's outline (the same treatment as the home Features and About Pillars),
 * so the white shape follows the glyph instead of cropping it.
 */
export const contactChannels = [
  {
    title: "General Inquiries",
    description: "For everyday questions about our journal collections and store policies.",
    icon: "mail",
    blob: { shape: "mail-blob", left: 4, top: 4, width: 40, height: 40 },
    link: { label: "hello@thestoenmind.com", href: "mailto:hello@thestoenmind.com" },
  },
  {
    title: "Bespoke & Gifting",
    description: "Custom foil debossing, corporate editions, and wedding stationery.",
    icon: "book-open",
    blob: { shape: "book-open-blob", left: 4, top: 4, width: 40, height: 40 },
    link: { label: "hello@thestoenmind.com", href: "mailto:hello@thestoenmind.com?subject=Bespoke%20%26%20gifting" },
  },
  {
    title: "Order Support",
    description: "Tracking, deliveries, returns, and journal care inquiries.",
    icon: "shopping-bag",
    blob: { shape: "shopping-bag-blob", left: 4, top: 4, width: 40, height: 40 },
    link: { label: "care@thestoenmind.com", href: "mailto:care@thestoenmind.com" },
  },
  {
    title: "Studio Quarters",
    description: "Kyoto Artisan Quarter & London Paper Binding Studio.",
    icon: "map-pin",
    blob: { shape: "map-pin-blob", left: 4, top: 4, width: 40, height: 40 },
    note: "By appointment only",
  },
];

export const inquiryTopics = [
  "General inquiry",
  "Bespoke & gifting",
  "Order support",
  "Studio visit",
  "Something else",
];

export const contactForm = {
  title: "Send a Message",
  subtitle: "We respond within 24–48 unhurried hours",
};

export const studio = {
  bindingRoom: {
    title: "The Binding Room",
    text: "Visitors are welcome to view paper samples and discuss custom leather & linen bindings by appointment.",
    place: "STOEN Headquarters",
    address: ["42 Paper Mill Lane, Suite 108", "Artisan District, Kyoto 605-0000"],
  },
  hours: {
    title: "Atelier Hours",
    days: "Monday – Friday",
    time: "09:00 AM – 17:00 PM (JST / GMT)",
  },
  communities: {
    title: "Quiet Communities",
    links: [
      { label: "Instagram", href: "https://instagram.com" },
      { label: "Pinterest", href: "https://pinterest.com" },
      { label: "Substack letter", href: "https://substack.com" },
    ],
  },
};

export const faq = {
  title: "Frequently Asked Questions",
  description:
    "Everything you need to know regarding our paper weight, fountain pen care, custom embossing, and eco-pledge.",
  items: [
    {
      question: "Is your journal paper fountain pen friendly and bleed-resistant?",
      answer:
        "Yes. Our 120gsm cotton-rag paper is sized for fountain pens, dip pens and fine liners — ink rests on the surface and dries without feathering or bleeding through. Very wet, broad nibs may leave a gentle shadow on the reverse.",
    },
    {
      question: "How does custom monogramming and bespoke debossing work?",
      answer:
        "Choose monogramming at checkout and add up to three initials or a short word. We foil-deboss it by hand in the studio and email you a proof before anything is stamped. Bespoke orders usually leave us within 7–10 days.",
    },
    {
      question: "What are your international shipping timeframes?",
      answer:
        "We ship worldwide from our Kyoto and London studios. Most parcels arrive within 3–5 working days in the UK and Japan, 5–8 across Europe and North America, and 7–14 elsewhere. Every parcel is tracked.",
    },
    {
      question: "What is STOEN's commitment to environmental sustainability?",
      answer:
        "Our paper is milled from cotton rag and FSC-certified sources, our covers are woven linen, and we bind in small batches so nothing is wasted. For every tree used, we fund the planting of ten more.",
    },
  ],
};
