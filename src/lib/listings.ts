import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { CATEGORIES } from "./constants";
import { CITIES, type Category, type City } from "./locations";

export const PAGE_SIZE = 12;

/** The columns ListingCard needs — kept in one place so callers cannot drift. */
export const LISTING_CARD_SELECT = {
  id: true,
  slug: true,
  title: true,
  category: true,
  location: true,
  coverImage: true,
  rateAmount: true,
  rateCurrency: true,
  rateUnit: true,
} satisfies Prisma.ListingSelect;

export type Filters = {
  category?: Category | null;
  city?: City | null;
  query?: string;
};

/**
 * Only APPROVED listings are ever public — pending and rejected work stays in
 * the owner's dashboard and the admin queue.
 *
 * City matching is a substring test against the freeform `location` field,
 * case-insensitively. `mode: "insensitive"` matters on Postgres: without it
 * "mumbai" would not match "Mumbai".
 */
export function listingWhere({
  category,
  city,
  query,
}: Filters): Prisma.ListingWhereInput {
  const text = (query ?? "").trim();

  return {
    status: "APPROVED",
    ...(category ? { category } : {}),
    ...(city
      ? { location: { contains: city, mode: "insensitive" as const } }
      : {}),
    ...(text
      ? {
          OR: [
            { title: { contains: text, mode: "insensitive" as const } },
            { description: { contains: text, mode: "insensitive" as const } },
            { location: { contains: text, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };
}

/** One page of listings plus the total, for pagination. */
export async function findListingsPage(filters: Filters, page: number) {
  const where = listingWhere(filters);

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy: { reviewedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: LISTING_CARD_SELECT,
    }),
    prisma.listing.count({ where }),
  ]);

  return { listings, total, totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Approved listing count per city, for the "browse by city" panels. */
export async function countByCity(
  category: Category | null = null,
): Promise<Record<City, number>> {
  const counts = await Promise.all(
    CITIES.map((city) =>
      prisma.listing.count({ where: listingWhere({ category, city }) }),
    ),
  );

  return Object.fromEntries(
    CITIES.map((city, i) => [city, counts[i]]),
  ) as Record<City, number>;
}

/** Approved listing count per category, optionally scoped to one city. */
export async function countByCategory(
  city: City | null = null,
): Promise<Record<Category, number>> {
  const counts = await Promise.all(
    CATEGORIES.map((category) =>
      prisma.listing.count({ where: listingWhere({ category, city }) }),
    ),
  );

  return Object.fromEntries(
    CATEGORIES.map((category, i) => [category, counts[i]]),
  ) as Record<Category, number>;
}
