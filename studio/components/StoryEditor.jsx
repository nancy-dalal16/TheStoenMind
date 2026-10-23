"use client";

import { ChevronLeftIcon } from "@sanity/icons/ChevronLeft";
import { LaunchIcon } from "@sanity/icons/Launch";
import { PublishIcon } from "@sanity/icons/Publish";
import { RevertIcon } from "@sanity/icons/Revert";
import { TrashIcon } from "@sanity/icons/Trash";
import { Suspense, useMemo, useState } from "react";
import { useDocumentOperation, useEditState } from "sanity";
import { IntentLink, useRouter } from "sanity/router";
import { DocumentPane, PaneLayout, PaneRouterContext, StructureToolProvider } from "sanity/structure";
import { EDITOR_CSS } from "./storiesStyles";

/*
 * Full-page story editor inside the Stories tab (like Kathart's project editor): a top bar with
 * "‹ Stories", the title, Preview, Delete and Publish, and the Studio's own document form below.
 * The form is Sanity's DocumentPane - the same one the Content tab uses - wrapped the way
 * Sanity's Presentation tool embeds it.
 */

// Links the form renders (references, child documents) open in the Content tab.
const ChildLink = ({ childId, childType, childPayload, ...rest }) => (
  <IntentLink intent="edit" params={{ id: childId, type: childType }} {...rest} />
);
const ReferenceChildLink = ({ documentId, documentType, parentRefPath, template, ...rest }) => (
  <IntentLink intent="edit" params={{ id: documentId, type: documentType }} {...rest} />
);
const PlainLink = ({ params, ...rest }) => <a {...rest} />;

function usePaneRouter(onNavigateIntent, onClose) {
  const [params, setParams] = useState({});
  return useMemo(
    () => ({
      index: 1,
      groupIndex: 0,
      siblingIndex: 0,
      payload: {},
      params,
      hasGroupSiblings: false,
      groupLength: 1,
      routerPanesState: [],
      ChildLink,
      BackLink: PlainLink,
      ReferenceChildLink,
      ParameterizedLink: PlainLink,
      // The pane's ✕ goes back to the grid
      closeCurrentAndAfter: onClose,
      closeCurrent: onClose,
      replaceCurrent: () => {},
      duplicateCurrent: () => {},
      handleEditReference: ({ id, type }) => onNavigateIntent("edit", { id, type }),
      setView: (view) => setParams((p) => ({ ...p, view })),
      setParams: (next) => setParams(next ?? {}),
      setPayload: () => {},
      navigateIntent: (intent, intentParams) => onNavigateIntent(intent, intentParams),
      createPathWithParams: () => "",
    }),
    [params, onNavigateIntent, onClose],
  );
}

export default function StoryEditor({ id, isNew, onBack }) {
  const router = useRouter();
  const edit = useEditState(id, "post");
  const ops = useDocumentOperation(id, "post");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const paneRouter = usePaneRouter(router.navigateIntent, onBack);

  const doc = edit?.draft ?? edit?.published;
  const title = doc?.title || (isNew ? "New story" : "Untitled story");
  const slug = edit?.published?.slug?.current;
  const status = !edit?.published ? "Not published" : edit?.draft ? "Unpublished changes" : "Published";

  const pane = useMemo(
    () => ({ id, type: "document", title: "", options: { id, type: "post", ...(isNew ? { template: "post" } : {}) } }),
    [id, isNew],
  );

  const publishDisabled = Boolean(ops.publish.disabled) || !edit?.draft;
  const deleteDisabled = Boolean(ops.del.disabled) || (!edit?.draft && !edit?.published);
  // Throw away unpublished edits and go back to the live version (only when one exists)
  const canDiscard = Boolean(edit?.draft && edit?.published) && !ops.discardChanges.disabled;

  return (
    <div className="stn-editor">
      <style>{EDITOR_CSS}</style>
      <header className="stn-editor-bar">
        <button type="button" className="stn-back" onClick={onBack}>
          <ChevronLeftIcon /> Stories
        </button>
        <div className="stn-editor-title">
          <strong>{title}</strong>
          <span className={`stn-editor-status ${edit?.draft || !edit?.published ? "is-draft" : ""}`}>{status}</span>
        </div>
        <div className="stn-editor-actions">
          {slug ? (
            <a className="stn-pill-btn" href={`/explore/${slug}`} target="_blank" rel="noreferrer">
              <LaunchIcon /> Preview
            </a>
          ) : null}
          {canDiscard && !confirmDelete ? (
            <button type="button" className="stn-pill-btn" title="Go back to the published version" onClick={() => ops.discardChanges.execute()}>
              <RevertIcon /> Discard changes
            </button>
          ) : null}
          {confirmDelete ? (
            <>
              <span className="stn-confirm">Delete this story?</span>
              <button type="button" className="stn-pill-btn" onClick={() => setConfirmDelete(false)}>
                Keep
              </button>
              <button
                type="button"
                className="stn-pill-btn stn-danger-solid"
                onClick={() => {
                  ops.del.execute();
                  onBack();
                }}
              >
                Yes, delete
              </button>
            </>
          ) : (
            <button type="button" className="stn-pill-btn stn-danger" disabled={deleteDisabled} onClick={() => setConfirmDelete(true)}>
              <TrashIcon /> Delete
            </button>
          )}
          <button
            type="button"
            className="stn-publish"
            disabled={publishDisabled}
            title={typeof ops.publish.disabled === "string" ? ops.publish.disabled : undefined}
            onClick={() => ops.publish.execute()}
          >
            <PublishIcon /> {edit?.draft ? "Publish" : "Published"}
          </button>
        </div>
      </header>

      <div className="stn-editor-pane">
        <StructureToolProvider>
          <PaneLayout style={{ height: "100%" }}>
            <PaneRouterContext.Provider value={paneRouter}>
              <Suspense fallback={<div className="stn-loading">Opening the story…</div>}>
                <DocumentPane paneKey="story" index={1} itemId="story" pane={pane} />
              </Suspense>
            </PaneRouterContext.Provider>
          </PaneLayout>
        </StructureToolProvider>
      </div>
    </div>
  );
}
