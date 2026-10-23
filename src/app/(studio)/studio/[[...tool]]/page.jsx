import Studio from "./Studio";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

/** /studio - Sanity Studio for Explore (sign in with your Sanity account). */
export default function StudioPage() {
  return <Studio />;
}
