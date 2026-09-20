import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { GalleryClient } from "@/components/gallery/GalleryClient";

export const metadata: Metadata = {
  title: "Gallery | ONWA",
  description: "Browse the complete collection of African digital artworks in Gallery Mode. Filter by region, era, and moon cycle.",
};

export const dynamic = "force-dynamic";

interface GalleryPageProps {
  searchParams?: {
    region?: string;
    page?: string;
  };
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const selectedRegion = searchParams?.region || "All";
  const page = parseInt(searchParams?.page || "1", 10) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const where: any = {
    status: "PUBLISHED",
  };

  if (selectedRegion && selectedRegion !== "All") {
    where.region = { contains: selectedRegion, mode: "insensitive" };
  }

  let artworks: any[] = [];
  let total = 0;

  try {
    const [fetchedArtworks, count] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
          collection: { select: { id: true, name: true, slug: true } },
          moonCycle: { select: { id: true, name: true, phase: true } },
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.artwork.count({ where }),
    ]);

    artworks = fetchedArtworks;
    total = count;
  } catch (err) {
    console.error("[Gallery] DB error:", err);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Gallery Header */}
      <section className="py-16 px-4 border-b border-border/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <p className="label-caps text-muted-foreground mb-4">Gallery Mode</p>
            <h1 className="museum-heading text-headline-lg text-primary mb-6">
              The Collection
            </h1>
            <p className="museum-body text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of African digital artworks, organized by 
              regional heritage, moon cycles, and cultural significance.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Gallery Filters & Grid */}
      <GalleryClient
        initialArtworks={artworks}
        initialTotal={total}
        initialTotalPages={totalPages}
        currentRegion={selectedRegion}
      />
    </main>
  );
}
