import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Sparkles, Layers } from "lucide-react";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";
import { CollectionCoverImage } from "@/app/admin/collections/CollectionCoverImage";

export const dynamic = "force-dynamic";

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
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-xs label-caps text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Collections</span>
          </Link>
        </div>

        {/* Collection Hero Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16 pb-12 border-b border-border/20">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="label-caps text-xs text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20">
                {collection.moonCycle?.name || "Curated Sanctuary"}
              </span>
              {[collection.region, collection.country, collection.era].filter(Boolean).map((tag) => (
                <span key={tag} className="label-caps text-xs text-muted-foreground px-2.5 py-1 rounded bg-surface-container-low border border-border/30">
                  {tag}
                </span>
              ))}
              {collection.featured && (
                <span className="label-caps text-xs text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>

            <h1 className="museum-heading text-display-md-mobile md:text-display-lg text-primary tracking-tight">
              {collection.name}
            </h1>

            <p className="museum-body text-body-lg text-muted-foreground max-w-3xl leading-relaxed pt-2">
              {collection.description}
            </p>

            {collection.curatorNote && (
              <div className="mt-6 p-6 border-l-2 border-primary/60 bg-surface-container-low/40 rounded-r-lg">
                <p className="label-caps text-xs text-primary mb-2">Curator Note</p>
                <p className="museum-body text-body-md text-muted-foreground italic leading-relaxed">
                  "{collection.curatorNote}"
                </p>
              </div>
            )}
          </div>

          {/* Collection Cover Image */}
          {collection.coverImage && (
            <div className="lg:col-span-4 w-full">
              <div className="aspect-video lg:aspect-[4/3] rounded-lg overflow-hidden border border-border/40 shadow-xl relative">
                <CollectionCoverImage src={collection.coverImage} alt={collection.coverImageAlt || collection.name} />
              </div>
            </div>
          )}
        </div>

        {/* Masterworks Section */}
        <div>
          <div className="flex justify-between items-center mb-8">
            <h2 className="museum-heading text-headline-md text-primary flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              <span>Masterworks ({collection.artworks.length})</span>
            </h2>
          </div>

          {collection.artworks.length === 0 ? (
            <div className="artwork-mat p-12 text-center rounded-lg max-w-md mx-auto">
              <p className="museum-heading text-headline-sm text-primary mb-2">No Artworks Published Yet</p>
              <p className="museum-body text-body-md text-muted-foreground mb-6">
                Artworks for this collection are currently being curated by our sanctuary team.
              </p>
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all label-caps text-xs rounded"
              >
                Browse Gallery
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {collection.artworks.map((art) => (
                <Link
                  key={art.id}
                  href={`/artwork/${art.slug}`}
                  className="artwork-mat group block overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-300 rounded-lg"
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
                    <h3 className="museum-heading text-headline-sm text-primary mb-2 group-hover:text-primary/90 transition-colors">
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