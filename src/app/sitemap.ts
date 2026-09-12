import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

  let artworks: any[] = [];
  let collections: any[] = [];
  let journal: any[] = [];
  let stories: any[] = [];

  try {
    [artworks, collections, journal, stories] = await Promise.all([
      prisma.artwork.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.collection.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.journal.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
      prisma.story.findMany({
        where: { status: "PUBLISHED" },
        select: { slug: true, updatedAt: true },
      }),
    ]);
  } catch (err) {
    console.warn("[Sitemap] Could not fetch dynamic paths at build time, using static fallback.");
  }

  const staticPages = [
    "",
    "/museum",
    "/gallery",
    "/collections",
    "/journal",
    "/about",
    "/contact",
    "/faq",
    "/privacy",
    "/terms",
  ];

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    })),
    ...artworks.map((artwork) => ({
      url: `${baseUrl}/artwork/${artwork.slug}`,
      lastModified: artwork.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...collections.map((collection) => ({
      url: `${baseUrl}/collection/${collection.slug}`,
      lastModified: collection.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...journal.map((article) => ({
      url: `${baseUrl}/journal/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...stories.map((story) => ({
      url: `${baseUrl}/story/${story.slug}`,
      lastModified: story.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
