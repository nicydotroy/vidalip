import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <p className="text-5xl font-bold text-brand-400">404</p>
      <h1 className="mt-4 text-xl font-semibold">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-sm text-ink-400">
        The listing may have been removed, or it may still be awaiting review.
      </p>
      <Link href="/" className="btn-primary mt-6">
        Browse listings
      </Link>
    </div>
  );
}
