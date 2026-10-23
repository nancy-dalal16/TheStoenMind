"use client";

/**
 * Sanity Studio for the Explore pages, served by this Next.js app at /studio.
 * Schema, menu, theme and the Stories screen live in /studio.
 */
import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { media } from "sanity-plugin-media";
import { structureTool } from "sanity/structure";
import { BookIcon } from "@sanity/icons/Book";
import { HomeIcon } from "@sanity/icons/Home";
import ExplorePageTool from "./studio/components/ExplorePageTool";
import { storiesTool } from "./studio/components/StoriesTool";
import StudioIcon from "./studio/components/StudioIcon";
import { apiVersion, dataset, projectId, SINGLETONS } from "./studio/env";
import { schemaTypes } from "./studio/schemaTypes";
import { defaultDocumentNode, structure } from "./studio/structure";
import { studioTheme } from "./studio/theme";

// Singletons can only be edited and published - never created again, duplicated or deleted.
const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

export default defineConfig({
  name: "stoen",
  title: "the STOEN mind",
  icon: StudioIcon,
  basePath: "/studio",
  projectId,
  dataset,
  theme: studioTheme,

  plugins: [
    storiesTool(),
    structureTool({ name: "content", title: "Content", icon: BookIcon, structure, defaultDocumentNode }),
    media(),
    // The GROQ playground is for development only
    ...(process.env.NODE_ENV === "development" ? [visionTool({ title: "Query", defaultApiVersion: apiVersion })] : []),
  ],

  // Tabs in order: Stories, Explore page, Content, Media (+ Query in development). Links that
  // open a document ("edit" intents) always go to Content, which holds every document.
  tools: (tools) => {
    const order = ["stories", "explore", "content", "media", "vision"];
    const rank = (tool) => (order.includes(tool.name) ? order.indexOf(tool.name) : order.length);
    // "Explore page": the page settings document on its own tab (like Kathart's "Company Profile").
    // A custom tool, not a structure tool with the document as root pane - that broke the URL
    // when the Page tab, comments or history were opened (see ExplorePageTool.jsx).
    const explore = { name: "explore", title: "Explore page", icon: HomeIcon, component: ExplorePageTool };
    return [...tools, explore].sort((a, b) => rank(a) - rank(b));
  },

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType)),
  },

  document: {
    actions: (actions, { schemaType }) =>
      SINGLETONS.has(schemaType) ? actions.filter(({ action }) => action && SINGLETON_ACTIONS.has(action)) : actions,
    newDocumentOptions: (items, { creationContext }) =>
      creationContext.type === "global" ? items.filter((item) => !SINGLETONS.has(item.templateId)) : items,
  },
});
