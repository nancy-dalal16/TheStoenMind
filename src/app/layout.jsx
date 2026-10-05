import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import InlineScript from "@/components/theme/InlineScript";
import RevealObserver from "@/components/motion/RevealObserver";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

// Self-hosted (SIL Open Font License) so builds never depend on network access.
const abhaya = localFont({
  src: [
    { path: "./fonts/AbhayaLibre-Regular.woff2", weight: "400", style: "normal" },
    // Bold is used for figures (About page stats)
    { path: "./fonts/AbhayaLibre-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-abhaya",
  fallback: ["Georgia", "serif"],
});

const inter = localFont({
  src: "./fonts/Inter-Variable.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
  fallback: ["ui-sans-serif", "system-ui", "sans-serif"],
});

export const metadata = {
  metadataBase: new URL("https://thestoenmind.com"),
  title: {
    default: "the STOEN mind — journals, workbooks & diaries",
    template: "%s · the STOEN mind",
  },
  description:
    "Journals, workbooks and diaries for the mind that wants to wander slowly — no deadlines, no self-improvement checklist. Just space.",
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#03446a" },
  ],
};

export default function RootLayout({ children }) {
  return (
    // data-theme is set before paint by themeInitScript; the server can't know it.
    <html lang="en" className={`${abhaya.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <InlineScript html={themeInitScript} />
        {/* Scroll reveals start hidden; without JavaScript, show everything. */}
        <noscript>
          <style>{`[data-reveal],[data-reveal] [data-part]{opacity:1!important;translate:none!important;scale:none!important;rotate:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <ThemeProvider>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-ui focus:bg-inverse focus:px-4 focus:py-2 focus:font-sans focus:text-on-inverse"
          >
            Skip to content
          </a>
          <Header />
          {/* `isolate` lets decorative glows sit at -z-10 behind all content */}
          <main id="main" className="relative isolate overflow-x-clip">
            {children}
          </main>
          <Footer />
          <RevealObserver />
        </ThemeProvider>
      </body>
    </html>
  );
}
