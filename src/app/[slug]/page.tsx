import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ListingGrid from "@/components/ListingGrid";
import { CategoryLinks, CityLinks } from "@/components/BrowseLinks";
import {
  allBrowsePaths,
  browseHref,
  browseTitle,
  resolveBrowseSlug,
} from "@/lib/locations";
import { countByCity, findListingsPage } from "@/lib/listings";
import { SITE } from "@/lib/site";

/**
 * Category and city browse pages: /models, /mumbai, /models-mumbai.
 *
 * This is a root-level dynamic segment, so it also catches paths that match
 * nothing else. Next resolves static routes (/about, /login, ...) first, and
 * anything the slug resolver does not recognise 404s rather than rendering an
 * unfiltered list under an invented URL.
 */

/** Pre-render the full set at build time; they are a fixed, small list. */
export function generateStaticParams() {
  return allBrowsePaths().map((path) => ({ slug: path.replace(/^\//, "") }));
}

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const browse = resolveBrowseSlug(slug);

  if (!browse) return { title: "Page not found" };

  const title = browseTitle(browse);
  const where = browse.city ? ` in ${browse.city}` : " across India";

  return {
    title,
    description: `Browse reviewed ${title.toLowerCase()}${
      browse.city ? "" : ""
    } on ${SITE.name}. Compare rates and availability${where}, and get in touch directly.`,
    alternates: { canonical: browseHref(browse) },
  };
}

export default async function BrowsePage({ params, searchParams }: Props) {
  const { slug } = await params;
  const browse = resolveBrowseSlug(slug);

  if (!browse) notFound();

  const { q, page } = await searchParams;
  const query = (q ?? "").trim();
  const currentPage = Math.max(1, Number(page) || 1);

  const [{ listings, total, totalPages }, cityCounts] = await Promise.all([
    findListingsPage(
      { category: browse.category, city: browse.city, query },
      currentPage,
    ),
    countByCity(browse.category),
  ]);

  const heading = browseTitle(browse);
  const basePath = browseHref(browse);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="rounded-2xl border border-ink-800 bg-gradient-to-br from-ink-900 to-ink-950 px-6 py-12 text-center">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {heading}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-ink-300">
          {total} reviewed {total === 1 ? "listing" : "listings"}
          {browse.city ? ` in ${browse.city}` : ""}. Every one is checked by our
          team before it goes live.
        </p>

        <form action={basePath} className="mx-auto mt-7 flex max-w-lg gap-2">
          <input
            name="q"
            defaultValue={query}
            className="input"
            placeholder="Search within these listings…"
            aria-label="Search listings"
          />
          <button type="submit" className="btn-primary shrink-0">
            Search
          </button>
        </form>
      </header>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-ink-400">Category</h2>
        <CategoryLinks activeCategory={browse.category} city={browse.city} />
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-sm font-semibold text-ink-400">City</h2>
        <CityLinks
          activeCity={browse.city}
          category={browse.category}
          counts={cityCounts}
        />
      </section>

      <ListingGrid
        listings={listings}
        total={total}
        currentPage={currentPage}
        totalPages={totalPages}
        basePath={basePath}
        query={query || undefined}
        emptyHint={
          browse.city
            ? `No listings in ${browse.city} yet. Try another city, or be the first to post one.`
            : undefined
        }
      />
    </div>
  );
}
