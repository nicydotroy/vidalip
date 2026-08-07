import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const listings = await prisma.listing.findMany({
    where: { status: "APPROVED" },
    select: { slug: true, updatedAt: true },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });

  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...listings.map((l) => ({
      url: `${siteUrl}/listing/${l.slug}`,
      lastModified: l.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
