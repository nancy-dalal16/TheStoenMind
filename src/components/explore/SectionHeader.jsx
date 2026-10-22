import Link from "next/link";
import Icon from "@/components/ui/Icon";

/**
 * A section opener in the magazine style: a double hairline, then the title on the left and an
 * optional "All …" link on the right. `description` sits under the title.
 */
export default function SectionHeader({ id, title, description, href, linkLabel, linkContext, className = "" }) {
  return (
    <div data-reveal="" className={`ex-section-head ${className}`}>
      <span data-part="line" aria-hidden="true" className="ex-double-rule" />
      <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-end sm:justify-between sm:gap-8 md:pt-6">
        <div className="flex max-w-[40rem] flex-col gap-2">
          <h2 id={id} data-part="blur" className="text-heading text-fg">
            {title}
          </h2>
          {description ? (
            <p data-part="rise" className="text-body-lg leading-[1.45] text-pretty">
              {description}
            </p>
          ) : null}
        </div>
        {href ? (
          <Link href={href} data-part="rise" className="ex-more shrink-0">
            {linkLabel}
            {linkContext ? <span className="sr-only"> {linkContext}</span> : null}
            <Icon name="arrow-right" width={18} height={18} />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
