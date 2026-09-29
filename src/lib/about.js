/**
 * About page copy (Figma: "About page - Light", 247:122).
 * Timeline entries after 2021 are placeholder copy — Figma only designs the 2021 panel.
 */

export const aboutHero = {
  eyebrow: "Our Philosophy & Sanctuary",
  title: "Quiet Words, Soulful Pages",
  intro: "In an increasingly noisy digital world, STOEN offers an invitation to pause and reconnect with yourself.",
  cta: { label: "Explore our journey", href: "#our-story" },
};

export const aboutStory = {
  title: "Born from a deep reverence for the quiet written word.",
  paragraphs: [
    "What began as a humble bookbinding workbench in a sunlit corner studio has bloomed into a dedicated atelier for mindfulness practitioners, writers, and dreamers around the world.",
    "At Inner Skies, we believe that ink flowing across cotton paper creates a sacred sanctuary. In an era dominated by temporary notifications and glowing screens, holding a physical journal anchor us back to the present moment.",
    "Every item in our collection—from our foil-embossed hardcover diaries to our watercolor sketch journals—is created with intentional weight, tactile elegance, and lay-flat functionality to honor your personal journey.",
  ],
  stats: [
    { value: "100%", label: "Sustainably Sourced" },
    { value: "180°", label: "Flat-Lay Binding" },
    { value: "50k+", label: "Journals Treasured" },
  ],
  card: { title: "The Paper Sanctuary", caption: "Est. 2021 • Handcrafted Atelier" },
  badge: { title: "100% Cotton Rag & Linen", caption: "Archival & Acid-Free" },
};

export const timeline = {
  title: "Evolution of the Atelier",
  description: "From quiet beginnings to meaningful creations. A journey shaped by time, craft, and intention.",
  milestones: [
    {
      id: "2021",
      tab: "2021 - The Spark",
      year: "2021",
      label: "Studio Binding Room",
      title: "A Single Desk in a Sunlit Corner",
      body: "Founded by paper enthusiast Clara Vance, Inner Skies started with a hand-lever paper cutter and a desire to make journals that felt like timeless heirlooms rather than disposable stationery.",
    },
    {
      id: "2022",
      tab: "2022 - The First Journal",
      year: "2022",
      label: "First Edition",
      title: "The First Hand-Bound Journal",
      body: "Two hundred copies, sewn by hand over one long winter. Each was wrapped in linen, numbered, and sent out with a handwritten note to the readers who found us first.",
    },
    {
      id: "2024",
      tab: "2024 - Botanical Collection",
      year: "2024",
      label: "Botanical Collection",
      title: "Pressed Leaves & Watercolour Covers",
      body: "Our first seasonal series paired archival cotton paper with covers painted from pressed botanicals — each one quietly different from the next.",
    },
    {
      id: "present",
      tab: "Present - Global Sanctuary",
      year: "Today",
      label: "Global Sanctuary",
      title: "A Quiet Sanctuary, Everywhere",
      body: "Stoen journals now travel to writers and wanderers around the world — still bound in small batches, still made to be returned to.",
    },
  ],
};

export const pillars = {
  title: "Pillars of Our Craft",
  description: "Designed with uncompromising attention to detail, tactile beauty, and environmental harmony.",
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
      description: "Hand-stitched sections allowing your book to lie completely flat 180 degrees without forcing the spine.",
      icon: "user",
      blob: { left: 5, top: 5, width: 38, height: 38, radius: "10px" },
    },
    {
      title: "Tactile Whispers",
      description: "Custom woven linen covers, subtle metallic foil stamping, and double satin ribbon page markers.",
      icon: "file",
      blob: { left: 7, top: 4, width: 34, height: 40, radius: "9px 9px 14px 9px" },
    },
    {
      title: "Unhurried Intent",
      description: "Crafted in small batch editions to ensure artisanal integrity and zero waste in production.",
      icon: "cookie",
      blob: { left: 4.1, top: 3.7, width: 38.81, height: 40.15, shape: "cookie-blob" },
    },
  ],
};

/** `crop` reproduces each Figma image frame inside the 160px portrait circle. */
export const artisans = {
  title: "Meet Our Artisans",
  description: "The thoughtful designers, paper stitchers, and storytellers who bring Inner Skies to life.",
  people: [
    {
      name: "Clara Vance",
      role: "Founder & Master Bookbinder",
      quote: "Paper is a quiet mirror. It receives your darkest worries and brightest dreams without judgment.",
      image: { src: "/images/about/artisan-clara.png", crop: [201.25, 134.38, -42.08, -3.75] },
    },
    {
      name: "Julian Thorne",
      role: "Paper & Surface Designer",
      quote: "We carefully curate color tones inspired by misty mornings and twilight skies to evoke calmness.",
      image: { src: "/images/about/artisan-julian.png", crop: [126.25, 126.25, -13.13, 0] },
    },
    {
      name: "Elena Rostova",
      role: "Sustainability Director",
      quote: "Every tree used is replenished tenfold, ensuring our creations give back more than they take.",
      image: { src: "/images/about/artisan-elena.png", crop: [279.38, 186.25, -82.29, 0] },
    },
  ],
};
