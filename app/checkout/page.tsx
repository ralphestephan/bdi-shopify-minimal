// app/checkout/page.tsx
//
// Minimal checkout — redirects to Shopify's hosted checkout via the
// Storefront Cart API. The actual cart-to-checkoutUrl creation runs in
// /api/checkout; the page just renders a summary while the redirect
// kicks in.

"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useCart } from "@/components/cart/CartContext";
import { SITE } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutPage() {
  const { lines, total, hydrated, clearCart } = useCart();
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => lines || [], [lines]);

  useEffect(() => {
    if (!hydrated || items.length === 0) return;
    let cancelled = false;
    setRedirecting(true);
    setError(null);
    fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: items.map((l) => ({ merchandiseId: l.id, quantity: l.qty })),
      }),
    })
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (json?.url) {
          window.location.href = json.url;
          // Cart will be re-validated on Shopify's side; clear locally.
          clearCart();
        } else {
          setError(json?.error || "Checkout failed.");
          setRedirecting(false);
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message || "Checkout failed.");
        setRedirecting(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Checkout</h1>
      <p className="mt-2 text-sm text-zinc-600">
        {redirecting ? "Redirecting you to secure checkout…" : "Review your order."}
      </p>

      {error ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <section className="mt-8 rounded-2xl border border-zinc-100 bg-white">
        <div className="p-4 border-b border-zinc-100">
          <h2 className="font-semibold">Order summary</h2>
        </div>
        <ul className="divide-y divide-zinc-100">
          {items.length === 0 ? (
            <li className="p-6 text-center text-sm text-zinc-500">Your cart is empty.</li>
          ) : (
            items.map((l) => (
              <li key={l.id} className="flex gap-3 p-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-100 bg-zinc-50">
                  {l.img ? (
                    <Image src={l.img} alt={l.title} fill sizes="64px" className="object-cover" />
                  ) : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-2">{l.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Qty {l.qty} · {formatCurrency(l.price, SITE.currency)} each
                  </p>
                </div>
                <p className="font-semibold text-sm tabular-nums">
                  {formatCurrency(l.price * l.qty, SITE.currency)}
                </p>
              </li>
            ))
          )}
        </ul>
        <div className="border-t border-zinc-100 p-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(total, SITE.currency)}</span>
          </div>
          <p className="text-[11px] text-zinc-500">
            Shipping & taxes calculated at the next step.
          </p>
        </div>
      </section>
    </main>
  );
}
