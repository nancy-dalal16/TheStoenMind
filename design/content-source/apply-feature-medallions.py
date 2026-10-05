"""Swap the Features line icons for the watercolour medallions (run from the project root)."""
import re

# 1. content.js — icon/blob -> art
p = "src/lib/content.js"
s = open(p).read()
start = s.index("export const features = [")
end = s.index("];", start) + 2
block = s[start:end]
arts = {
    "Short stories": "short-stories",
    "A quiet companion": "companion",
    "Space to wander": "wander",
}
for title, slug in arts.items():
    i = block.index(f'title: "{title}"')
    j = block.index("icon:", i)
    k = block.index("\n  },", j)  # end of this item
    art = (
        f'art: {{ light: "/images/features/{slug}.png", dark: "/images/features/{slug}-night.png" }},'
    )
    block = block[:j] + art + block[k:]
block = block.replace(
    "export const features = [",
    "/**\n * Home \"What makes these pages feel a little different?\".\n"
    " * `art` is a watercolour medallion: transparent in light mode, on a cool paper disc in dark mode\n"
    " * (made by design/content-source/feature-medallions-cutout.py from Nancy's three uploads).\n */\n"
    "export const features = [",
)
s = s[:start] + block + s[end:]
open(p, "w").write(s)

# 2. Features.jsx — IconHalo -> medallion Artwork
p = "src/components/home/Features.jsx"
s = open(p).read()
s = s.replace('import IconHalo from "@/components/ui/IconHalo";\n', "")
old = """              className="hover-group hover-lift flex flex-col items-center px-0 text-center sm:px-6"
            >
              <IconHalo icon={feature.icon} blob={feature.blob} />
"""
new = """              className="hover-group hover-lift flex flex-col items-center gap-6 px-0 text-center sm:px-6"
            >
              {/* Watercolour medallion: blooms in with the reveal, tilts and lifts on hover (globals.css → "Feature medallions") */}
              <div data-part="bloom" className="medallion">
                <Artwork
                  className="medallion-art absolute inset-0"
                  light={{ src: feature.art.light }}
                  dark={{ src: feature.art.dark }}
                  sizes="(min-width: 1024px) 220px, 184px"
                />
              </div>
"""
assert old in s, "Features li markup changed"
s = s.replace(old, new)
open(p, "w").write(s)

# 3. globals.css — medallion classes
p = "src/app/globals.css"
s = open(p).read()
if "Feature medallions" not in s:
    s += """
/* ─────────────────────────────────────────────────────────────
 *  Feature medallions (home → Features)
 *  Nancy's three watercolour roundels replace the line icons.
 *  Light: transparent PNGs, so the ring floats on the page and the
 *  mist behind it. Dark: the same art on a cool paper disc
 *  (#EEF4F7), echoing the white icon blobs, with a soft shadow.
 *  The wrapper blooms in via [data-part="bloom"]; on hover the art
 *  tilts and lifts (transform, so it never fights the reveal's
 *  scale/rotate).
 * ───────────────────────────────────────────────────────────── */

.medallion {
  position: relative;
  flex-shrink: 0;
  width: clamp(168px, 46vw, 184px);
  aspect-ratio: 1;
}
@media (min-width: 64rem) {
  .medallion { width: clamp(184px, 14cqw, 220px); }
}
.medallion-art {
  transition: transform 1.1s var(--ease-soft), filter 0.8s ease;
}
[data-theme="dark"] .medallion-art {
  filter: drop-shadow(0 14px 22px rgb(0 18 34 / 0.32));
}

@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
  .hover-group:hover .medallion-art {
    transform: translateY(-4px) rotate(-3deg) scale(1.035);
  }
  [data-theme="dark"] .hover-group:hover .medallion-art {
    filter: drop-shadow(0 20px 28px rgb(0 18 34 / 0.38));
  }
}
"""
open(p, "w").write(s)
print("patched")
