import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentCollector } from "@/lib/auth";
import Link from "next/link";
import ArtworkActions from "./ArtworkActions";
import { AmbientAudioPlayer } from "@/components/shared/AmbientAudioPlayer";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

interface ArtworkPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArtworkPageProps): Promise<Metadata> {
  let artwork = null;
  try {
    artwork = await prisma.artwork.findUnique({
      where: { slug: params.slug },
      select: { title: true, description: true },
    });
  } catch {}

  return {
    title: artwork ? `${artwork.title} | ONWA` : "Artwork | ONWA",
    description: artwork?.description || "View this African digital artwork with full story, curator notes, and historical context.",
  };
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  let artwork = null;
  let related: any[] = [];

  try {
    artwork = await prisma.artwork.findUnique({
      where: { slug: params.slug, status: "PUBLISHED" },
      include: {
        collection: true,
        moonCycle: true,
      },
    });

    if (artwork) {
      related = await prisma.artwork.findMany({
        where: {
          status: "PUBLISHED",
          collectionId: artwork.collectionId,
          id: { not: artwork.id },
        },
        take: 4,
        select: {
          id: true,
          slug: true,
          title: true,
          heroImage: true,
          heroImageAlt: true,
          region: true,
          country: true,
        },
      });
    }
  } catch (err) {
    console.error("[ArtworkPage] DB error:", err);
  }

  if (!artwork) {
    notFound();
  }

  let ownedLicenses: any[] = [];
  try {
    const collector = await getCurrentCollector();
    if (collector) {
      ownedLicenses = await prisma.license.findMany({
        where: {
          collectorId: collector.id,
          artworkId: artwork.id,
          active: true,
          revoked: false,
        },
        select: {
          id: true,
          type: true,
          resolution: true,
        },
      });
    }
  } catch (err) {
    console.error("[ArtworkPage] Collector license check error:", err);
  }

  const resolutions = Array.isArray(artwork.availableResolutions)
    ? (artwork.availableResolutions as any[])
    : [];

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Breadcrumb */}
      <div className="px-4 pt-6 pb-2">
        <div className="container mx-auto max-w-7xl">
          <p className="text-sm text-muted-foreground">
            <Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link>
            <span className="mx-2">·</span>
            <span className="text-primary">{artwork.title}</span>
          </p>
        </div>
      </div>

      {/* Artwork Hero */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Artwork Image */}
            <div className="artwork-mat">
              <div className="aspect-[4/5] bg-surface-container-low flex items-center justify-center overflow-hidden">
                {artwork.heroImage ? (
                  <ProtectedArtworkImage
                    src={artwork.heroImage}
                    alt={artwork.heroImageAlt || artwork.title}
                    className="w-full h-full object-cover"
                    containerClassName="w-full h-full"
                    watermarkText={`ONWA · ${artwork.title.toUpperCase()}`}
                  />
                ) : (
                  <p className="label-caps text-muted-foreground">No Image</p>
                )}
              </div>
            </div>

            {/* Artwork Details */}
            <div className="space-y-8">
              <div>
                <p className="label-caps text-muted-foreground mb-4">
                  {[artwork.region, artwork.country, artwork.ethnicGroup].filter(Boolean).join(" • ")}
                </p>
                <h1 className="museum-heading text-headline-lg text-primary mb-2">
                  {artwork.title}
                </h1>
                {artwork.subtitle && (
                  <p className="museum-body text-body-lg text-muted-foreground mb-4">
                    {artwork.subtitle}
                  </p>
                )}
                <p className="museum-body text-body-lg text-muted-foreground mb-8">
                  from ${artwork.price.toFixed(2)}
                </p>

                <ArtworkActions
                  artworkId={artwork.id}
                  artworkTitle={artwork.title}
                  price={artwork.price}
                  resolutions={resolutions}
                  ownedLicenses={ownedLicenses}
                />

                <div className="pt-6">
                  <AmbientAudioPlayer
                    audioUrl={artwork.ambientAudio}
                    title={`${artwork.title} · Atmosphere`}
                  />
                </div>
              </div>

              {/* Collection & Moon Cycle */}
              <div className="border-t border-border/20 pt-8 flex flex-wrap gap-6 sm:gap-8">
                <div>
                  <p className="label-caps text-muted-foreground mb-1 text-xs">Collection</p>
                  <p className="museum-body text-body-md text-primary">{artwork.collection.name}</p>
                </div>
                <div>
                  <p className="label-caps text-muted-foreground mb-1 text-xs">Moon Cycle</p>
                  <p className="museum-body text-body-md text-primary">{artwork.moonCycle.name}</p>
                </div>
                {artwork.era && (
                  <div>
                    <p className="label-caps text-muted-foreground mb-1 text-xs">Era</p>
                    <p className="museum-body text-body-md text-primary">{artwork.era}</p>
                  </div>
                )}
              </div>

              {/* Story */}
              <div className="border-t border-border/20 pt-8">
                <p className="label-caps text-muted-foreground mb-4">Story</p>
                <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                  {artwork.story}
                </p>
              </div>

              {/* Curator's Note */}
              {artwork.curatorNote && (
                <div className="border-t border-border/20 pt-8">
                  <p className="label-caps text-muted-foreground mb-4">Curator's Note</p>
                  <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                    {artwork.curatorNote}
                  </p>
                </div>
              )}

              {/* Historical Context */}
              {artwork.historicalContext && (
                <div className="border-t border-border/20 pt-8">
                  <p className="label-caps text-muted-foreground mb-4">Historical Context</p>
                  <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                    {artwork.historicalContext}
                  </p>
                </div>
              )}

              {/* Spiritual Meaning */}
              {artwork.spiritualMeaning && (
                <div className="border-t border-border/20 pt-8">
                  <p className="label-caps text-muted-foreground mb-4">Spiritual Meaning</p>
                  <p className="museum-body text-body-md text-muted-foreground leading-relaxed">
                    {artwork.spiritualMeaning}
                  </p>
                </div>
              )}

              {/* Available Resolutions */}
              {resolutions.length > 0 && (
                <div className="border-t border-border/20 pt-8">
                  <p className="label-caps text-muted-foreground mb-4">Available Resolutions</p>
                  <div className="space-y-4">
                    {resolutions.map((res: any, i: number) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-border/10 last:border-0">
                        <div>
                          <p className="museum-body text-body-md text-primary">{res.label || `${res.width} × ${res.height}`}</p>
                          <p className="museum-body text-body-sm text-muted-foreground">
                            {res.width} × {res.height}{res.dpi ? ` • ${res.dpi} DPI` : ""}
                          </p>
                        </div>
                        <p className="museum-body text-body-md text-primary">
                          ${(artwork.price * (res.priceMultiplier ?? 1)).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Artworks */}
      {related.length > 0 && (
        <section className="py-16 px-4 border-t border-border/20">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12">
              <p className="label-caps text-muted-foreground mb-4">More to Discover</p>
              <h2 className="museum-heading text-headline-lg text-primary">Related Artworks</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/artwork/${rel.slug}`}
                  className="block artwork-mat group cursor-pointer hover:border-primary/50 transition-colors"
                >
                  <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center overflow-hidden">
                    {rel.heroImage ? (
                      <ProtectedArtworkImage
                        src={rel.heroImage}
                        alt={rel.heroImageAlt || rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        watermarkText={`ONWA · ${rel.title.toUpperCase()}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-low group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <p className="label-caps text-muted-foreground mb-2">{rel.region}</p>
                  <h3 className="museum-heading text-headline-md text-primary mb-2">{rel.title}</h3>
                  <p className="museum-body text-body-md text-muted-foreground">{rel.country}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
