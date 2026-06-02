// lib/shopify.ts
//
// Shopify Storefront API client. Minimal subset — list + by-handle +
// (optionally) tag-filtered for multi-tenant shared stores.
//
// Env:
//   NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN
//   NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN
//   SHOPIFY_API_VERSION (default 2024-10)
//   BDI_ORG_TAG_PREFIX + BDI_ORGANIZATION_ID (optional, for shared store)

import "server-only";

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || "";
const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-10";

const orgTagPrefix = process.env.BDI_ORG_TAG_PREFIX;
const orgId = process.env.BDI_ORGANIZATION_ID;
const orgTag = orgTagPrefix && orgId ? `${orgTagPrefix}:${orgId}` : null;

export type StorefrontProduct = {
  id: string;
  variantId: string;
  title: string;
  handle: string;
  description: string;
  price: number;
  currency: string;
  img: string;
  images: string[];
  available: boolean;
  vendor: string;
  tags: string[];
  productType: string;
};

export async function shopifyFetch<T>(query: string, variables?: Record<string, any>): Promise<T> {
  if (!domain || !token) {
    throw new Error(
      "Shopify is not configured. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN."
    );
  }
  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Shopify ${res.status} ${res.statusText}`);
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

const PRODUCT_FIELDS = /* GraphQL */ `
  id
  title
  handle
  description
  productType
  vendor
  tags
  featuredImage { url }
  images(first: 8) { nodes { url } }
  variants(first: 1) {
    nodes {
      id
      price { amount currencyCode }
      availableForSale
    }
  }
`;

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!, $query: String) {
    products(first: $first, sortKey: CREATED_AT, reverse: true, query: $query) {
      nodes { ${PRODUCT_FIELDS} }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = /* GraphQL */ `
  query ProductByHandle($handle: String!) {
    productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
  }
`;

function mapProduct(p: any): StorefrontProduct {
  const v0 = p.variants?.nodes?.[0];
  const images: string[] = (p.images?.nodes || []).map((n: any) => n.url).filter(Boolean);
  return {
    id: p.id,
    variantId: v0?.id || p.id,
    title: p.title,
    handle: p.handle,
    description: p.description || "",
    price: Number(v0?.price?.amount ?? 0),
    currency: v0?.price?.currencyCode || "USD",
    img: p.featuredImage?.url || images[0] || "",
    images,
    available: Boolean(v0?.availableForSale),
    vendor: p.vendor || "",
    tags: Array.isArray(p.tags)
      ? p.tags.filter((t: string) => !orgTagPrefix || !t.startsWith(`${orgTagPrefix}:`))
      : [],
    productType: p.productType || "",
  };
}

export async function getProducts(first = 60): Promise<StorefrontProduct[]> {
  const query = orgTag ? `tag:"${orgTag}"` : undefined;
  try {
    const data = await shopifyFetch<{ products: { nodes: any[] } }>(PRODUCTS_QUERY, {
      first,
      query,
    });
    return (data?.products?.nodes ?? []).map(mapProduct);
  } catch (err) {
    console.error("[shopify] getProducts failed:", err);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<StorefrontProduct | null> {
  try {
    const data = await shopifyFetch<{ productByHandle: any }>(PRODUCT_BY_HANDLE_QUERY, { handle });
    if (!data?.productByHandle) return null;
    return mapProduct(data.productByHandle);
  } catch (err) {
    console.error("[shopify] getProductByHandle failed:", err);
    return null;
  }
}

// ---- Cart / checkout (Storefront Cart API) ---------------------------------

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function createCheckoutUrl(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<string | null> {
  if (!lines.length) return null;
  try {
    const data = await shopifyFetch<{
      cartCreate: { cart: { checkoutUrl: string } | null; userErrors: any[] };
    }>(CART_CREATE, { lines });
    if (data?.cartCreate?.userErrors?.length) {
      console.error("[shopify] cart errors:", data.cartCreate.userErrors);
    }
    return data?.cartCreate?.cart?.checkoutUrl ?? null;
  } catch (err) {
    console.error("[shopify] createCheckoutUrl failed:", err);
    return null;
  }
}
