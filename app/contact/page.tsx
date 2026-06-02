// app/contact/page.tsx
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import ContactForm from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${SITE.brand}.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-900">Contact us</h1>
      <p className="mt-3 text-sm text-zinc-600">
        Questions about an order or product? Send us a message and we will get back to you.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[2fr_1fr]">
        <ContactForm />
        <aside className="rounded-2xl border border-zinc-100 bg-white p-5 text-sm space-y-3">
          <div>
            <p className="font-semibold text-zinc-900">{SITE.org.legalName || SITE.brand}</p>
            <p className="text-zinc-600 mt-1">{SITE.tagline}</p>
          </div>
          {SITE.contact.email ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400">Email</p>
              <a href={`mailto:${SITE.contact.email}`} className="text-zinc-800 hover:underline">
                {SITE.contact.email}
              </a>
            </div>
          ) : null}
          {SITE.contact.phone ? (
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-400">Phone</p>
              <a href={`tel:${SITE.contact.phone.replace(/\s+/g, "")}`} className="text-zinc-800 hover:underline">
                {SITE.contact.phone}
              </a>
            </div>
          ) : null}
        </aside>
      </div>
    </main>
  );
}
