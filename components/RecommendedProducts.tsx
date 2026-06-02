// components/RecommendedProducts.tsx
// Server component — fetches latest products and shows top N as a strip.
import Link from "next/link";
import EcommerceGrid from "@/components/EcommerceGrid";
import { getProducts } from "@/lib/shopify";

export default async function RecommendedProducts({
  exclude,
  limit = 3,
  heading = "Recommended for you",
}: {
  exclude?: string;
  limit?: number;
  heading?: string;
}) {
  const all = await getProducts(12);
  const list = all.filter((p) => (exclude ? p.handle !== exclude : true)).slice(0, limit);
  if (!list.length) return null;

  return (
    <section className="py-10">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900">{heading}</h2>
          <Link href="/shop" className="text-sm font-semibold text-zinc-600 hover:text-zinc-900">
            View all →
          </Link>
        </div>
      </div>
      <EcommerceGrid products={list} />
    </section>
  );
}
