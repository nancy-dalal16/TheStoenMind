"use client";

import { useId, useState } from "react";
import Button from "@/components/ui/Button";
import Icon from "@/components/ui/Icon";
import { productNotes } from "@/lib/shop/copy";
import { formatMoney } from "@/lib/shop/money";
import Link from "next/link";
import Price from "./Price";
import ProductGallery from "./ProductGallery";
import QuantityStepper from "./QuantityStepper";
import { addToCart, useCart } from "./cartStore";

/** The variant whose options match `selected` ({ Colour: "Olive" }). */
function findVariant(product, selected) {
  return (
    product.variants.find((v) => v.selectedOptions.every((o) => selected[o.name] === o.value)) ?? product.variants[0]
  );
}

function initialSelection(product) {
  const first = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  return Object.fromEntries((first?.selectedOptions ?? []).map((o) => [o.name, o.value]));
}

/**
 * Product page body: gallery on the left; on the right (sticky on desktop) the title, price,
 * story, options, quantity and "Add to bag", then a few quiet notes.
 */
export default function ProductView({ product }) {
  const [selected, setSelected] = useState(() => initialSelection(product));
  const [quantity, setQuantity] = useState(1);
  const { pending } = useCart();
  const variant = findVariant(product, selected);
  const available = Boolean(variant?.availableForSale);
  const price = variant?.price ?? product.price;
  const compareAt =
    variant?.compareAtPrice && Number(variant.compareAtPrice.amount) > Number(price.amount)
      ? variant.compareAtPrice
      : null;

  const isAvailable = (name, value) =>
    product.variants.some(
      (v) =>
        v.availableForSale &&
        v.selectedOptions.every((o) => (o.name === name ? o.value === value : selected[o.name] === o.value)),
    );

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-20">
      <div data-reveal="fade" style={{ "--reveal-dur": "1.4s" }}>
        <ProductGallery images={product.images} title={product.title} focusSrc={variant?.image?.src} />
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <div data-reveal="" className="flex flex-col">
          {product.collection ? (
            <p data-part="rise" className="font-serif text-xl leading-6 tracking-[0.04em] text-eyebrow">
              {product.collection.title}
            </p>
          ) : null}
          <h1 data-part="blur" className="mt-3 text-page text-fg">
            {product.title}
          </h1>
          {product.subtitle ? (
            <p
              data-part="rise"
              style={{ "--j": 1 }}
              className="mt-3 font-sans text-xs tracking-[0.14em] text-fg-muted uppercase"
            >
              {product.subtitle}
            </p>
          ) : null}

          <div data-part="rise" style={{ "--j": 2 }} className="mt-5">
            <Price price={price} compareAtPrice={compareAt} size="lg" />
          </div>

          <span data-part="line" aria-hidden="true" className="mt-7 h-px w-full bg-divider" />

          <div
            data-part="rise"
            style={{ "--j": 3 }}
            className="shop-prose mt-7"
            // Shopify sends product descriptions as HTML written in the Shopify admin.
            dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
          />

          {product.options.map((option, oi) => (
            <fieldset key={option.name} data-part="rise" style={{ "--j": 4 + oi }} className="mt-7">
              <legend className="font-sans text-xs tracking-[0.14em] text-fg-muted uppercase">
                {option.name}
                <span className="ml-2 tracking-[0.06em] text-fg normal-case">{selected[option.name]}</span>
              </legend>
              <div className="mt-3 flex flex-wrap gap-2.5">
                {option.values.map((value) => {
                  const checked = selected[option.name] === value.name;
                  const soldOut = !isAvailable(option.name, value.name);
                  return (
                    <label
                      key={value.name}
                      title={value.name}
                      className={value.swatch ? "shop-swatch" : "shop-option"}
                      data-checked={checked || undefined}
                      data-soldout={soldOut || undefined}
                      style={value.swatch ? { "--swatch": value.swatch } : undefined}
                    >
                      <input
                        type="radio"
                        name={option.name}
                        value={value.name}
                        checked={checked}
                        onChange={() => setSelected((s) => ({ ...s, [option.name]: value.name }))}
                        className="sr-only"
                      />
                      {value.swatch ? (
                        <span className="sr-only">
                          {value.name}
                          {soldOut ? " (sold out)" : ""}
                        </span>
                      ) : (
                        value.name
                      )}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}

          <div data-part="rise" style={{ "--j": 5 + product.options.length }} className="mt-9 flex gap-3">
            <QuantityStepper value={quantity} onChange={setQuantity} label={product.title} disabled={!available} />
            <Button
              className="flex-1"
              disabled={!available || pending}
              aria-disabled={!available || pending}
              onClick={() => addToCart({ product, variant, quantity }).then(() => setQuantity(1))}
            >
              {available ? (
                <>
                  <Icon name="handbag" />
                  {pending ? (
                    "Adding…"
                  ) : (
                    <>
                      Add to bag
                      <span className="max-sm:sr-only">
                        · {formatMoney({ ...price, amount: String(Number(price.amount) * quantity) })}
                      </span>
                    </>
                  )}
                </>
              ) : (
                "Sold out"
              )}
            </Button>
          </div>

          <ProductNotes start={6 + product.options.length} />
        </div>
      </div>
    </div>
  );
}

/** Shipping / gifting / returns - hairline rows that open one at a time. */
function ProductNotes({ start }) {
  const [open, setOpen] = useState(-1);
  const baseId = useId();

  return (
    <ul data-part="rise" style={{ "--j": start }} className="mt-12 border-t border-divider">
      {productNotes.map((note, index) => {
        const expanded = open === index;
        return (
          <li key={note.title} className="border-b border-divider">
            <h2>
              <button
                id={`${baseId}-b${index}`}
                type="button"
                aria-expanded={expanded}
                aria-controls={`${baseId}-p${index}`}
                onClick={() => setOpen(expanded ? -1 : index)}
                className="group/note flex w-full cursor-pointer items-center justify-between gap-6 py-4 text-left font-sans text-xs tracking-[0.14em] text-fg uppercase"
              >
                {note.title}
                <span
                  aria-hidden="true"
                  className="relative size-3 text-fg-muted transition-colors group-hover/note:text-fg"
                >
                  <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-soft ${expanded ? "scale-y-0" : ""}`}
                  />
                </span>
              </button>
            </h2>
            <div
              id={`${baseId}-p${index}`}
              role="region"
              aria-labelledby={`${baseId}-b${index}`}
              inert={!expanded}
              className={`grid transition-[grid-template-rows] duration-400 ease-soft motion-reduce:transition-none ${
                expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-body">
                  {note.body}
                  {note.link ? (
                    <>
                      {" "}
                      <Link
                        href={note.link.href}
                        className="text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-current dark:text-eyebrow"
                      >
                        {note.link.label}
                      </Link>
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
