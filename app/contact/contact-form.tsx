"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("ok");
      setMsg("Thanks — we will be in touch soon.");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("err");
      setMsg("Sorry, we couldn't send your message. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Name</label>
        <input
          required
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Email</label>
        <input
          required
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm focus:border-zinc-400 focus:outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-white disabled:opacity-60"
        style={{
          background: "linear-gradient(90deg, var(--brand-color, #0019FF), var(--brand-accent, #00C774))",
        }}
      >
        {status === "loading" ? "Sending…" : "Send message"}
      </button>
      <p
        aria-live="polite"
        className={`text-sm ${
          status === "ok" ? "text-emerald-600" : status === "err" ? "text-red-600" : "text-zinc-500"
        }`}
      >
        {msg}
      </p>
    </form>
  );
}
