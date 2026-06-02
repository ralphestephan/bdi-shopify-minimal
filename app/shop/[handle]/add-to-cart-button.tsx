"use client";

import { useState } from "react";
import { useCart } from "@/components/cart/CartContext";

export default function AddToCartButton({
  variantId,
  title,
  price,
  img,
  handle,
  available,
}: {
  variantId: string;
  title: string;
  price: number;
  img?: string;
  handle?: string;
  available?: boolean;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="flex items-center gap-3">
      <div className="inline-flex items-center rounded-full border border-zinc-200">
        <button
          type="button"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="px-3 py-2 rounded-l-full hover:bg-zinc-100"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="px-3 text-sm font-semibold tabular-nums w-8 text-center">{qty}</span>
        <button
          type="button"
          onClick={() => setQty((q) => q + 1)}
          className="px-3 py-2 rounded-r-full hover:bg-zinc-100"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => available && add({ id: variantId, title, price, img, handle }, qty)}
        disabled={!available}
        className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition disabled:bg-zinc-200 disabled:text-zinc-500"
        style={
          available
            ? { background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))" }
            : undefined
        }
      >
        {available ? "Add to cart" : "Sold out"}
      </button>
    </div>
  );
}
