// components/SiteFooter.tsx
import Link from "next/link";
import { SITE } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-zinc-100 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="text-lg font-bold tracking-tight">{SITE.brand}</p>
          <p className="mt-2 text-zinc-600 max-w-[40ch]">{SITE.tagline}</p>
        </div>

        <nav aria-label="Explore">
          <h4 className="font-semibold text-zinc-900">Explore</h4>
          <ul className="mt-2 space-y-1.5">
            <li><Link href="/" className="text-zinc-600 hover:text-zinc-900">Home</Link></li>
            <li><Link href="/shop" className="text-zinc-600 hover:text-zinc-900">Shop</Link></li>
            <li><Link href="/contact" className="text-zinc-600 hover:text-zinc-900">Contact</Link></li>
          </ul>
        </nav>

        <address className="not-italic">
          <h4 className="font-semibold text-zinc-900">Contact</h4>
          <ul className="mt-2 space-y-1.5 text-zinc-600">
            {SITE.contact.email ? (
              <li>
                <a href={`mailto:${SITE.contact.email}`} className="hover:text-zinc-900">
                  {SITE.contact.email}
                </a>
              </li>
            ) : null}
            {SITE.contact.phone ? (
              <li>
                <a href={`tel:${SITE.contact.phone.replace(/\s+/g, "")}`} className="hover:text-zinc-900">
                  {SITE.contact.phone}
                </a>
              </li>
            ) : null}
          </ul>
        </address>
      </div>

      <div className="border-t border-zinc-100">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>© {new Date().getFullYear()} {SITE.org.legalName || SITE.brand}. All rights reserved.</div>
          <div>Powered by BDI</div>
        </div>
      </div>
    </footer>
  );
}
