// components/EcommerceGrid.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { SITE } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import type { StorefrontProduct } from "@/lib/shopify";

export default function EcommerceGrid({ products }: { products: StorefrontProduct[] }) {
  const { add } = useCart();

  if (!products.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10 text-center text-sm text-zinc-600">
        No products yet.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3">
        {products.map((p) => {
          const productUrl = p.handle ? `/shop/${encodeURIComponent(p.handle)}` : "/shop";
          return (
            <article
              key={p.id}
              className="group relative flex flex-col rounded-card border border-zinc-100 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4 lg:p-5"
            >
              <Link href={productUrl} className="relative mb-3 block aspect-[4/3] overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
                {p.img ? (
                  <Image
                    src={p.img}
                    alt={p.title}
                    fill
                    sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-zinc-100" />
                )}
              </Link>

              {p.productType ? (
                <span className="mb-2 inline-flex h-6 w-max items-center rounded-full bg-zinc-100 px-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                  {p.productType}
                </span>
              ) : null}

              <Link href={productUrl}>
                <h3 className="font-semibold cursor-pointer hover:opacity-80 transition-colors mb-2 line-clamp-2 text-sm sm:text-base min-h-[2.5rem] sm:min-h-[3rem]">
                  {p.title}
                </h3>
              </Link>

              <div className="mt-auto">
                <div className="mb-2 text-sm font-semibold sm:text-base">
                  {formatCurrency(p.price, p.currency || SITE.currency)}
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Link
                    href={productUrl}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full border border-zinc-300 text-xs font-semibold hover:border-zinc-500"
                  >
                    Details
                  </Link>
                  <button
                    type="button"
                    onClick={() =>
                      p.available &&
                      add(
                        { id: p.variantId, title: p.title, price: p.price, img: p.img, handle: p.handle },
                        1
                      )
                    }
                    disabled={!p.available}
                    className="inline-flex h-10 w-full items-center justify-center rounded-full text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                    style={
                      p.available
                        ? { background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))" }
                        : undefined
                    }
                  >
                    {p.available ? "Add to cart" : "Sold out"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
