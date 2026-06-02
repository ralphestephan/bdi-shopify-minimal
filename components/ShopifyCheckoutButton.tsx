// components/ShopifyCheckoutButton.tsx
//
// Routes the cart to Shopify's hosted checkout via the Storefront
// Cart API. Cart is created on demand by POST /api/checkout, which
// returns a Shopify checkoutUrl. The button then redirects.

"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function ShopifyCheckoutButton({ className = "" }: { className?: string }) {
  const { lines } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = !lines?.length || loading;

  async function go() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lines: lines.map((l) => ({ merchandiseId: l.id, quantity: l.qty })),
        }),
      });
      const json = await res.json();
      if (json?.url) {
        window.location.href = json.url;
        return;
      }
      setError(json?.error || "Checkout failed. Please try again.");
    } catch (err: any) {
      setError(err?.message || "Checkout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={go}
        disabled={disabled}
        className={`block w-full h-11 rounded-full font-semibold text-white transition disabled:opacity-50 ${className}`}
        style={{
          background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))",
        }}
      >
        {loading ? "Loading…" : "Checkout"}
      </button>
      {error ? <p className="text-xs text-red-600 text-center">{error}</p> : null}
    </div>
  );
}
