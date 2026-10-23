"use client";

import { AddIcon } from "@sanity/icons/Add";
import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { EditIcon } from "@sanity/icons/Edit";
import { SearchIcon } from "@sanity/icons/Search";
import { StarFilledIcon } from "@sanity/icons/StarFilled";
import { useCallback, useEffect, useMemo, useState } from "react";
import { definePlugin, useClient } from "sanity";
import { IntentLink, route, useRouter } from "sanity/router";
import { BookIcon } from "@sanity/icons/Book";
import { apiVersion } from "../env";
import StoryEditor from "./StoryEditor";
import { STORIES_CSS } from "./storiesStyles";

/*
 * "Stories" - the Studio's first screen, a picture grid of every story (modelled on the
 * Kathart Studio "Projects" screen): brand + search + New story on top, tabs for
 * All / Published / Drafts / Lead & picks / Scheduled, a topic filter and sort, then cards.
 * Click a card to edit the story. Plain HTML + scoped `.stn-` CSS (storiesStyles.js).
 */

const QUERY = `*[_type == "post"]{
  _id, _updatedAt, title, publishedAt, featured, editorsPick,
  "slug": slug.current,
  "topic": topic->{ _id, title },
  "author": author->{ name, "photo": photo.asset->url },
  "thumb": cover.asset->url,
  "fit": cover.fit,
  "video": defined(coverVideo.file.asset),
  "words": length(string::split(pt::text(body[_type == "textBlock"].content[]), " ")) + length(string::split(pt::text(body), " "))
}`;
const TOPICS = `*[_type == "topic" && !(_id in path("drafts.**"))] | order(coalesce(order, 99) asc){ _id, title }`;

const baseId = (id) => id.replace(/^drafts\./, "");
const img = (url, w, h) => (url ? `${url}?w=${w}&h=${h}&fit=crop&auto=format` : null);

function ago(iso) {
  if (!iso) return "";
  const s = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d ago`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.round(mo / 12)}y ago`;
}

/** Drafts and published copies → one story each, with a status. */
function mergeStories(docs) {
  const map = new Map();
  for (const doc of docs) {
    const id = baseId(doc._id);
    const entry = map.get(id) ?? { id };
    if (doc._id.startsWith("drafts.")) entry.draft = doc;
    else entry.published = doc;
    map.set(id, entry);
  }
  const now = Date.now();
  return [...map.values()].map(({ id, draft, published }) => {
    const doc = draft ?? published;
    const scheduled = Boolean(published?.publishedAt && new Date(published.publishedAt).getTime() > now);
    const status = !published ? "draft" : draft ? "edited" : scheduled ? "scheduled" : "published";
    return { ...doc, id, status, updatedAt: doc._updatedAt };
  });
}

const TABS = [
  { id: "all", label: "All", test: () => true },
  { id: "published", label: "Published", test: (s) => s.status === "published" || s.status === "edited" },
  { id: "drafts", label: "Drafts", test: (s) => s.status === "draft" || s.status === "edited" },
  { id: "front", label: "Lead & picks", test: (s) => s.featured || s.editorsPick },
  { id: "scheduled", label: "Scheduled", test: (s) => s.status === "scheduled" },
];

const SORTS = {
  updated: { label: "Recently updated", fn: (a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? "") },
  newest: { label: "Newest published", fn: (a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? "") },
  oldest: { label: "Oldest published", fn: (a, b) => (a.publishedAt ?? "").localeCompare(b.publishedAt ?? "") },
  title: { label: "Title A–Z", fn: (a, b) => (a.title ?? "").localeCompare(b.title ?? "") },
};

const BADGE = {
  draft: { label: "Draft", tone: "draft" },
  edited: { label: "Edited", tone: "edited" },
  scheduled: { label: "Scheduled", tone: "scheduled" },
};

function Card({ story }) {
  const badge = BADGE[story.status];
  const minutes = story.words ? Math.max(1, Math.round(story.words / 200)) : null;
  return (
    <IntentLink intent="edit" params={{ id: story.id, type: "post" }} className="stn-card">
      <span className="stn-card-media">
        {story.thumb ? (
          story.fit === "contain" ? (
            // Covers and medallions float whole on the soft tile, as on the site
            // eslint-disable-next-line @next/next/no-img-element
            <img className="stn-contain" src={`${story.thumb}?w=640&fit=max&auto=format`} alt="" loading="lazy" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={img(story.thumb, 640, 480)} alt="" loading="lazy" />
          )
        ) : (
          <span className="stn-card-empty">No cover yet</span>
        )}
        <span className="stn-card-badges">
          {badge ? <span className={`stn-badge stn-badge-${badge.tone}`}>{badge.label}</span> : null}
          {story.featured ? (
            <span className="stn-badge stn-badge-lead">
              <StarFilledIcon /> Lead
            </span>
          ) : story.editorsPick ? (
            <span className="stn-badge stn-badge-pick">Pick</span>
          ) : null}
          {story.video ? <span className="stn-badge stn-badge-pick">Video</span> : null}
        </span>
      </span>
      <span className="stn-card-title">{story.title || "Untitled story"}</span>
      <span className="stn-card-row">
        <span className="stn-card-author">
          {story.author?.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="stn-avatar" src={img(story.author.photo, 48, 48)} alt="" />
          ) : (
            <span className="stn-avatar">{(story.author?.name ?? "?").charAt(0)}</span>
          )}
          <span className="stn-ellipsis">{story.author?.name ?? "No author"}</span>
        </span>
        {story.topic ? <span className="stn-chip">{story.topic.title}</span> : null}
      </span>
      <span className="stn-card-meta">
        {ago(story.updatedAt)}
        {minutes ? ` · ${minutes} min read` : ""}
      </span>
    </IntentLink>
  );
}

/** The tab: the grid at /studio/stories, a story at /studio/stories/edit/<id>, a new one at /new/<id>. */
function StoriesTool() {
  const router = useRouter();
  const { id, newId } = router.state ?? {};
  if (id || newId) {
    return <StoryEditor key={id ?? newId} id={id ?? newId} isNew={Boolean(newId)} onBack={() => router.navigate({})} />;
  }
  return <StoriesGrid />;
}

function StoriesGrid() {
  const client = useClient({ apiVersion });
  const router = useRouter();
  const [docs, setDocs] = useState(null);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("all");
  const [topic, setTopic] = useState("all");
  const [sort, setSort] = useState("updated");
  const [search, setSearch] = useState("");

  const load = useCallback(() => {
    Promise.all([client.fetch(QUERY, {}, { perspective: "raw" }), client.fetch(TOPICS)])
      .then(([posts, topicList]) => {
        setDocs(posts);
        setTopics(topicList);
        setError(null);
      })
      .catch((e) => setError(e.message));
  }, [client]);

  useEffect(() => {
    load();
    const sub = client
      .listen('*[_type in ["post", "topic", "author"]]', {}, { includeResult: false, visibility: "query" })
      .subscribe(() => load());
    return () => sub.unsubscribe();
  }, [client, load]);

  const stories = useMemo(() => (docs ? mergeStories(docs) : []), [docs]);
  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, stories.filter(t.test).length])), [stories]);

  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    const test = TABS.find((t) => t.id === tab)?.test ?? (() => true);
    return stories
      .filter(test)
      .filter((s) => topic === "all" || s.topic?._id === topic)
      .filter((s) => !q || [s.title, s.topic?.title, s.author?.name].some((v) => v?.toLowerCase().includes(q)))
      .sort(SORTS[sort].fn);
  }, [stories, tab, topic, sort, search]);

  return (
    <div className="stn-root">
      <style>{STORIES_CSS}</style>

      <header className="stn-top">
        <span className="stn-brand" role="img" aria-label="the STOEN mind" />
        <label className="stn-search">
          <SearchIcon />
          <input type="search" placeholder="Search stories, topics, authors…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </label>
        <span className="stn-count">
          {stories.length} {stories.length === 1 ? "story" : "stories"}
        </span>
        <button type="button" className="stn-button stn-button-ghost" onClick={() => router.navigateUrl({ path: "/studio/explore" })}>
          <EditIcon /> Explore page
        </button>
        <IntentLink intent="create" params={{ type: "post" }} className="stn-button">
          <AddIcon /> New story
        </IntentLink>
      </header>

      <nav className="stn-bar" aria-label="Filter stories">
        <div className="stn-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className="stn-tab"
              onClick={() => setTab(t.id)}
            >
              {t.label} <span>({counts[t.id] ?? 0})</span>
            </button>
          ))}
        </div>
        <div className="stn-controls">
          <label className="stn-select">
            <span>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </label>
          <label className="stn-select">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([id, s]) => (
                <option key={id} value={id}>
                  {s.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon />
          </label>
        </div>
      </nav>

      <main className="stn-body">
        {error ? <p className="stn-error">Couldn&rsquo;t load the stories: {error}</p> : null}
        <div className="stn-grid">
          <IntentLink intent="create" params={{ type: "post" }} className="stn-new">
            <span className="stn-new-plus">
              <AddIcon />
            </span>
            New story
          </IntentLink>
          {docs
            ? shown.map((story) => <Card key={story.id} story={story} />)
            : Array.from({ length: 7 }, (_, i) => <span key={i} className="stn-card stn-skeleton" />)}
        </div>
        {docs && !shown.length ? <p className="stn-empty">No stories match these filters.</p> : null}
      </main>
    </div>
  );
}

/** Adds "Stories" as the Studio's first tab. */
export const storiesTool = definePlugin({
  name: "stoen-stories",
  tools: (prev) => [
    {
      name: "stories",
      title: "Stories",
      icon: BookIcon,
      component: StoriesTool,
      router: route.create("/", [route.create("/edit/:id"), route.create("/new/:newId")]),
      // Opening or creating a story anywhere in the Studio lands here, full page
      canHandleIntent: (intent, params) =>
        params?.type === "post" && ((intent === "edit" && Boolean(params.id)) || intent === "create"),
      getIntentState: (intent, params) =>
        intent === "create" ? { newId: params.id ?? crypto.randomUUID() } : { id: String(params.id).replace(/^drafts\./, "") },
    },
    ...prev,
  ],
});
