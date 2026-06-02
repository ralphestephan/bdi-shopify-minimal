// lib/site.ts
//
// Static brand fallbacks driven by NEXT_PUBLIC_* env vars.
// Dynamic per-tenant brand (logo, colors, etc.) is fetched at request
// time via the BDI platform's `get_tenant_brand` Supabase RPC — see
// lib/tenant-brand.ts. This module is only the build-time fallback.
//
// Env vars (set per-tenant in Vercel project settings):
//   NEXT_PUBLIC_BRAND_NAME            "My Store"
//   NEXT_PUBLIC_BRAND_FULL_NAME       site <title> default; falls back to "<brand>"
//   NEXT_PUBLIC_BRAND_TAGLINE         hero tagline
//   NEXT_PUBLIC_BRAND_DESCRIPTION     <meta description> + OG description
//   NEXT_PUBLIC_SITE_URL              https://tenant.com
//   NEXT_PUBLIC_LOGO_URL              full URL to tenant logo; empty = text wordmark
//   NEXT_PUBLIC_OG_IMAGE              full path or URL to 1200x630 OG image
//   NEXT_PUBLIC_LEGAL_NAME            company legal name
//   NEXT_PUBLIC_SUPPORT_EMAIL         contact email
//   NEXT_PUBLIC_SUPPORT_PHONE         contact phone
//   NEXT_PUBLIC_BRAND_COLOR           primary brand color (#hex)
//   NEXT_PUBLIC_BRAND_ACCENT          accent brand color (#hex)
//   NEXT_PUBLIC_CURRENCY              ISO 4217 (default USD)
const brand = process.env.NEXT_PUBLIC_BRAND_NAME || "My Store";
const fullName = process.env.NEXT_PUBLIC_BRAND_FULL_NAME || brand;
const tagline = process.env.NEXT_PUBLIC_BRAND_TAGLINE || "Shop the latest products.";
const description =
  process.env.NEXT_PUBLIC_BRAND_DESCRIPTION ||
  `${brand} — curated products delivered fast.`;
const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const logo = process.env.NEXT_PUBLIC_LOGO_URL ?? "";
const ogImage = process.env.NEXT_PUBLIC_OG_IMAGE || "";
const legalName = process.env.NEXT_PUBLIC_LEGAL_NAME || brand;
const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "";
const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || "";
const brandColor = process.env.NEXT_PUBLIC_BRAND_COLOR || "#0019FF";
const brandAccent = process.env.NEXT_PUBLIC_BRAND_ACCENT || "#00C774";
const currency = process.env.NEXT_PUBLIC_CURRENCY || "USD";

export const SITE = {
  name: fullName,
  brand,
  tagline,
  baseUrl,
  description,
  ogImage,
  currency,
  colors: {
    brand: brandColor,
    accent: brandAccent,
  },
  org: {
    legalName,
    url: baseUrl,
    logo,
  },
  contact: {
    email: supportEmail,
    phone: supportPhone,
  },
} as const;
