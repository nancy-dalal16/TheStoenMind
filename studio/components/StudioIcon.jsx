/**
 * The Studio's badge (top-left of the Studio and on the sign-in card): the brand cloud on a
 * Vanilla Mist tile, like a small app icon.
 */
export default function StudioIcon() {
  return (
    <span
      style={{
        display: "grid",
        placeItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: 6,
        background: "linear-gradient(135deg, #f4f0e3 0%, #e0eaeb 100%)",
        boxShadow: "inset 0 0 0 1px rgb(0 0 0 / 0.06)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/shared/logo-cloud.svg" alt="" width={22} height={13} style={{ display: "block", width: "74%", height: "auto" }} />
    </span>
  );
}
