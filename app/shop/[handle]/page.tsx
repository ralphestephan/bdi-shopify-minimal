// app/shop/[handle]/page.tsx (SERVER)
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { getProductByHandle } from "@/lib/shopify";
import { formatCurrency } from "@/lib/utils";
import RecommendedProducts from "@/components/RecommendedProducts";
import SEOJsonLd from "@/components/SEOJsonLd";
import AddToCartButton from "./add-to-cart-button";

export async function generateMetadata({
  params,
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const p = await getProductByHandle(params.handle);
  if (!p) return { title: "Product not found" };
  return {
    title: p.title,
    description: p.description.slice(0, 240),
    alternates: { canonical: `/shop/${p.handle}` },
    openGraph: {
      title: p.title,
      description: p.description.slice(0, 240),
      images: p.img ? [{ url: p.img }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const p = await getProductByHandle(params.handle);
  if (!p) notFound();

  return (
    <main className="w-full">
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.title,
          description: p.description.slice(0, 600),
          image: p.images.length ? p.images : p.img,
          sku: p.id,
          brand: p.vendor || SITE.org.legalName,
          offers: {
            "@type": "Offer",
            price: p.price.toFixed(2),
            priceCurrency: p.currency || SITE.currency,
            availability: p.available
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock",
          },
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-10">
        <Link href="/shop" className="text-xs font-semibold text-zinc-500 hover:text-zinc-800">
          ← Back to shop
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-2xl border border-zinc-100 bg-zinc-50">
              {p.img ? (
                <Image src={p.img} alt={p.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" priority />
              ) : null}
            </div>
            {p.images.length > 1 ? (
              <div className="grid grid-cols-4 gap-2">
                {p.images.slice(0, 4).map((src, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden rounded-lg border border-zinc-100">
                    <Image src={src} alt={`${p.title} ${i + 1}`} fill sizes="120px" className="object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div>
            {p.productType ? (
              <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
                {p.productType}
              </span>
            ) : null}
            <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
              {p.title}
            </h1>
            {p.vendor ? <p className="mt-1 text-sm text-zinc-500">by {p.vendor}</p> : null}
            <p className="mt-4 text-2xl font-bold text-zinc-900">
              {formatCurrency(p.price, p.currency || SITE.currency)}
            </p>
            <p className={`mt-1 text-xs ${p.available ? "text-emerald-600" : "text-zinc-500"}`}>
              {p.available ? "In stock" : "Sold out"}
            </p>

            <div className="mt-6">
              <AddToCartButton
                variantId={p.variantId}
                title={p.title}
                price={p.price}
                img={p.img}
                handle={p.handle}
                available={p.available}
              />
            </div>

            {p.description ? (
              <div className="mt-8 text-sm text-zinc-700 leading-7 whitespace-pre-wrap">
                {p.description}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* @ts-expect-error Async server component */}
      <RecommendedProducts exclude={p.handle} heading="You might also like" limit={3} />
    </main>
  );
}
