import Link from "next/link";
import Container from "@/components/ui/Container";
import { topicHref } from "@/lib/explore/links";

/**
 * Topic links under the nameplate, between a double rule and a single one (magazine section bar).
 * Centred on desktop; scrolls sideways on phones.
 */
export default function TopicNav({ topics = [], active = "all" }) {
  const items = [{ slug: "all", title: "All stories", href: "/explore" }, ...topics.map((t) => ({ ...t, href: topicHref(t) }))];

  return (
    <Container className="relative z-10 motion-safe:animate-rise-in motion-safe:[animation-delay:520ms]">
      <nav aria-label="Topics" className="ex-topicbar">
        <ul className="ex-topics">
          {items.map((item) => (
            <li key={item.slug} className="shrink-0">
              <Link href={item.href} aria-current={item.slug === active ? "page" : undefined} className="ex-tab">
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
}
