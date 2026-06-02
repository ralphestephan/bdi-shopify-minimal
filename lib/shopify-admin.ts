// lib/shopify-admin.ts
//
// Optional server-only Shopify Admin API helper. Used by edge routes
// that need to write (orders, fulfillments). Set SHOPIFY_ADMIN_API_TOKEN
// to enable. NOT exposed to the browser.

import "server-only";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const token = process.env.SHOPIFY_ADMIN_API_TOKEN || "";
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-10";

export async function shopifyAdminFetch<T>(
  query: string,
  variables?: Record<string, any>
): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Shopify Admin not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and SHOPIFY_ADMIN_API_TOKEN."
    );
  }
  const res = await fetch(`https://${domain}/admin/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify Admin ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}
