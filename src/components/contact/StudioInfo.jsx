import { studio } from "@/lib/contact";

/** "The Binding Room" and "Atelier Hours" cards beside the form. */
export default function StudioInfo() {
  const { bindingRoom, hours, communities } = studio;

  return (
    <div className="flex flex-col gap-10">
      <section data-reveal="right" className="flex flex-col gap-6 rounded-[20px] bg-surface-soft p-6 text-fg sm:p-12">
        <div className="flex flex-col">
          <h2 className="text-card">{bindingRoom.title}</h2>
          <p className="text-body-lg leading-[26px]">{bindingRoom.text}</p>
        </div>
        <span data-part="line" aria-hidden="true" className="h-px w-full bg-divider" />
        <div className="flex flex-col gap-1">
          <h3 className="text-title">{bindingRoom.place}</h3>
          <address className="text-body not-italic">
            {bindingRoom.address.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </address>
        </div>
      </section>

      <section
        data-reveal="right"
        style={{ "--i": 1 }}
        className="flex flex-col gap-6 rounded-[20px] bg-surface-soft p-6 text-fg sm:p-12"
      >
        <div className="flex flex-col">
          <h2 className="text-card">{hours.title}</h2>
          <p className="text-body-lg leading-[26px]">{hours.days}</p>
          <p className="text-body-lg leading-[26px]">{hours.time}</p>
        </div>
        <span data-part="line" aria-hidden="true" className="h-px w-full bg-divider" />
        <div className="flex flex-col gap-2">
          <h3 className="text-title">{communities.title}</h3>
          <ul className="flex flex-wrap gap-2">
            {communities.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-[38px] items-center rounded-full bg-surface-tint px-[17px] font-sans text-sm leading-5 text-fg transition-colors hover:bg-primary hover:text-on-primary"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
