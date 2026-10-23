"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../../sanity.config";

/** `scheme="light"` fixes the Studio to its light scheme and hides the appearance switch. */
export default function Studio() {
  return <NextStudio config={config} scheme="light" />;
}
