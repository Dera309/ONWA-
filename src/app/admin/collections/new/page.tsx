import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CollectionForm from "../CollectionForm";

export const metadata: Metadata = {
  title: "New Collection | Curator Office | ONWA",
  description: "Create a new curated artwork collection in the ONWA digital museum.",
};

export const dynamic = "force-dynamic";

export default async function NewCollectionPage() {
  let moonCycles: any[] = [];

  try {
    moonCycles = await prisma.moonCycle.findMany({
      select: { id: true, name: true, phase: true },
      orderBy: { startDate: "asc" },
    });
  } catch (err) {
    console.error("[NewCollectionPage] Error fetching moon cycles:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10">
          <p className="label-caps text-muted-foreground mb-3 text-xs">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-3">
            Add New Collection
          </h1>
          <p className="museum-body text-body-md text-muted-foreground">
            Assemble a new curated collection of African digital masterpieces.
          </p>
        </div>

        <CollectionForm moonCycles={moonCycles} isEditing={false} />
      </div>
    </main>
  );
}
