// app/shop/page.tsx (SERVER)
import type { Metadata } from "next";
import Link from "next/link";
import EcommerceGrid from "@/components/EcommerceGrid";
import SEOJsonLd from "@/components/SEOJsonLd";
import { SITE } from "@/lib/site";
import { getProducts } from "@/lib/shopify";

export const metadata: Metadata = {
  title: "Shop",
  description: `Shop the latest products from ${SITE.brand}.`,
  alternates: { canonical: "/shop" },
};

type ShopSearchParams = { q?: string; cat?: string; sort?: string };

export default async function Page({ searchParams }: { searchParams?: ShopSearchParams }) {
  const q = searchParams?.q?.trim() || "";
  const cat = searchParams?.cat || "";
  const sort = searchParams?.sort || "";

  const all = await getProducts(60);
  const categories = Array.from(new Set(all.map((p) => p.productType).filter(Boolean)));

  let filtered = all;
  if (q) {
    const term = q.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.vendor.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term))
    );
  }
  if (cat) filtered = filtered.filter((p) => p.productType === cat);
  switch (sort) {
    case "price-asc":
      filtered = [...filtered].sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      filtered = [...filtered].sort((a, b) => b.price - a.price);
      break;
    case "alpha":
      filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  const buildHref = (overrides: Partial<Record<"q" | "cat" | "sort", string | null>>) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("cat", cat);
    if (sort) params.set("sort", sort);
    Object.entries(overrides).forEach(([k, v]) => {
      if (!v) params.delete(k);
      else params.set(k, v);
    });
    const s = params.toString();
    return `/shop${s ? `?${s}` : ""}`;
  };

  return (
    <main className="w-full">
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: all.map((p, idx) => ({
            "@type": "ListItem",
            position: idx + 1,
            item: {
              "@type": "Product",
              name: p.title,
              description: p.description.slice(0, 240),
              image: p.img,
              sku: p.id,
              offers: {
                "@type": "Offer",
                price: p.price.toFixed(2),
                priceCurrency: p.currency || SITE.currency,
                availability: p.available
                  ? "https://schema.org/InStock"
                  : "https://schema.org/OutOfStock",
              },
            },
          })),
        }}
      />

      <section className="mt-8 mb-6">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-zinc-900">Shop</h1>
          <p className="mt-2 text-sm text-zinc-600 max-w-2xl">
            Browse the catalog. Cart and checkout via Shopify.
          </p>
        </div>
      </section>

      <section className="mb-6">
        <div className="mx-auto max-w-6xl px-4">
          <form method="get" className="rounded-2xl border border-zinc-100 bg-white p-4 shadow-sm space-y-3">
            <div className="grid gap-3 md:grid-cols-[1fr_auto_auto]">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder="Search products…"
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
              />
              <select
                name="sort"
                defaultValue={sort}
                className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm"
              >
                <option value="">Featured</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="alpha">Name: A → Z</option>
              </select>
              <button type="submit" className="rounded-full px-5 py-2 text-sm font-semibold text-white" style={{ background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))" }}>
                Apply
              </button>
            </div>
            {categories.length ? (
              <div className="flex flex-wrap gap-2">
                <Link
                  href={buildHref({ cat: null })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${!cat ? "border-transparent bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"}`}
                >
                  All
                </Link>
                {categories.map((c) => (
                  <Link
                    key={c}
                    href={buildHref({ cat: c })}
                    className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${cat === c ? "border-transparent bg-zinc-900 text-white" : "border-zinc-200 text-zinc-700 hover:border-zinc-400"}`}
                  >
                    {c}
                  </Link>
                ))}
              </div>
            ) : null}
            <p className="text-xs text-zinc-500">
              {filtered.length} item{filtered.length !== 1 ? "s" : ""}
              {q ? ` matching "${q}"` : ""}
              {cat ? ` in ${cat}` : ""}
            </p>
          </form>
        </div>
      </section>

      <section className="pb-12">
        <EcommerceGrid products={filtered} />
      </section>
    </main>
  );
}
