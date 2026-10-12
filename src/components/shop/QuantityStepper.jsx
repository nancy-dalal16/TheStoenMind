"use client";

/** − 1 + stepper. `size="sm"` for the bag, default for the product page. */
export default function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  disabled = false,
  label = "",
}) {
  const small = size === "sm";
  const button = `grid cursor-pointer place-items-center text-fg transition-colors hover:bg-fg/[0.05] disabled:cursor-not-allowed disabled:opacity-35 ${
    small ? "size-8" : "size-12"
  }`;

  return (
    <div
      role="group"
      aria-label={`Quantity${label ? `, ${label}` : ""}`}
      className={`inline-flex items-center rounded-ui border border-field-line bg-field ${small ? "h-8" : "h-12"}`}
    >
      <button
        type="button"
        className={button}
        disabled={disabled || value <= (small ? 0 : min)}
        onClick={() => onChange(value - 1)}
        aria-label="One fewer"
      >
        <span aria-hidden="true" className="h-[1.5px] w-3 rounded-full bg-current" />
      </button>
      <output
        aria-live="polite"
        className={`text-center font-sans tabular-nums text-fg ${small ? "w-7 text-sm" : "w-10 text-base"}`}
      >
        {value}
      </output>
      <button
        type="button"
        className={button}
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="One more"
      >
        <span aria-hidden="true" className="relative size-3">
          <span className="absolute top-1/2 left-0 h-[1.5px] w-3 -translate-y-1/2 rounded-full bg-current" />
          <span className="absolute top-0 left-1/2 h-3 w-[1.5px] -translate-x-1/2 rounded-full bg-current" />
        </span>
      </button>
    </div>
  );
}
