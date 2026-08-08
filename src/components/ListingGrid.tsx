import Link from "next/link";
import ListingCard from "./ListingCard";

type Listing = React.ComponentProps<typeof ListingCard>["listing"] & {
  id: string;
};

/**
 * Results grid, empty state and pagination — shared by the homepage and every
 * category/city page so they cannot drift apart.
 *
 * Pagination stays on a `?page=` query parameter. Filters live in the path
 * (/models-mumbai), but a page number is not a distinct place and should not
 * mint its own URL segment.
 */
export default function ListingGrid({
  listings,
  total,
  currentPage,
  totalPages,
  basePath,
  query,
  emptyHint,
}: {
  listings: Listing[];
  total: number;
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: string;
  emptyHint?: string;
}) {
  const pageHref = (page: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <>
      <p className="mt-6 text-sm text-ink-400">
        {total} listing{total === 1 ? "" : "s"}
        {query && <> matching &ldquo;{query}&rdquo;</>}
      </p>

      {listings.length === 0 ? (
        <div className="card mt-4 p-14 text-center">
          <p className="text-lg font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-ink-400">
            {emptyHint ?? "Try a different search, or be the first to post a listing."}
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
            <Link href={pageHref(currentPage - 1)} className="btn-ghost">
              Previous
            </Link>
          )}
          <span className="text-sm text-ink-400">
            Page {currentPage} of {totalPages}
          </span>
          {currentPage < totalPages && (
            <Link href={pageHref(currentPage + 1)} className="btn-ghost">
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
