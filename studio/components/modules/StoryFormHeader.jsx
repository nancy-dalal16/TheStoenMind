"use client";

import { DocumentTextIcon } from "@sanity/icons/DocumentText";
import { useEffect, useState } from "react";
import { useClient } from "sanity";
import { apiVersion } from "../../env";

/**
 * The banner at the top of a story's form (like Kathart's project banner): an icon tile, the
 * title, and "Topic · Story editor" - then the form itself.
 */
export default function StoryFormHeader(props) {
  const client = useClient({ apiVersion });
  const title = props.value?.title;
  const topicRef = props.value?.topic?._ref;
  const [topic, setTopic] = useState(null);

  useEffect(() => {
    if (!topicRef) return;
    let live = true;
    client.fetch(`*[_id in [$id, "drafts." + $id]][0].title`, { id: topicRef }).then((t) => live && setTopic(t ?? null));
    return () => {
      live = false;
    };
  }, [client, topicRef]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          margin: "0 0 28px",
          padding: "22px 26px",
          borderRadius: 14,
          color: "#fff",
          background: "radial-gradient(120% 140% at 80% 0%, #2a6f8f 0%, #03446a 45%, #041327 100%)",
        }}
      >
        <span
          style={{
            display: "grid",
            placeItems: "center",
            width: 42,
            height: 42,
            borderRadius: 10,
            background: "rgb(255 255 255 / 0.12)",
            boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.18)",
            fontSize: 22,
          }}
        >
          <DocumentTextIcon />
        </span>
        <span style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 0 }}>
          <strong
            style={{
              fontFamily: "var(--font-abhaya), 'Abhaya Libre', Georgia, serif",
              fontWeight: 400,
              fontSize: 24,
              lineHeight: 1.1,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {title || "New story"}
          </strong>
          <span style={{ fontSize: 13, color: "rgb(255 255 255 / 0.72)" }}>
            {[topicRef ? topic : null, "Story editor"].filter(Boolean).join(" · ")}
          </span>
        </span>
      </div>
      {props.renderDefault(props)}
    </div>
  );
}
