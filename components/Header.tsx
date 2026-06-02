"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";
import CartButton from "@/components/cart/CartButton";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/95 backdrop-blur">
      <nav className="mx-auto max-w-6xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" aria-label={`${SITE.brand} home`} className="inline-flex items-center gap-2">
            {SITE.org.logo ? (
              <Image
                src={SITE.org.logo}
                alt={SITE.brand}
                width={140}
                height={36}
                className="h-8 w-auto object-contain"
                priority
              />
            ) : (
              <span className="text-lg font-bold tracking-tight">{SITE.brand}</span>
            )}
          </Link>

          <ul className="hidden md:flex items-center gap-7 text-sm font-medium">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className={`transition-colors ${pathname === l.href ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"}`}
                  aria-current={pathname === l.href ? "page" : undefined}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <CartButton />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="md:hidden border-t border-zinc-100 py-3">
            <ul className="space-y-1">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === l.href ? "bg-zinc-100" : "hover:bg-zinc-50"}`}
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
