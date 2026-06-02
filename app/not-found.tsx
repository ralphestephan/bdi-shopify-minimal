import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 text-center">
      <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Page not found</h1>
      <p className="mt-3 text-sm text-zinc-600">The page you were looking for does not exist.</p>
      <div className="mt-8">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-semibold"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
