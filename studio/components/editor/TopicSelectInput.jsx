"use client";

import { AddIcon } from "@sanity/icons/Add";
import { Box, Button, Card, Flex, Select, Stack, Text, TextInput } from "@sanity/ui";
import { useCallback, useEffect, useState } from "react";
import { set, unset, useClient } from "sanity";
import { apiVersion } from "../../env";

/**
 * Topic picker as a plain dropdown (instead of Sanity's search-as-you-type reference field):
 * every published topic in its position order, with how many stories it has, and a
 * "New topic" button that creates and selects one on the spot.
 */

const TOPICS = `*[_type == "topic" && !(_id in path("drafts.**"))] | order(coalesce(order, 99) asc, title asc){
  _id, title, order, "slug": slug.current,
  "stories": count(*[_type == "post" && !(_id in path("drafts.**")) && references(^._id)])
}`;

const slugify = (text) =>
  text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64) || "topic";

export default function TopicSelectInput(props) {
  const { value, onChange, readOnly, elementProps = {} } = props;
  const client = useClient({ apiVersion });
  const [topics, setTopics] = useState(null);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    () =>
      client
        .fetch(TOPICS)
        .then((list) => {
          setTopics(list ?? []);
          setError(null);
        })
        .catch((e) => setError(e.message)),
    [client],
  );

  useEffect(() => {
    load();
    // Pick up topics added or renamed in another tab
    const onFocus = () => load();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [load]);

  const current = value?._ref ?? "";
  const known = !current || topics?.some((t) => t._id === current);

  const choose = (id) => onChange(id ? set({ _type: "reference", _ref: id }) : unset());

  const create = async () => {
    const title = name.trim();
    if (!title) return;
    setBusy(true);
    try {
      const taken = new Set((topics ?? []).map((t) => t.slug));
      let slug = slugify(title);
      for (let n = 2; taken.has(slug); n++) slug = `${slugify(title)}-${n}`;
      const order = Math.max(0, ...(topics ?? []).map((t) => t.order ?? 0)) + 1;
      const doc = await client.create({ _type: "topic", title, slug: { _type: "slug", current: slug }, order, showInNav: true });
      await load();
      choose(doc._id);
      setName("");
      setAdding(false);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack space={3}>
      <Flex gap={2} align="center">
        <Box flex={1}>
          <Select
            {...elementProps}
            value={current}
            disabled={readOnly || topics === null}
            onChange={(e) => choose(e.currentTarget.value)}
          >
            <option value="">{topics === null ? "Loading topics…" : "Choose a topic…"}</option>
            {!known ? <option value={current}>(A topic that is not published yet)</option> : null}
            {(topics ?? []).map((t) => (
              <option key={t._id} value={t._id}>
                {t.title}
                {t.stories ? `  ·  ${t.stories} ${t.stories === 1 ? "story" : "stories"}` : "  ·  no stories yet"}
              </option>
            ))}
          </Select>
        </Box>
        {!readOnly ? (
          <Button icon={AddIcon} mode="ghost" text="New topic" onClick={() => setAdding((a) => !a)} selected={adding} />
        ) : null}
      </Flex>

      {adding ? (
        <Card padding={3} radius={2} tone="primary" border>
          <Stack space={3}>
            <Text size={1} weight="medium">
              New topic
            </Text>
            <Flex gap={2}>
              <Box flex={1}>
                <TextInput
                  autoFocus
                  placeholder="e.g. Letters & Notes"
                  value={name}
                  onChange={(e) => setName(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      create();
                    }
                    if (e.key === "Escape") setAdding(false);
                  }}
                />
              </Box>
              <Button text={busy ? "Adding…" : "Add & select"} tone="primary" disabled={busy || !name.trim()} onClick={create} />
            </Flex>
            <Text size={1} muted>
              It is published straight away and joins the end of the topic bar. Add a description or change its position under Content → Topics.
            </Text>
          </Stack>
        </Card>
      ) : null}

      {error ? (
        <Text size={1} style={{ color: "#c0392b" }}>
          {error}
        </Text>
      ) : null}
    </Stack>
  );
}
