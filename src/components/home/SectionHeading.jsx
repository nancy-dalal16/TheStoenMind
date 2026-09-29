/** Centred section title (Abhaya 48) with optional 20/26 intro line. Reveals on scroll. */
export default function SectionHeading({ title, description, as: Tag = "h2", className = "" }) {
  return (
    <div data-reveal="" className={`flex flex-col items-center gap-2 text-center text-fg ${className}`}>
      <Tag data-part="blur" className="text-heading">
        {title}
      </Tag>
      {description ? (
        <p data-part="rise" className="max-w-[36.5rem] text-body-lg leading-[26px] lg:max-w-none">
          {description}
        </p>
      ) : null}
    </div>
  );
}
