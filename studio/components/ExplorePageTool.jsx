"use client";

import StoryEditor from "./StoryEditor";

/**
 * "Explore page" tab: the page settings document in the same full-page editor as a story
 * (title bar with Preview, Discard changes and Publish; the form with its Edit / Page tabs).
 *
 * It used to be a structure tool whose root pane was the document itself. Sanity's pane router
 * can't store settings (the Page tab, comments, history) for a root pane, so it wrote a pane
 * with an empty id into the URL and the Studio failed with "Failed to resolve document, and no
 * type provided in parameters" (path root → ""). This editor keeps those settings itself.
 */
export default function ExplorePageTool() {
  return (
    <StoryEditor
      id="explorePage"
      type="explorePage"
      fallbackTitle="Explore page"
      previewHref="/explore"
      allowDelete={false}
    />
  );
}
