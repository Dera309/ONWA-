import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { moonPhases } from "@/config/moon-phases";
import { CollectionsClient, SerializedCollection } from "@/components/collections/CollectionsClient";

export const metadata: Metadata = {
  title: "Curated Collections | ONWA",
  description: "Explore ONWA's curated collections organized by moon cycles, ancestral kingdoms, and sacred traditions across Africa.",
};

export const dynamic = "force-dynamic";

export default async function CollectionsPage() {
  let collections: SerializedCollection[] = [];
  let dbError: string | null = null;

  try {
    const rawCollections = await prisma.collection.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        moonCycle: {
          select: {
            id: true,
            name: true,
            phase: true,
            description: true,
          },
        },
        _count: {
          select: {
            artworks: {
              where: {
                status: "PUBLISHED",
              },
            },
          },
        },
      },
      orderBy: [
        { featured: "desc" },
        { createdAt: "desc" },
      ],
    });

    collections = rawCollections.map((col) => ({
      id: col.id,
      slug: col.slug,
      name: col.name,
      description: col.description,
      coverImage: col.coverImage,
      coverImageAlt: col.coverImageAlt,
      curatorNote: col.curatorNote,
      region: col.region,
      country: col.country,
      era: col.era,
      featured: col.featured,
      artworkCount: col.artworkCount,
      _count: col._count,
      moonCycle: col.moonCycle,
    }));
  } catch (err) {
    console.error("[CollectionsPage] Error fetching collections:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Collections Hero Header */}
      <section className="py-16 md:py-20 px-4 border-b border-border/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center max-w-3xl mx-auto">
            <p className="label-caps text-muted-foreground mb-3 text-xs tracking-widest">
              Curated Sanctum
            </p>
            <h1 className="museum-heading text-display-md-mobile md:text-headline-lg text-primary mb-6">
              Curated Collections & Moon Cycles
            </h1>
            <p className="museum-body text-body-lg text-muted-foreground leading-relaxed">
              Every collection on ONWA is rooted in the cyclical phases of the moon and ancestral African civilizations, binding oral lore, divine symbolism, and digital masterworks into living history.
            </p>
          </div>
        </div>
      </section>

      {dbError && (
        <div className="container mx-auto max-w-7xl px-4 mt-8">
          <div className="p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Notice</p>
            <p className="text-xs">Unable to load live collections at this time. Please try refreshing.</p>
          </div>
        </div>
      )}

      {/* Interactive Collections & Lunar Explorer */}
      <CollectionsClient
        initialCollections={collections}
        moonPhases={moonPhases}
      />
    </main>
  );
}
