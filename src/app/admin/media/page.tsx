import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Library | Admin | ONWA",
};

export default function AdminMediaPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Media Library</h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Browse and manage uploaded images and audio files
          </p>
        </div>
        <div className="artwork-mat p-8">
          <p className="museum-body text-body-md text-muted-foreground">
            Media library management coming soon.
          </p>
        </div>
      </div>
    </main>
  );
}
