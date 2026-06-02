// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SITE } from "@/lib/site";
import Header from "@/components/Header";
import SiteFooter from "@/components/SiteFooter";
import CartDrawer from "@/components/cart/CartDrawer";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: SITE.baseUrl ? new URL(SITE.baseUrl) : undefined,
  title: {
    default: SITE.name,
    template: `%s | ${SITE.brand}`,
  },
  description: SITE.description,
  openGraph: {
    type: "website",
    url: SITE.baseUrl,
    title: SITE.name,
    description: SITE.description,
    siteName: SITE.name,
    ...(SITE.ogImage ? { images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }] } : {}),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.name,
    description: SITE.description,
    ...(SITE.ogImage ? { images: [SITE.ogImage] } : {}),
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE.baseUrl },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: `:root{--brand-color:${SITE.colors.brand};--brand-accent:${SITE.colors.accent};}`,
          }}
        />
      </head>
      <body className="min-h-screen text-zinc-800 antialiased overflow-x-hidden">
        <Providers>
          <Header />
          <main className="w-full overflow-x-clip">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  );
}
