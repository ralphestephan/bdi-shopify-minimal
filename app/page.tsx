// app/page.tsx
import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import Hero from "@/components/Hero";
import RecommendedProducts from "@/components/RecommendedProducts";
import SEOJsonLd from "@/components/SEOJsonLd";

export const metadata: Metadata = {
  title: SITE.name,
  description: SITE.description,
  alternates: { canonical: "/" },
};

export default function Page() {
  return (
    <>
      <SEOJsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE.org.legalName,
          url: SITE.org.url,
          logo: SITE.org.logo,
        }}
      />
      <Hero />
      {/* RecommendedProducts is a server component that fetches from Shopify */}
      {/* @ts-expect-error Async server component */}
      <RecommendedProducts heading="Featured" limit={6} />
    </>
  );
}
