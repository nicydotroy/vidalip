import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { allBrowsePaths } from "@/lib/locations";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Generated per request, not at build time. Prerendering this would make
// `next build` require a reachable database, which breaks CI and any deploy
// where the database is only provisioned at runtime.
export const dynamic = "force-dynamic";

/** Static pages that exist regardless of what is in the database. */
const STATIC_PATHS = [
  "/about",
  "/contact",
  "/advertise",
  "/posting-guide",
  "/blog",
  "/report-scam",
  "/terms",
  "/privacy",
  "/cookies",
  "/gdpr",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const home: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    // Category and city landing pages — these are the pages worth ranking,
    // so they sit above the policy pages in priority.
    ...allBrowsePaths().map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
    ...STATIC_PATHS.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.4,
    })),
  ];

  try {
    const listings = await prisma.listing.findMany({
      where: { status: "APPROVED" },
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 5000,
    });

    return [
      ...home,
      ...listings.map((l) => ({
        url: `${siteUrl}/listing/${l.slug}`,
        lastModified: l.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch (err) {
    // A sitemap is not worth a 500. Degrade to the homepage entry and let the
    // crawler come back later.
    console.error("sitemap: could not load listings", err);
    return home;
  }
}
