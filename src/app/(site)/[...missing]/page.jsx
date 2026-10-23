import { notFound } from "next/navigation";

/**
 * Any address that doesn't match a page lands here and shows the site's 404 (with the header
 * and footer). Needed because the site and the Studio have separate root layouts.
 */
export default function Missing() {
  notFound();
}
