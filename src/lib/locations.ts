import { CATEGORIES } from "./constants";

export type Category = (typeof CATEGORIES)[number];

export const CITIES = [
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Pune",
] as const;

export type City = (typeof CITIES)[number];

/**
 * URL segment for each category. Written out rather than derived from the
 * label so the public URLs stay stable if a label is ever reworded — and so
 * that adding a category is a compile error here until you choose its slug.
 */
export const CATEGORY_SLUG: Record<Category, string> = {
  Model: "models",
  "Massage Service": "massage-service",
  "Parlor Service": "parlor-service",
};

export const CITY_SLUG: Record<City, string> = {
  Bangalore: "bangalore",
  Hyderabad: "hyderabad",
  Mumbai: "mumbai",
  Delhi: "delhi",
  Pune: "pune",
};

const SLUG_TO_CATEGORY = new Map(
  CATEGORIES.map((c) => [CATEGORY_SLUG[c], c] as const),
);

const SLUG_TO_CITY = new Map(CITIES.map((c) => [CITY_SLUG[c], c] as const));

export type Browse = {
  category: Category | null;
  city: City | null;
};

/**
 * Turn a URL segment into the filters it represents.
 *
 * Accepts three shapes:
 *   models              → category only
 *   mumbai              → city only
 *   models-mumbai       → both
 *
 * Returns null for anything else so the page can 404 rather than silently
 * rendering an unfiltered list under a made-up URL.
 */
export function resolveBrowseSlug(slug: string): Browse | null {
  const value = slug.toLowerCase();

  const cityOnly = SLUG_TO_CITY.get(value);
  if (cityOnly) return { category: null, city: cityOnly };

  const categoryOnly = SLUG_TO_CATEGORY.get(value);
  if (categoryOnly) return { category: categoryOnly, city: null };

  // Split on the first category prefix rather than the last hyphen, so city
  // slugs containing hyphens ("navi-mumbai") keep working.
  for (const [categorySlug, category] of SLUG_TO_CATEGORY) {
    const prefix = `${categorySlug}-`;
    if (!value.startsWith(prefix)) continue;

    const city = SLUG_TO_CITY.get(value.slice(prefix.length));
    if (city) return { category, city };
  }

  return null;
}

/** Build the canonical path for a category/city combination. */
export function browseHref({ category, city }: Browse): string {
  const parts = [
    category ? CATEGORY_SLUG[category] : null,
    city ? CITY_SLUG[city] : null,
  ].filter(Boolean);

  return parts.length ? `/${parts.join("-")}` : "/";
}

/** Human-readable heading for a combination, e.g. "Models in Mumbai". */
export function browseTitle({ category, city }: Browse): string {
  const what = category ? CATEGORY_PLURAL[category] : "Listings";
  return city ? `${what} in ${city}` : what;
}

/** Plural label used in headings and page titles. */
export const CATEGORY_PLURAL: Record<Category, string> = {
  Model: "Models",
  "Massage Service": "Massage services",
  "Parlor Service": "Parlor services",
};

/** Every browsable path, for the sitemap and the footer. */
export function allBrowsePaths(): string[] {
  const paths: string[] = [];

  for (const city of CITIES) paths.push(browseHref({ category: null, city }));

  for (const category of CATEGORIES) {
    paths.push(browseHref({ category, city: null }));
    for (const city of CITIES) paths.push(browseHref({ category, city }));
  }

  return paths;
}
