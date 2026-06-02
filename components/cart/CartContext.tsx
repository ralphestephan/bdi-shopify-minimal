// components/cart/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = {
  id: string; // Shopify variant ID
  title: string;
  price: number;
  img?: string;
  qty: number;
  handle?: string;
};

type CartCtx = {
  lines: CartLine[];
  add: (line: Omit<CartLine, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  changeQty: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  hydrated: boolean;
};

const Ctx = createContext<CartCtx | null>(null);

const STORAGE_KEY = "bdi-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setLines(parsed);
      } catch {}
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && hydrated) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    }
  }, [lines, hydrated]);

  const add: CartCtx["add"] = (l, qty = 1) => {
    setLines((prev) => {
      const next = [...prev];
      const i = next.findIndex((x) => x.id === l.id);
      if (i >= 0) {
        next[i] = { ...next[i], qty: next[i].qty + qty };
      } else {
        next.push({ ...l, qty });
      }
      return next;
    });
    setOpen(true);
  };

  const remove = (id: string) => setLines((prev) => prev.filter((x) => x.id !== id));
  const changeQty = (id: string, qty: number) =>
    setLines((prev) =>
      prev.map((x) => (x.id === id ? { ...x, qty: Math.max(1, qty) } : x))
    );
  const clearCart = () => setLines([]);

  const total = useMemo(() => lines.reduce((s, l) => s + l.price * l.qty, 0), [lines]);
  const count = useMemo(() => lines.reduce((s, l) => s + l.qty, 0), [lines]);

  return (
    <Ctx.Provider value={{ lines, add, remove, changeQty, clearCart, total, count, open, setOpen, hydrated }}>
      {children}
    </Ctx.Provider>
  );
}

export const useCart = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCart must be used within CartProvider");
  return v;
};
