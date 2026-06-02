// app/api/products/route.ts
//
// JSON product feed (handy for previews, AI editors, integrations).

import { NextResponse } from "next/server";
import { getProducts } from "@/lib/shopify";

export const runtime = "nodejs";

export async function GET() {
  const products = await getProducts(100);
  return NextResponse.json({ products });
}
