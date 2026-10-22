/**
 * About page copy (Figma: "About page - Light", 247:122).
 * Timeline entries after 2021 are placeholder copy - Figma only designs the 2021 panel.
 */

export const aboutHero = {
  eyebrow: "Our Philosophy & Sanctuary",
  title: "Our Philosophy & Sanctuary",
  intro:
    "In an increasingly noisy world, STOEN offers a space to rest and reconnect with yourself.",
  cta: { label: "Explore our journey", href: "#about-story" },
};

export const aboutStory = {
  title: "Born from a deep reverence for the quiet written word.",
  paragraphs: [
    "What began as a humble bookbinding workbench in a sunlit corner studio has bloomed into a dedicated atelier for mindfulness practitioners, writers, and dreamers around the world.",
    "At Inner Skies, we believe that ink flowing across cotton paper creates a sacred sanctuary. In an era dominated by temporary notifications and glowing screens, holding a physical journal anchor us back to the present moment.",
    "Every item in our collection - from our foil-embossed hardcover diaries to our watercolor sketch journals - is created with intentional weight, tactile elegance, and lay-flat functionality to honor your personal journey.",
  ],
  stats: [
    { value: "100%", label: "Sustainably Sourced" },
    { value: "180°", label: "Flat-Lay Binding" },
    { value: "50k+", label: "Journals Treasured" },
  ],
  card: {
    title: "The Paper Sanctuary",
    caption: "Est. 2021 • Handcrafted Atelier",
  },
  badge: { title: "100% Cotton Rag & Linen", caption: "Archival & Acid-Free" },
};

export const timeline = {
  // Copy deck (Nancy, Oct 21): "Atelier" - four years, each body is a list of paragraphs.
  title: "Atelier",
  description:
    "From quiet beginnings to meaningful creations. A journey shaped by time, craft, and intention.",
  milestones: [
    {
      id: "2023",
      tab: "2023 — The Spark",
      year: "2023",
      label: "The Spark",
      body: [
        "It started with a single desk, a small computer, and a window that opened to a wide sky. The changing light brought with it ombre thoughts and little dreams. These grew amid beautiful company and well-wishers.",
        "And the beginning of something we could only imagine.",
      ],
    },
    {
      id: "2024",
      tab: "2024 — A Marché of Thoughts",
      year: "2024",
      label: "A Marché of Thoughts",
      body: [
        "The world became a marché of sorts.",
        "So much to see, to notice and gather. Little trinkets of conversation came together as thoughts, thoughts then convened into ideas.",
        "A year of looking, listening, and letting the world find its way in.",
      ],
    },
    {
      id: "2025",
      tab: "2025 — Chasing Fireflies",
      year: "2025",
      label: "Chasing Fireflies",
      body: [
        "Work, work, work.",
        "And chasing fireflies of thoughts and words, trying to catch them, to make sense of their little formations, to let them find their way onto pages.",
        "“And oh,” my mind said, “look! They are beginning to make worlds.”",
        "From things imagined, observed, learnt, and from the beautiful minds all around us. Little by little, these worlds begin to take shape, becoming places we can almost step into.",
      ],
    },
    {
      id: "2026",
      tab: "2026 — Finding Their Form",
      year: "2026",
      label: "Finding Their Form",
      body: [
        "More work. More ideating, trimming, pruning, shaping.",
        "The fireflies are slowly settling onto pages, and the worlds are finding their form for each of you wonderful souls who have called for them to come to life.",
        "So we keep at it, giving each thought a little more room and a little more shape.",
        "Until it feels like yours and ours.",
      ],
    },
  ],
};

export const pillars = {
  title: "Pillars of Our Craft",
  description:
    "Designed with uncompromising attention to detail, tactile beauty, and environmental harmony.",
  items: [
    {
      title: "Earth-Honored Paper",
      description:
        "Archival quality, fountain-pen friendly 120gsm GSM paper milled responsibly with zero bleed-through.",
      icon: "notebook",
      blob: { left: 8, top: 4, width: 35, height: 40, radius: "9px" },
    },
    {
      title: "Smyth-Sewn Binding",
      description:
        "Hand-stitched sections allowing your book to lie completely flat 180 degrees without forcing the spine.",
      icon: "user",
      blob: { left: 5, top: 5, width: 38, height: 38, radius: "10px" },
    },
    {
      title: "Tactile Whispers",
      description:
        "Custom woven linen covers, subtle metallic foil stamping, and double satin ribbon page markers.",
      icon: "file",
      blob: {
        left: 7,
        top: 4,
        width: 34,
        height: 40,
        radius: "9px 9px 14px 9px",
      },
    },
    {
      title: "Unhurried Intent",
      description:
        "Crafted in small batch editions to ensure artisanal integrity and zero waste in production.",
      icon: "cookie",
      blob: {
        left: 4.1,
        top: 3.7,
        width: 38.81,
        height: 40.15,
        shape: "cookie-blob",
      },
    },
  ],
};

/** `crop` reproduces each Figma image frame inside the 160px portrait circle. */
export const artisans = {
  title: "Meet Our Artisans",
  description:
    "The thoughtful designers, paper stitchers, and storytellers who bring Inner Skies to life.",
  people: [
    {
      name: "Clara Vance",
      role: "Founder & Master Bookbinder",
      quote:
        "Paper is a quiet mirror. It receives your darkest worries and brightest dreams without judgment.",
      image: {
        src: "/images/about/artisan-clara.png",
        crop: [201.25, 134.38, -42.08, -3.75],
      },
    },
    {
      name: "Julian Thorne",
      role: "Paper & Surface Designer",
      quote:
        "We carefully curate color tones inspired by misty mornings and twilight skies to evoke calmness.",
      image: {
        src: "/images/about/artisan-julian.png",
        crop: [126.25, 126.25, -13.13, 0],
      },
    },
    {
      name: "Elena Rostova",
      role: "Sustainability Director",
      quote:
        "Every tree used is replenished tenfold, ensuring our creations give back more than they take.",
      image: {
        src: "/images/about/artisan-elena.png",
        crop: [279.38, 186.25, -82.29, 0],
      },
    },
  ],
};
