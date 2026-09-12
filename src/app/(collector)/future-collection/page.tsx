import { Metadata } from "next";
import { requireCollector } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Future Collection | ONWA",
  description: "View your wishlist and future collection.",
};

export default async function FutureCollectionPage() {
  const collector = await requireCollector();

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Collector</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Future Collection
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Artworks you wish to collect
          </p>
        </div>

        <div className="artwork-mat p-12 text-center">
          <p className="museum-body text-body-md text-muted-foreground">
            Your future collection is empty
          </p>
          <a
            href="/gallery"
            className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps mt-8"
          >
            Browse Gallery
          </a>
        </div>
      </div>
    </main>
  );
}
