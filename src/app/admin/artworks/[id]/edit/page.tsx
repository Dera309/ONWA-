import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ArtworkEditForm from "./ArtworkEditForm";

export const metadata: Metadata = {
  title: "Edit Artwork | ONWA",
  description: "Edit artwork details in the ONWA digital museum.",
};

export default async function EditArtworkPage({
  params,
}: {
  params: { id: string };
}) {
  let artwork = null;
  let collections: any[] = [];
  let moonCycles: any[] = [];

  try {
    [artwork, collections, moonCycles] = await Promise.all([
      prisma.artwork.findUnique({
        where: { id: params.id },
        include: { collection: true, moonCycle: true },
      }),
      prisma.collection.findMany(),
      prisma.moonCycle.findMany(),
    ]);
  } catch (err) {
    console.error("[EditArtworkPage] DB error:", err);
  }

  if (!artwork) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Edit Artwork
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Update artwork details and settings
          </p>
        </div>

        <ArtworkEditForm
          artwork={artwork}
          collections={collections}
          moonCycles={moonCycles}
        />
      </div>
    </main>
  );
}
