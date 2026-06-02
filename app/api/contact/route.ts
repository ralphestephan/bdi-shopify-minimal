// app/api/contact/route.ts
//
// Minimal contact-form endpoint. Logs to the server; tenants are
// expected to wire this to email (Resend), CRM, or webhook of choice.

import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body || {};
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }
    // TODO: forward to Resend / webhook / Supabase row.
    console.log("[contact]", { name, email, message });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Bad request" }, { status: 400 });
  }
}
