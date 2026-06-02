"use client";

import Image from "next/image";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "./CartContext";
import { SITE } from "@/lib/site";
import { formatCurrency } from "@/lib/utils";
import ShopifyCheckoutButton from "@/components/ShopifyCheckoutButton";

export default function CartDrawer() {
  const { lines, remove, changeQty, total, open, setOpen, hydrated } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-[90] bg-black/40 transition-opacity ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setOpen(false)}
        aria-hidden
      />
      <aside
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-md bg-white shadow-2xl transition-transform ${open ? "translate-x-0" : "translate-x-full"}`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 p-4">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full p-2 hover:bg-zinc-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[calc(100%-180px)] flex-col overflow-y-auto p-4">
          {!hydrated ? null : lines.length === 0 ? (
            <p className="my-auto text-center text-sm text-zinc-500">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {lines.map((l) => (
                <li key={l.id} className="flex gap-3">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50">
                    {l.img ? (
                      <Image src={l.img} alt={l.title} fill sizes="80px" className="object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm line-clamp-2">{l.title}</p>
                    <p className="text-xs text-zinc-500 mt-1">{formatCurrency(l.price, SITE.currency)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-full border border-zinc-200">
                        <button
                          type="button"
                          onClick={() => changeQty(l.id, l.qty - 1)}
                          className="px-2 py-1 hover:bg-zinc-100 rounded-l-full"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums">{l.qty}</span>
                        <button
                          type="button"
                          onClick={() => changeQty(l.id, l.qty + 1)}
                          className="px-2 py-1 hover:bg-zinc-100 rounded-r-full"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.id)}
                        className="text-zinc-400 hover:text-red-600"
                        aria-label="Remove from cart"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-zinc-100 p-4 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="font-semibold">{formatCurrency(total, SITE.currency)}</span>
          </div>
          <ShopifyCheckoutButton />
          <p className="text-[11px] text-zinc-500 text-center">Shipping & taxes calculated at checkout.</p>
        </div>
      </aside>
    </>
  );
}
