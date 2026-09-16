import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DeleteArtworkButton from "./DeleteArtworkButton";
import PublishArtworkButton from "./PublishArtworkButton";

export const metadata: Metadata = {
  title: "Artworks Management | ONWA",
  description: "Manage artworks in the ONWA digital museum.",
};

export default async function AdminArtworksPage() {
  // Fetch all artworks from the database
  let artworks: any[] = [];
  let dbError: string | null = null;

  try {
    artworks = await prisma.artwork.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        collection: {
          select: { name: true },
        },
        moonCycle: {
          select: { name: true, phase: true },
        },
      },
    });
  } catch (err) {
    console.error("[AdminArtworks] DB error:", err);
    dbError = err instanceof Error ? err.message : "Failed to connect to database";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Artworks Management
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage and curate the museum's digital artwork collection
          </p>
        </div>

        <div className="mb-8">
          <Link
            href="/admin/artworks/upload"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            Upload New Artwork
          </Link>
        </div>

        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 rounded text-red-400 text-sm">
            <p className="font-semibold mb-1">Database connection error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
            <p className="mt-2 text-muted-foreground">
              Check that your MongoDB Atlas cluster is running and the IP {" "}
              <span className="font-mono">0.0.0.0/0</span> is in the network access allowlist.
            </p>
          </div>
        )}

        {artworks.length === 0 ? (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">
              No artworks uploaded yet. Use the upload button to add your first artwork.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {artworks.map((artwork) => (
              <div key={artwork.id} className="artwork-mat p-4 sm:p-6 border border-border/30">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  <div className="flex-shrink-0 w-full sm:w-32 h-48 sm:h-32 bg-black/40 rounded overflow-hidden">
                    <img
                      src={artwork.heroImage}
                      alt={artwork.heroImageAlt || artwork.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="museum-heading text-xl sm:text-headline-md text-primary">
                          {artwork.title}
                        </h3>
                        <span className="text-primary font-medium text-sm sm:text-base">
                          ${artwork.price.toFixed(2)}
                        </span>
                      </div>
                      {artwork.subtitle && (
                        <p className="museum-body text-body-sm text-muted-foreground mb-2">
                          {artwork.subtitle}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-muted-foreground mb-4">
                        <span>{artwork.collection.name}</span>
                        <span>·</span>
                        <span>{artwork.moonCycle.name}</span>
                        <span>·</span>
                        <span>{artwork.region}, {artwork.country}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/20">
                      <span className={`px-2.5 py-0.5 text-xs rounded font-medium ${
                        artwork.status === "PUBLISHED" 
                          ? "bg-green-500/10 text-green-400 border border-green-500/20" 
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {artwork.status}
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/admin/artworks/${artwork.id}/edit`}
                          className="inline-flex items-center justify-center rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3"
                        >
                          Edit
                        </Link>
                        {artwork.status === "DRAFT" && (
                          <PublishArtworkButton artworkId={artwork.id} />
                        )}
                        <DeleteArtworkButton artworkId={artwork.id} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
