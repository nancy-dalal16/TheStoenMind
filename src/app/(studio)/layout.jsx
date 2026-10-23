import localFont from "next/font/local";

/**
 * The Studio's own root layout: no site header, footer, theme switcher, sound or scroll
 * effects - just the Studio, always in its light scheme.
 */
const inter = localFont({
  src: "../fonts/Inter-Variable.woff2",
  weight: "100 900",
  display: "swap",
  variable: "--font-inter",
});

// Story titles on the Stories screen use the site's serif
const abhaya = localFont({
  src: "../fonts/AbhayaLibre-Regular.woff2",
  weight: "400",
  display: "swap",
  variable: "--font-abhaya",
});

export const metadata = {
  title: "Studio · the STOEN mind",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${abhaya.variable}`} style={{ colorScheme: "light" }}>
      <body style={{ margin: 0, background: "#ffffff" }}>{children}</body>
    </html>
  );
}
