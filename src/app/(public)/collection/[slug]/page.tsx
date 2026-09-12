import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

interface CollectionSlugProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CollectionSlugProps): Promise<Metadata> {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug },
    select: { name: true, description: true },
  });

  return {
    title: collection ? `${collection.name} | Collection | ONWA` : "Collection | ONWA",
    description: collection?.description || "Explore this curated African digital art collection on ONWA.",
  };
}

export default async function CollectionPage({ params }: CollectionSlugProps) {
  const collection = await prisma.collection.findUnique({
    where: { slug: params.slug, status: "PUBLISHED" },
    include: {
      moonCycle: true,
      artworks: {
        where: { status: "PUBLISHED" },
        select: {
          id: true,
          slug: true,
          title: true,
          heroImage: true,
          heroImageAlt: true,
          price: true,
          region: true,
          country: true,
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curated Collection · {collection.moonCycle.name}</p>
          <h1 className="museum-heading text-headline-lg md:text-display-xl-mobile text-primary mb-6">
            {collection.name}
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground max-w-3xl leading-relaxed">
            {collection.description}
          </p>
          {collection.curatorNote && (
            <div className="mt-6 p-6 border-l-2 border-primary/40 bg-surface-container-low/50">
              <p className="label-caps text-xs text-primary mb-2">Curator Note</p>
              <p className="museum-body text-body-md text-muted-foreground italic">
                "{collection.curatorNote}"
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-border/20 pt-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="museum-heading text-headline-md text-primary">
              Masterworks ({collection.artworks.length})
            </h2>
          </div>

          {collection.artworks.length === 0 ? (
            <div className="artwork-mat p-12 text-center">
              <p className="museum-body text-body-md text-muted-foreground mb-4">
                No artworks currently published in this collection.
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all label-caps text-xs"
              >
                Return to Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {collection.artworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/artwork/${art.slug}`}
                  className="artwork-mat group block overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-300"
                >
                  <div className="aspect-[4/5] bg-black/50 overflow-hidden relative">
                    <ProtectedArtworkImage
                      src={art.heroImage}
                      alt={art.heroImageAlt || art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      containerClassName="w-full h-full"
                      watermarkText={`ONWA · ${art.title.toUpperCase()}`}
                    />
                  </div>
                  <div className="p-6">
                    <p className="label-caps text-[11px] text-muted-foreground mb-2">
                      {[art.region, art.country].filter(Boolean).join(" · ")}
                    </p>
                    <h3 className="museum-heading text-headline-sm text-primary mb-2 group-hover:text-primary/90">
                      {art.title}
                    </h3>
                    <p className="text-sm text-primary font-medium">from ${art.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}