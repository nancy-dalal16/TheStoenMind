/**
 * Centred section title (Abhaya 40) with an optional eyebrow line above it and an optional
 * 18/26 intro line below. Reveals on scroll.
 */
export default function SectionHeading({
  eyebrow,
  title,
  description,
  as: Tag = "h2",
  titleClassName = "",
  className = "",
}) {
  return (
    <div data-reveal="" className={`flex flex-col items-center gap-4 text-center text-fg ${className}`}>
      {eyebrow ? (
        <p data-part="rise" className="font-serif text-xl leading-6 tracking-[0.04em] text-eyebrow">
          {eyebrow}
        </p>
      ) : null}
      <Tag data-part="blur" className={`text-heading ${titleClassName}`}>
        {title}
      </Tag>
      {description ? (
        <p data-part="rise" style={{ "--j": 1 }} className="max-w-[36.5rem] text-body-lg leading-[26px] lg:max-w-none">
          {description}
        </p>
      ) : null}
    </div>
  );
}
