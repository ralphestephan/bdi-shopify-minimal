// app/api/checkout/route.ts
//
// Creates a Shopify cart from local cart lines and returns the hosted
// `checkoutUrl`. The client redirects to it.

import { NextResponse } from "next/server";
import { createCheckoutUrl } from "@/lib/shopify";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const lines: Array<{ merchandiseId: string; quantity: number }> = Array.isArray(body?.lines)
      ? body.lines
      : [];
    if (!lines.length) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }
    const url = await createCheckoutUrl(lines);
    if (!url) return NextResponse.json({ error: "Could not create checkout." }, { status: 500 });
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Checkout error" },
      { status: 500 }
    );
  }
}
