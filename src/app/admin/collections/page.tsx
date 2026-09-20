import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Sparkles, Image as ImageIcon } from "lucide-react";
import DeleteCollectionButton from "./DeleteCollectionButton";

export const metadata: Metadata = {
  title: "Collections | Curator Office | ONWA",
  description: "Manage artwork collections.",
};

export const dynamic = "force-dynamic";

export default async function AdminCollectionsPage() {
  let collections: any[] = [];
  let dbError: string | null = null;

  try {
    collections = await prisma.collection.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        moonCycle: { select: { name: true, phase: true } },
        _count: { select: { artworks: true } },
      },
    });
  } catch (err) {
    console.error("[AdminCollections] DB error:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {/* Header with Add Collection CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-12 pb-6 border-b border-border/20">
          <div>
            <p className="label-caps text-muted-foreground mb-2 text-xs">Curator's Office</p>
            <h1 className="museum-heading text-headline-lg text-primary mb-2">Collections</h1>
            <p className="museum-body text-body-md text-muted-foreground">
              Curate and manage cultural collections, moon themes, and regional storytelling.
            </p>
          </div>

          <Link
            href="/admin/collections/new"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 label-caps text-xs rounded-md shadow-sm w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>New Collection</span>
          </Link>
        </div>

        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database connection error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}

        {collections.length === 0 && !dbError ? (
          <div className="artwork-mat p-12 text-center max-w-md mx-auto space-y-4">
            <p className="museum-heading text-headline-md text-primary">No Collections Yet</p>
            <p className="museum-body text-body-md text-muted-foreground">
              Create your first cultural collection to organize artworks by moon cycle and kingdom.
            </p>
            <Link
              href="/admin/collections/new"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Create Collection</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((col) => (
              <div
                key={col.id}
                className="artwork-mat p-6 flex flex-col justify-between group hover:border-primary/50 transition-all bg-surface-container-lowest/30 hover:bg-surface-container-low/20 space-y-4"
              >
                <div>
                  {/* Cover Image Thumbnail */}
                  <div className="aspect-video bg-surface-container-low rounded-md overflow-hidden mb-4 relative border border-border/20">
                    {col.coverImage ? (
                      <img
                        src={col.coverImage}
                        alt={col.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40">
                        <ImageIcon className="w-8 h-8" />
                      </div>
                    )}
                    {col.featured && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 bg-primary text-primary-foreground text-[10px] label-caps rounded flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs label-caps text-muted-foreground">
                      {col.moonCycle?.name || "Moon Theme"}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] rounded font-medium ${
                        col.status === "PUBLISHED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {col.status}
                    </span>
                  </div>

                  <h3 className="museum-heading text-headline-md text-primary mb-2 line-clamp-1">
                    {col.name}
                  </h3>

                  <p className="museum-body text-body-sm text-muted-foreground line-clamp-2 mb-3">
                    {col.description}
                  </p>

                  <div className="text-xs text-muted-foreground/80 space-y-1">
                    <p>
                      <span className="font-medium text-foreground/80">Region:</span>{" "}
                      {col.region || "—"} {col.country ? `(${col.country})` : ""}
                    </p>
                    <p>
                      <span className="font-medium text-foreground/80">Artworks:</span>{" "}
                      {col._count?.artworks ?? col.artworkCount ?? 0}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-4 border-t border-border/10">
                  <Link
                    href={`/admin/collections/${col.id}/edit`}
                    className="flex-1 inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/80 h-8 px-3"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/collection/${col.slug}`}
                    target="_blank"
                    className="inline-flex items-center justify-center rounded-md text-xs font-medium transition-colors border border-border/40 text-muted-foreground hover:text-primary hover:border-primary/40 h-8 px-3"
                  >
                    View
                  </Link>
                  <DeleteCollectionButton
                    collectionId={col.id}
                    collectionName={col.name}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
