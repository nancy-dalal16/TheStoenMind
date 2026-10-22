/**
 * Explore schema for Sanity Studio. Copy this folder into your Studio project and add:
 *
 *   // sanity.config.js
 *   import { schemaTypes } from "./schemaTypes";
 *   export default defineConfig({ ..., schema: { types: schemaTypes } });
 *
 * Not imported by the Next.js site (it reads Sanity over HTTP - see src/lib/explore/sanity.js).
 */
import author from "./author";
import blockContent from "./blockContent";
import post from "./post";
import topic from "./topic";

export const schemaTypes = [post, topic, author, blockContent];
