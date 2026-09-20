import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CollectionForm from "../../CollectionForm";

export const metadata: Metadata = {
  title: "Edit Collection | Curator Office | ONWA",
  description: "Edit collection details and settings.",
};

export const dynamic = "force-dynamic";

export default async function EditCollectionPage({
  params,
}: {
  params: { id: string };
}) {
  let collection = null;
  let moonCycles: any[] = [];

  try {
    [collection, moonCycles] = await Promise.all([
      prisma.collection.findUnique({
        where: { id: params.id },
      }),
      prisma.moonCycle.findMany({
        select: { id: true, name: true, phase: true },
        orderBy: { startDate: "asc" },
      }),
    ]);
  } catch (err) {
    console.error("[EditCollectionPage] DB error:", err);
  }

  if (!collection) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="mb-10">
          <p className="label-caps text-muted-foreground mb-3 text-xs">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-3">
            Edit Collection
          </h1>
          <p className="museum-body text-body-md text-muted-foreground">
            Update collection theme, description, and status.
          </p>
        </div>

        <CollectionForm
          collection={collection}
          moonCycles={moonCycles}
          isEditing={true}
        />
      </div>
    </main>
  );
}
