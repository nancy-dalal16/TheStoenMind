/**
 * Inline <script> that runs during HTML parsing (before first paint).
 * On the client it becomes `text/plain`, which stops React warning about
 * rendering script tags; `suppressHydrationWarning` covers the type swap.
 * See node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md
 */
export default function InlineScript({ html }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
