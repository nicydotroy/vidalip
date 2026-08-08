import ListingGrid from "@/components/ListingGrid";
import { CategoryLinks, CityLinks } from "@/components/BrowseLinks";
import { countByCity, findListingsPage } from "@/lib/listings";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page } = await searchParams;

  const query = (q ?? "").trim();
  const currentPage = Math.max(1, Number(page) || 1);

  // Category and city are no longer query parameters — each combination has
  // its own path (/models, /mumbai, /models-mumbai) handled by app/[slug].
  const [{ listings, total, totalPages }, cityCounts] = await Promise.all([
    findListingsPage({ query }, currentPage),
    countByCity(),
  ]);

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

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-ink-400">Category</h2>
        <CategoryLinks activeCategory={null} city={null} />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-400">City</h2>
        <CityLinks activeCity={null} category={null} counts={cityCounts} />
      </section>

      <ListingGrid
        listings={listings}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath="/"
        query={query || undefined}
      />
    </div>
  );
}
