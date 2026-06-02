// app/order/page.tsx
//
// Generic order landing — Shopify handles the real post-checkout
// experience. This page is here as a "thanks" fallback for tenants that
// want to redirect back from Shopify after a purchase.

import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Thank you",
};

export default function OrderPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Thank you for your order</h1>
      <p className="mt-3 text-sm text-zinc-600">
        {SITE.brand} has received your order. Check your email for a confirmation from Shopify.
      </p>
      <div className="mt-8">
        <Link
          href="/shop"
          className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white"
          style={{
            background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))",
          }}
        >
          Keep shopping →
        </Link>
      </div>
    </main>
  );
}
