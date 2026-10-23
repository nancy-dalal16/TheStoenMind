"use client";

import { LaunchIcon } from "@sanity/icons/Launch";
import { RefreshIcon } from "@sanity/icons/Refresh";
import { Box, Button, Card, Flex, Text } from "@sanity/ui";
import { useState } from "react";

/**
 * "Page" tab: the published page on the site, beside the form. It shows what visitors see -
 * publish your changes, then refresh (the site updates within a minute).
 */
export default function PagePreview({ document }) {
  const doc = document?.displayed ?? {};
  const [key, setKey] = useState(0);

  const slug = doc.slug?.current;
  const path = doc._type === "post" ? (slug ? `/explore/${slug}` : null) : "/explore";

  if (!path) {
    return (
      <Box padding={5}>
        <Text muted>Give the story a web address (and publish it) to see its page here.</Text>
      </Box>
    );
  }

  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;

  return (
    <Flex direction="column" height="fill">
      <Card padding={2} borderBottom tone="transparent">
        <Flex align="center" gap={2}>
          <Box flex={1} paddingX={2}>
            <Text size={1} muted textOverflow="ellipsis">
              {path} · shows the published version
            </Text>
          </Box>
          <Button icon={RefreshIcon} mode="bleed" text="Refresh" fontSize={1} onClick={() => setKey((k) => k + 1)} />
          <Button as="a" href={url} target="_blank" rel="noreferrer" icon={LaunchIcon} mode="ghost" text="Open" fontSize={1} />
        </Flex>
      </Card>
      <Box flex={1} style={{ position: "relative" }}>
        <iframe
          key={key}
          title="Page"
          src={url}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "#fff" }}
        />
      </Box>
    </Flex>
  );
}
