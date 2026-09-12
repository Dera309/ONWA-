import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ArtworkUploadForm from "./ArtworkUploadForm";

export const metadata: Metadata = {
  title: "Upload Artwork | Admin",
  description: "Upload new artwork to the ONWA digital museum",
};

export default async function UploadArtworkPage() {
  // Fetch collections for the dropdown
  let collections: { id: string; name: string; slug: string }[] = [];
  let moonCycles: { id: string; name: string; phase: string }[] = [];

  try {
    [collections, moonCycles] = await Promise.all([
      prisma.collection.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, name: true, slug: true },
      }),
      prisma.moonCycle.findMany({
        select: { id: true, name: true, phase: true },
      }),
    ]);
  } catch (err) {
    console.error("[UploadArtwork] DB error:", err);
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="museum-heading text-headline-lg text-primary mb-2">
          Upload Artwork
        </h1>
        <p className="museum-body text-body-md text-muted-foreground">
          Add a new artwork to the ONWA digital museum collection.
        </p>
      </div>

      <ArtworkUploadForm 
        collections={collections}
        moonCycles={moonCycles}
      />
    </div>
  );
}
