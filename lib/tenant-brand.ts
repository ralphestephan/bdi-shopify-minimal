// lib/tenant-brand.ts
//
// Dynamic-brand contract — runtime fetch of the tenant's brand
// (logo, colors, tagline, enabled sections) from the BDI platform's
// `get_tenant_brand` Supabase RPC. See `useSiteBrand()` hook for the
// client-side counterpart that hydrates with this server result.
//
// SHAPE expected from get_tenant_brand(p_org_id uuid):
//   {
//     "name": "My Store",
//     "tagline": "...",
//     "description": "...",
//     "logo_url": "https://...",
//     "og_image": "https://...",
//     "brand_color": "#hex",
//     "brand_accent": "#hex",
//     "support_email": "...",
//     "support_phone": "...",
//     "enabled_sections": { "hero": true, "recommended": true, ... }
//   }
//
// Falls back to NEXT_PUBLIC_* env vars (lib/site.ts) on any error,
// so a misconfigured tenant still renders.

import { createClient } from "@supabase/supabase-js";
import { SITE } from "./site";

export type TenantBrand = {
  name: string;
  tagline: string;
  description: string;
  logoUrl: string;
  ogImage: string;
  brandColor: string;
  brandAccent: string;
  supportEmail: string;
  supportPhone: string;
  enabledSections: Record<string, boolean>;
};

const FALLBACK: TenantBrand = {
  name: SITE.brand,
  tagline: SITE.tagline,
  description: SITE.description,
  logoUrl: SITE.org.logo,
  ogImage: SITE.ogImage,
  brandColor: SITE.colors.brand,
  brandAccent: SITE.colors.accent,
  supportEmail: SITE.contact.email,
  supportPhone: SITE.contact.phone,
  enabledSections: { hero: true, recommended: true, grid: true },
};

let supabaseClient: ReturnType<typeof createClient> | null = null;
function getClient() {
  if (supabaseClient) return supabaseClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  supabaseClient = createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return supabaseClient;
}

export async function getTenantBrand(): Promise<TenantBrand> {
  const orgId = process.env.NEXT_PUBLIC_BDI_ORGANIZATION_ID;
  const client = getClient();
  if (!orgId || !client) return FALLBACK;

  try {
    const { data, error } = await client.rpc("get_tenant_brand", { p_org_id: orgId });
    if (error || !data) return FALLBACK;
    const row: any = Array.isArray(data) ? data[0] : data;
    if (!row) return FALLBACK;
    return {
      name: row.name || FALLBACK.name,
      tagline: row.tagline || FALLBACK.tagline,
      description: row.description || FALLBACK.description,
      logoUrl: row.logo_url || FALLBACK.logoUrl,
      ogImage: row.og_image || FALLBACK.ogImage,
      brandColor: row.brand_color || FALLBACK.brandColor,
      brandAccent: row.brand_accent || FALLBACK.brandAccent,
      supportEmail: row.support_email || FALLBACK.supportEmail,
      supportPhone: row.support_phone || FALLBACK.supportPhone,
      enabledSections: (row.enabled_sections as Record<string, boolean>) || FALLBACK.enabledSections,
    };
  } catch {
    return FALLBACK;
  }
}

// Hook-style client export so client components can read brand
// from env-vars when no server data was passed down. For real
// dynamic per-request rebrand, pass the server result down via props.
export function useSiteBrand(): TenantBrand {
  return FALLBACK;
}
