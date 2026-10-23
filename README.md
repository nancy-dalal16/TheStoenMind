# the STOEN mind — website

Next.js 16 (App Router, JavaScript) + Tailwind CSS v4, built from the Figma file
**the-STOEN-mind-website** (frames *Home page - Light* and *Home page - dark*).

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
npm run lint
```

## Project layout

```
src/
  app/
    layout.jsx          fonts, theme bootstrap, header/footer shell
    page.jsx            homepage — composes the sections below
    globals.css         design tokens (light + dark) and Tailwind theme
    fonts/              self-hosted Abhaya Libre + Inter (OFL)
  components/
    home/               Hero, Welcome, Categories, Features, Articles, Promo, GiftBand
    layout/             Header (sticky), StickyHeader, SiteMenu (slide-in nav), Footer
    theme/              ThemeProvider, themeStore, ThemeToggle, InlineScript
    motion/             RevealObserver (scroll reveals)
    ui/                 Button, Icon, Artwork, ParallaxLayer, Glow, Logo, Container
  lib/
    content.js          nav, cards, features, articles, footer links (swap for a CMS later)
    theme.js            storage key + pre-paint theme script
public/images/
  shared/               used in both themes (logo, product photos, promo)
  light/  dark/         theme-specific illustrations
  icons/                monochrome SVGs, tinted via CSS
design/                 Figma reference renders (not shipped)
```

## How theming works

**1 · Tokens, not hex values.** `globals.css` defines semantic tokens — `--bg`, `--fg`,
`--fg-muted`, `--primary`, `--band`, `--divider`, `--icon`… — with light values on `:root`
and dark values on `[data-theme="dark"]`. `@theme inline` exposes them as Tailwind
utilities (`bg-bg`, `text-fg`, `bg-band`, `divide-divider`…). Components use only these,
so they switch themes with no extra classes. To restyle a mode, edit the tokens.

**2 · `dark:` only for swaps.** The custom `dark` variant targets `[data-theme="dark"]`.
Use it only when the *content* changes, e.g. an illustration:

```jsx
<Artwork
  className="absolute bottom-0 left-0 aspect-[1440/503] w-full"
  light={{ src: "/images/light/mist-b.png" }}
  dark={{ src: "/images/dark/features-mist.png", opacity: 0.62 }}
/>
```

Only the active theme's image is displayed. Images are lazy, so the other one is never
downloaded.

**3 · Icons follow `currentColor`.** `<Icon name="notebook" className="text-icon" />`
renders the Figma SVG as a CSS mask, so one file works in every theme.

**4 · No flash, no hydration mismatch.** An inline script in `<head>` sets
`data-theme` before first paint: the stored choice first, otherwise the OS setting. The server markup doesn't depend on the theme.
`themeStore.js` keeps `<html>`, `localStorage` and the OS preference in sync, including
live OS changes and other open tabs. When `document.startViewTransition` is available,
the theme cross-fades.

```jsx
"use client";
import { useTheme } from "@/components/theme/ThemeProvider";
const { theme, isExplicit, setTheme, toggleTheme, resetTheme } = useTheme();
```

`theme` is `null` during SSR. Styling should use tokens or `dark:`, not this hook.

## Hero landscape (parallax reveal)

The hero copy sits on a plain background. The landscape starts just under the button,
where it is in Figma, and extends down into the Welcome section. It is wrapped in
`ui/ParallaxLayer`, so while you scroll it moves about 30% slower than the page. The
painting is revealed gradually and settles 8% of its width lower. `Welcome` leaves
enough top padding (`0.41 × --land-w`) for the whole painting to be visible before the
card arrives. The effect is turned off when the visitor has reduced motion enabled.

To tune it:

- **Drift:** change `speed` and `maxShift` on the `ParallaxLayer` in `Hero.jsx`.
- **Card position:** if you change `maxShift`, update the matching padding in `Welcome.jsx`.
- **Phones:** the painting is at least 560px wide and anchored to the left, so the tree and carriage stay in frame.

## Motion

The motion styles live in `globals.css` under **Motion**. Every animation is skipped when the visitor has reduced motion turned on, and all content still shows without JavaScript.

- **Entrance (on load):** the header drops in. Then the eyebrow, heading, text and button of the hero rise in one after another; the heading also sharpens from a soft blur. The landscape then rises in, and the cloud drifts in from the right and keeps floating gently. These use Tailwind animation utilities, for example `motion-safe:animate-rise-in motion-safe:[animation-delay:360ms]`.
- **Scroll reveals:** add `data-reveal` to a block, and `<RevealObserver />` (one IntersectionObserver for the whole page) reveals it once, as it scrolls into view.
  - **Variants:** `""` fades up (the default); the others are `fade`, `left`, `right` and `zoom`.
  - **Stagger:** set `style={{ "--i": n }}` on each item for steps of 110ms. `--delay` and `--reveal-dur` fine-tune the timing.
  - **Child effects:** children can animate with their block through `data-part`:
    - `blur`: a heading sharpens.
    - `rise`: lines rise in turn, staggered by `--j`.
    - `img`: a photo settles from a slight zoom.
    - `bloom`: an icon's watercolour halo opens.
    - `line`: a divider draws in from the left.
- **Hover:** buttons lift slightly and gain a soft shadow, and the category photos zoom in gently.

Avoid putting `data-reveal` on an element that already uses Tailwind `translate` or `scale` classes; wrap it in another element instead.

## Explore (blog) and the Studio

`/explore` is a magazine-style journal: a front page (lead story, briefs, "worth lingering over",
the latest river, a spotlight band, a pull quote and topic rails), story pages at
`/explore/[slug]` and topic pages at `/explore/topic/[topic]`. Its content is edited in
**Sanity Studio at `/studio`** (sign in with the Sanity account; project `thestoenmind`,
id `wlwey37b`, dataset `production`).

- **Routes are split into two route groups** so the Studio has none of the site's chrome:
  `src/app/(site)/…` (header, footer, theme switch, sound, reveals) and
  `src/app/(studio)/studio/[[...tool]]` (its own bare root layout, always light).
  `(site)/[...missing]` + `(site)/not-found.jsx` keep the branded 404 for unknown addresses.
- **Studio code** lives in `/studio` (not `/sanity` - with `baseUrl: "."` a local `sanity/`
  folder would shadow the `sanity` package):
  - `schemaTypes/` - Explore page (one document with every heading, label and switch), Story,
    Topic, Author, the story body, and media types (picture incl. animated GIF/SVG with a night
    version, gallery, video file, audio file, YouTube/Vimeo/Spotify/SoundCloud embed).
  - `structure.js` - the left-hand menu (Explore page, Stories → all / by topic / lead & picks /
    scheduled, Topics, Authors) and the "Page" tab that shows the live page beside the form.
  - `components/HomeTool.jsx` - the Home dashboard; `theme.js` - brand colours; `env.js`.
  - `sanity.config.js` / `sanity.cli.js` at the project root.
  - Plugins: Media library (`sanity-plugin-media`) and Query (Vision).
- **Data:** `src/lib/explore/posts.js` is the only door the pages use. With
  `NEXT_PUBLIC_SANITY_PROJECT_ID` set it reads Sanity (`sanity.js`, plain `fetch` to the GROQ
  API) and falls back to the demo journal (`demo.js`) if Sanity errors; without it, it shows the
  demo. `getExplorePage()` merges the Studio's Explore page with the defaults in `copy.js` (any
  field left empty uses the default). Pages refresh every 60 seconds.
- **Media on the site:** `components/explore/StoryMedia.jsx` + `MediaPlayers.jsx` - pictures
  (GIF/SVG skip the image optimiser so they stay animated/vector), galleries, video (with
  controls, or looping silently like a GIF; paused for reduced motion), the site's own audio
  player (pauses the background sound when it starts), and embeds.
- **Demo content in Sanity:** `npm run seed:explore` (= `npx sanity exec
  studio/seed/seed-explore.mjs --with-user-token`) uploads the demo stories and their pictures.
  Re-running overwrites those demo documents.
- **CORS:** the Studio only works from origins listed in sanity.io/manage → API → CORS
  (`http://localhost:3000` is added). Add the live domain, with credentials, before launch.
- **Newsletter:** the sign-up posts to `/api/newsletter`; set `NEWSLETTER_WEBHOOK_URL` to forward
  addresses to your mailing list. Until then they are only logged.

## Adding a page

Create `src/app/<route>/page.jsx`. Header, footer and theming come from the root layout.
Reuse `Container`, `Button`, `SectionHeading`, `Artwork` and the `text-display`,
`text-heading`, `text-title`, `text-lead`, `text-body-lg` and `text-body` type utilities.

## Notes from the Figma file

- "Begin Shoppping" is spelled "Begin Shopping" in the code.
- The fourth feature ("Short stories") repeats the first one's copy. This is placeholder text from Figma, so it's flagged in `content.js`.
- The Workbooks image tile had a 26px radius and the others 16px. All four use 16px.
- The footer divider in Figma is set to 0% opacity, so it isn't rendered. The spacing is kept.
- Linked routes (`/about`, `/shop/...`, `/policies/...`) are placeholders until those pages are built.
