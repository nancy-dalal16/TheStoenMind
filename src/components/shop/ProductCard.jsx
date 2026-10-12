import Image from "next/image";
import Link from "next/link";
import { productHref } from "@/lib/shop/links";
import { formatMoney } from "@/lib/shop/money";
import Price from "./Price";

/**
 * Shop grid card. No box around it - just the product floating on a soft stage, with the
 * title and price resting underneath (minimal, gallery-like). On hover the stage lifts and,
 * when there is a second image (a lifestyle photo), it cross-fades in. Products with colour
 * options show their swatches.
 */
export default function ProductCard({
  product,
  index = 0,
  sizes = "(min-width: 1280px) 290px, (min-width: 768px) 30vw, 45vw",
}) {
  const [primary, secondary] = product.images;
  const swatches = product.options.find((o) => o.values.some((v) => v.swatch))?.values ?? [];

  return (
    <li data-reveal="" style={{ "--i": index % 4 }} className="list-none">
      <Link href={productHref(product)} className="hover-group group/card block focus-visible:outline-offset-4">
        <div className="shop-stage hover-frame relative aspect-[4/5] overflow-hidden rounded-ui">
          {primary ? (
            <div data-part="img" className="absolute inset-0">
              <div className={`shop-primary absolute ${primary.fit === "cover" ? "inset-0" : "inset-[11%_15%]"}`}>
                <Image
                  src={primary.src}
                  alt={primary.alt}
                  fill
                  sizes={sizes}
                  className={primary.fit === "cover" ? "object-cover" : "shop-cover object-contain"}
                />
              </div>
            </div>
          ) : null}

          {secondary ? (
            <div
              className={`shop-alt absolute ${secondary.fit === "cover" ? "inset-0" : "inset-[11%_15%]"}`}
              aria-hidden="true"
            >
              <Image
                src={secondary.src}
                alt=""
                fill
                sizes={sizes}
                className={secondary.fit === "cover" ? "object-cover" : "shop-cover object-contain"}
              />
            </div>
          ) : null}

          {!product.availableForSale ? <span className="shop-chip absolute top-3 left-3">Sold out</span> : null}
          {product.compareAtPrice && product.availableForSale ? (
            <span className="shop-chip absolute top-3 left-3">Sale</span>
          ) : null}
        </div>

        <div className="mt-4 flex flex-col gap-1.5 px-0.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <h3 className="hover-nudge font-serif text-lg leading-[1.2] text-fg sm:text-title">{product.title}</h3>
            {product.subtitle ? (
              <p className="mt-1 font-sans text-xs leading-4 tracking-[0.06em] text-fg-muted">{product.subtitle}</p>
            ) : null}
            {swatches.length > 1 ? (
              <ul className="mt-2.5 flex gap-1.5" aria-label={`${swatches.length} colours`}>
                {swatches.map((s) => (
                  <li
                    key={s.name}
                    title={s.name}
                    className="shop-swatch-dot"
                    style={{ "--swatch": s.swatch ?? "transparent" }}
                  >
                    <span className="sr-only">{s.name}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
          <Price price={product.price} compareAtPrice={product.compareAtPrice} className="shrink-0 sm:pt-1" />
        </div>
        <span className="sr-only">, {formatMoney(product.price)}</span>
      </Link>
    </li>
  );
}
