import { Metadata } from "next";
import Link from "next/link";
import { requireCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

export const metadata: Metadata = {
  title: "Collected Works | ONWA",
  description: "Access your collected works and downloads.",
};

export default async function CollectedWorksPage() {
  const collector = await requireCollector();

  let licenses: any[] = [];
  try {
    licenses = await prisma.license.findMany({
      where: {
        collectorId: collector.id,
        active: true,
        revoked: false,
      },
      orderBy: { createdAt: "desc" },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            slug: true,
            heroImage: true,
            heroImageAlt: true,
            region: true,
            country: true,
          },
        },
        order: {
          select: {
            orderNumber: true,
            paidAt: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("[CollectedWorks] Error querying licenses:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Collector</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Collected Works
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Your sacred sanctuary of acquired African masterpieces. Download your high-resolution digital files and manage certificates.
          </p>
        </div>

        {licenses.length === 0 ? (
          <div className="artwork-mat p-12 text-center">
            <p className="museum-body text-body-md text-muted-foreground mb-4">
              No collected works yet.
            </p>
            <p className="text-sm text-muted-foreground/80 mb-8 max-w-md mx-auto">
              Acquire digital artwork from our curated collections to build your personal archive.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {licenses.map((license) => {
              const resName = (license.resolution as any)?.name || "Full";
              const downloadsLeft = Math.max(0, license.maxDownloads - license.downloadCount);
              const canDownload = license.downloadCount < license.maxDownloads;

              return (
                <div key={license.id} className="artwork-mat flex flex-col overflow-hidden border border-border/40 hover:border-primary/50 transition-all duration-300">
                  <div className="aspect-[4/3] relative overflow-hidden bg-black/40">
                    <ProtectedArtworkImage
                      src={license.artwork.heroImage}
                      alt={license.artwork.heroImageAlt || license.artwork.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      containerClassName="w-full h-full"
                      watermarkText={`COLLECTOR PROVENANCE · ${license.artwork.title.toUpperCase()}`}
                    />
                    <div className="absolute top-3 right-3 z-30 bg-black/80 backdrop-blur-sm px-2.5 py-1 text-[11px] font-mono text-primary border border-primary/20 rounded">
                      {resName}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="label-caps text-[11px] text-muted-foreground">
                          {license.artwork.country || license.artwork.region || "Africa"}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70 font-mono">
                          {license.order?.orderNumber ? `#${license.order.orderNumber}` : ""}
                        </span>
                      </div>

                      <h3 className="museum-heading text-headline-sm text-primary mb-2 line-clamp-1">
                        {license.artwork.title}
                      </h3>

                      <p className="label-caps text-xs text-muted-foreground mb-4">
                        {license.type.replace(/_/g, " ")} License
                      </p>

                      <div className="space-y-1.5 text-xs text-muted-foreground/80 mb-6 bg-background/50 p-3 rounded border border-border/20">
                        <div className="flex justify-between">
                          <span>Downloads remaining:</span>
                          <span className={downloadsLeft > 0 ? "text-primary font-medium" : "text-red-400 font-medium"}>
                            {downloadsLeft} / {license.maxDownloads}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>License Key:</span>
                          <span className="font-mono text-[10px] text-primary truncate max-w-[120px]" title={license.licenseKey}>
                            {license.licenseKey}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      {canDownload ? (
                        <a
                          href={`/api/downloads/${license.id}`}
                          download
                          className="w-full inline-flex items-center justify-center px-4 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 label-caps text-xs font-semibold"
                        >
                          Download Artwork ({resName})
                        </a>
                      ) : (
                        <button
                          disabled
                          className="w-full inline-flex items-center justify-center px-4 py-3 bg-muted text-muted-foreground cursor-not-allowed label-caps text-xs opacity-60"
                        >
                          Download Limit Reached
                        </button>
                      )}

                      <div className="flex gap-2">
                        <Link
                          href={`/artwork/${license.artwork.slug}`}
                          className="flex-1 text-center py-2 px-3 border border-border/30 hover:border-primary text-muted-foreground hover:text-primary transition-colors text-xs label-caps"
                        >
                          View Details
                        </Link>
                        <Link
                          href="/licenses"
                          className="flex-1 text-center py-2 px-3 border border-border/30 hover:border-primary text-muted-foreground hover:text-primary transition-colors text-xs label-caps"
                        >
                          License Certificate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}