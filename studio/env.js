/**
 * Sanity project settings, shared by the Studio (/studio), the CLI and the site.
 * NEXT_PUBLIC_ so the Studio (a client app) can read them; the defaults are the
 * "thestoenmind" project, so the Studio works even before .env.local is filled in.
 */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || "wlwey37b";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-02-19";

/** Documents that exist exactly once (no "create new", no delete/duplicate). */
export const SINGLETONS = new Set(["explorePage"]);
