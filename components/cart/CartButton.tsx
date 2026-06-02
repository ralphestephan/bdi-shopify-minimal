"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "./CartContext";

export default function CartButton({ className = "" }: { className?: string }) {
  const { setOpen, count, hydrated } = useCart();
  return (
    <button
      type="button"
      aria-label="Open cart"
      onClick={() => setOpen(true)}
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-400 transition ${className}`}
    >
      <ShoppingBag className="h-5 w-5" />
      {hydrated && count > 0 ? (
        <span
          className="absolute -top-1 -right-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full px-1 text-[11px] font-semibold text-white"
          style={{ background: "var(--brand-color, #0019FF)" }}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}
