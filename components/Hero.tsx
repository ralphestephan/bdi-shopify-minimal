// components/Hero.tsx
//
// Placeholder hero — reads brand identity from useSiteBrand() so the
// same template hydrates with any tenant's name/tagline via env vars
// or the dynamic-brand RPC.

"use client";

import Link from "next/link";
import { useSiteBrand } from "@/lib/tenant-brand";

export default function Hero() {
  const brand = useSiteBrand();

  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 opacity-10"
        style={{
          background: `linear-gradient(135deg, ${brand.brandColor}, ${brand.brandAccent})`,
        }}
      />
      <div className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-3xl">
          <span
            className="inline-flex items-center rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-zinc-600"
          >
            {brand.name}
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-zinc-900">
            {brand.tagline}
          </h1>
          {brand.description ? (
            <p className="mt-4 text-base md:text-lg text-zinc-700 max-w-[60ch]">
              {brand.description}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
              style={{
                background: `linear-gradient(90deg, ${brand.brandColor}, ${brand.brandAccent})`,
              }}
            >
              Shop now →
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold text-zinc-800 hover:border-zinc-500"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
