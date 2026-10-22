import Link from "next/link";
import { formatDate } from "@/lib/explore/format";
import { topicHref } from "@/lib/explore/links";

/** The small capitals above a headline (the topic), linking to its topic page. */
export function Rubric({ topic, className = "" }) {
  if (!topic) return null;
  return (
    // relative z-10 keeps it clickable above the card's stretched headline link
    <Link href={topicHref(topic)} className={`ex-rubric relative z-10 ${className}`}>
      {topic.title}
    </Link>
  );
}

/**
 * "By CLARA VANCE · 20 October 2026 · 4 min read" - each part optional. The dots belong to the
 * part after them and sit in a clipped gutter, so a part that wraps never starts its line
 * with a stray dot. `center` centres it (author above date on phones).
 */
export function Byline({ post, date = true, time = false, center = false, className = "" }) {
  const parts = [
    post.author ? (
      <span key="by">
        By <span className="ex-byline-name">{post.author.name}</span>
      </span>
    ) : null,
    date && post.publishedAt ? (
      <time key="date" dateTime={post.publishedAt}>
        {formatDate(post.publishedAt)}
      </time>
    ) : null,
    time && post.readingTime ? <span key="time">{post.readingTime} min read</span> : null,
  ].filter(Boolean);

  if (!parts.length) return null;

  // Centred: the author on one line and the date/time on the next on phones; one line from sm.
  if (center) {
    const [first, ...rest] = post.author ? parts : [null, ...parts];
    return (
      <p className={`ex-byline ex-byline-center ${className}`}>
        {first}
        {first && rest.length ? (
          <span aria-hidden="true" className="ex-dot max-sm:hidden">
            ·
          </span>
        ) : null}
        {rest.length ? (
          <span className="whitespace-nowrap">
            {rest.map((part, index) => (
              <span key={part.key}>
                {index > 0 ? (
                  <span aria-hidden="true" className="ex-dot">
                    ·
                  </span>
                ) : null}
                {part}
              </span>
            ))}
          </span>
        ) : null}
      </p>
    );
  }

  return (
    <p className={`ex-byline ex-meta-wrap ${className}`}>
      <span className="ex-meta">{parts}</span>
    </p>
  );
}
