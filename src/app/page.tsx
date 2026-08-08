import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import ListingCard from "@/components/ListingCard";
import type { Prisma } from "@prisma/client";

const PAGE_SIZE = 12;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; page?: string }>;
}) {
  const { q, category, page } = await searchParams;

  const query = (q ?? "").trim();
  const activeCategory = CATEGORIES.find((c) => c === category);
  const currentPage = Math.max(1, Number(page) || 1);

  // Only APPROVED listings are ever visible here — pending and rejected work
  // stays inside the owner's dashboard and the admin queue.
  const where: Prisma.ListingWhereInput = {
    status: "APPROVED",
    ...(activeCategory ? { category: activeCategory } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { description: { contains: query } },
            { location: { contains: query } },
          ],
        }
      : {}),
  };

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { reviewedAt: "desc" },
      skip: (currentPage - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        location: true,
        coverImage: true,
        rateAmount: true,
        rateCurrency: true,
        rateUnit: true,
      },
    }),
    prisma.listing.count({ where }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const buildHref = (patch: Record<string, string | undefined>) => {
    const params = new URLSearchParams();
    const next = { q: query || undefined, category: activeCategory, ...patch };
    for (const [k, v] of Object.entries(next)) if (v) params.set(k, v);
    const qs = params.toString();
    return qs ? `/?${qs}` : "/";
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="rounded-2xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-950 px-6 py-14 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Find models, massage and parlor services
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-300">
          Every listing is reviewed by our team before it goes live. Compare
          rates and availability across Bangalore, Hyderabad, Mumbai, Delhi,
          Pune and more.
        </p>

        <form action="/" className="mx-auto mt-7 flex max-w-lg gap-2">
          {activeCategory && (
            <input type="hidden" name="category" value={activeCategory} />
          )}
          <input
            name="q"
            defaultValue={query}
            className="input"
            placeholder="Search by service, city or keyword…"
            aria-label="Search listings"
          />
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
        </form>
      </section>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href={buildHref({ category: undefined, page: undefined })}
          className={
            !activeCategory
              ? "btn bg-brand-500 text-white"
              : "btn border border-ink-700 text-ink-300 hover:bg-ink-800"
          }
        >
          All
        </Link>
        {CATEGORIES.map((c) => (
          <Link
            key={c}
            href={buildHref({ category: c, page: undefined })}
            className={
              activeCategory === c
                ? "btn bg-brand-500 text-white"
                : "btn border border-ink-700 text-ink-300 hover:bg-ink-800"
            }
          >
            {c}
          </Link>
        ))}
      </div>

      <p className="mt-6 text-sm text-ink-400">
        {total} listing{total === 1 ? "" : "s"}
        {query && <> matching &ldquo;{query}&rdquo;</>}
      </p>

      {listings.length === 0 ? (
        <div className="card mt-4 p-14 text-center">
          <p className="text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-ink-400">
            Try a different search, or be the first to post a listing.
          </p>
          <Link href="/signup" className="btn-primary mt-5">
            Post a listing
          </Link>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          {currentPage > 1 && (
            <Link
              href={buildHref({ page: String(currentPage - 1) })}
              className="btn-ghost"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-400">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link
              href={buildHref({ page: String(currentPage + 1) })}
              className="btn-ghost"
            >
              Next
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
