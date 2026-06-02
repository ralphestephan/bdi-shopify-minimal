# bdi-shopify-minimal

**BDI Shopify-style minimal template.** Pure storefront — Hero, product grid,
product page, cart, and Shopify-hosted checkout. No CMS, no insights, no
solutions sections, no auth. Drop in a Shopify store via the Storefront API,
set a couple of env vars, and ship.

This is one of the official BDI tenant templates picked up by the
`/api/provision-tenant` generate flow. It is marked as a **GitHub template
repo** so platform-driven tenant provisioning can fork it cleanly.

---

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Shopify Storefront API (read products, mint hosted checkout)
- Supabase JS (for the BDI `get_tenant_brand` RPC)

---

## Pages

| Route | Notes |
| --- | --- |
| `/` | Hero (brand-driven copy) + featured product strip |
| `/shop` | Catalog with search / category / sort |
| `/shop/[handle]` | Product detail page + recommendations |
| `/checkout` | Mints a Shopify cart and redirects to hosted checkout |
| `/order` | Generic "thank you" landing (Shopify owns the receipt) |
| `/contact` | Simple contact form → `/api/contact` |

API:

| Route | Notes |
| --- | --- |
| `POST /api/checkout` | Creates Shopify cart, returns `checkoutUrl` |
| `POST /api/contact` | Receives form submissions (wire to Resend/CRM) |
| `GET /api/products` | JSON product feed (preview / integrations) |

---

## Required env vars

Copy `.env.example` to `.env.local` and fill in:

```bash
# BDI platform identity
NEXT_PUBLIC_BDI_ORGANIZATION_ID=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Shopify
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=mystore.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=
SHOPIFY_API_VERSION=2024-10

# Multi-tenant tag filter (only when sharing one BDI Shopify store)
BDI_ORG_TAG_PREFIX=bdi-org
BDI_ORGANIZATION_ID=

# Brand fallbacks
NEXT_PUBLIC_BRAND_NAME=My Store
NEXT_PUBLIC_BRAND_TAGLINE=Shop the latest products.
NEXT_PUBLIC_BRAND_DESCRIPTION=
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_LOGO_URL=
NEXT_PUBLIC_OG_IMAGE=
NEXT_PUBLIC_LEGAL_NAME=
NEXT_PUBLIC_SUPPORT_EMAIL=
NEXT_PUBLIC_SUPPORT_PHONE=
NEXT_PUBLIC_BRAND_COLOR=#0019FF
NEXT_PUBLIC_BRAND_ACCENT=#00C774
NEXT_PUBLIC_CURRENCY=USD
```

Everything except `NEXT_PUBLIC_SUPABASE_*` and `NEXT_PUBLIC_SHOPIFY_*` is
optional. The site falls back gracefully when a value is empty.

---

## Dynamic-brand contract

The same pattern used by other BDI tenant templates (e.g. `ralphestephan/vealive`
and `ralphestephan/bdi`): brand identity is *read at request time* from the
platform's `get_tenant_brand(p_org_id uuid)` Supabase RPC and merged with the
build-time env-var fallbacks.

This means a tenant on the BDI platform can re-brand their live site (logo,
name, tagline, colors, sections enabled) by editing
`organizations.settings.brand` — no redeploy, no env-var rotation.

**Server-side fetch:** `lib/tenant-brand.ts` exports `getTenantBrand()` which
calls the RPC with `p_org_id = NEXT_PUBLIC_BDI_ORGANIZATION_ID`.

**Client-side hook:** `useSiteBrand()` returns the same shape, hydrated from
env vars (for fully static islands). Pass server-fetched brand down via props
when you need true per-request rebrand.

**Expected RPC return shape:**

```ts
{
  name: string;
  tagline: string;
  description: string;
  logo_url: string;
  og_image: string;
  brand_color: string;   // #hex
  brand_accent: string;  // #hex
  support_email: string;
  support_phone: string;
  enabled_sections: { hero: boolean; recommended: boolean; grid: boolean; ... };
}
```

On any error (RPC missing, org ID missing, network), the template silently
falls back to the env-var values so the site never breaks.

---

## Shopify connection modes

This template supports two Shopify deployment modes (same code, different env):

### Mode A — Tenant has their own Shopify store
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = tenant's own store
- Leave `BDI_ORG_TAG_PREFIX` and `BDI_ORGANIZATION_ID` **empty**
- All products in that store render on the storefront

### Mode B — Tenant on the shared BDI Shopify store
- `NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN` = the shared BDI store domain
- Set `BDI_ORG_TAG_PREFIX=bdi-org` and `BDI_ORGANIZATION_ID=<tenant uuid>`
- Storefront filters by tag `bdi-org:<uuid>`, hiding other tenants' catalogs

The tag prefix is stripped from the product display so customers never see it.

---

## Local dev

```bash
npm install
cp .env.example .env.local
# fill in NEXT_PUBLIC_SHOPIFY_* and NEXT_PUBLIC_SUPABASE_*
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy

Build runs cleanly on Vercel with zero config. The platform's
`/api/provision-tenant` flow handles fork + env-var seeding when a new BDI
tenant chooses the "Shopify storefront" template.
