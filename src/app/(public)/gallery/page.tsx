import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

export const metadata: Metadata = {
  title: "Gallery | ONWA",
  description: "Browse the complete collection of African digital artworks in Gallery Mode. Filter by region, era, and moon cycle.",
};

export default async function GalleryPage() {
  let artworks: any[] = [];

  try {
    artworks = await prisma.artwork.findMany({
      where: { status: "PUBLISHED" },
      include: {
        collection: true,
        moonCycle: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 12,
    });
  } catch (err) {
    console.error("[Gallery] DB error:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Gallery Header */}
      <section className="py-16 px-4 border-b border-border/20">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <p className="label-caps text-muted-foreground mb-4">Gallery Mode</p>
            <h1 className="museum-heading text-headline-lg text-primary mb-6">
              The Collection
            </h1>
            <p className="museum-body text-body-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of African digital artworks, organized by 
              moon cycles and cultural significance.
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-primary text-primary label-caps text-xs">
              All
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary label-caps text-xs transition-colors">
              West Africa
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary label-caps text-xs transition-colors">
              East Africa
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary label-caps text-xs transition-colors">
              North Africa
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary label-caps text-xs transition-colors">
              Southern Africa
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 border border-border text-muted-foreground hover:border-primary hover:text-primary label-caps text-xs transition-colors">
              Central Africa
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {artworks.length === 0 ? (
            <div className="text-center py-16">
              <p className="museum-body text-body-lg text-muted-foreground">
                No artworks available at this time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork: any) => (
                <Link
                  key={artwork.id}
                  href={`/artwork/${artwork.slug}`}
                  className="block border border-border/20 p-4 group cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center overflow-hidden">
                    {artwork.heroImage ? (
                      <ProtectedArtworkImage
                        src={artwork.heroImage}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        watermarkText={`ONWA · ${artwork.title.toUpperCase()}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-low group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <p className="label-caps text-muted-foreground mb-2">{artwork.region}</p>
                  <h3 className="museum-heading text-headline-md text-primary mb-2">
                    {artwork.title}
                  </h3>
                  <p className="museum-body text-body-md text-muted-foreground">
                    {artwork.country}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Load More */}
      <section className="py-16 px-4 text-center">
        <button className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps">
          Load More Artworks
        </button>
      </section>
    </main>
  );
}
