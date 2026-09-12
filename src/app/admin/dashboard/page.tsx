import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard | ONWA",
  description: "Admin dashboard for managing ONWA's digital museum.",
};

export default async function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Museum Management
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage artworks, collections, and collectors
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div className="artwork-mat">
            <p className="label-caps text-muted-foreground mb-2">Artworks</p>
            <p className="museum-heading text-headline-lg text-primary">0</p>
          </div>
          <div className="artwork-mat">
            <p className="label-caps text-muted-foreground mb-2">Collections</p>
            <p className="museum-heading text-headline-lg text-primary">0</p>
          </div>
          <div className="artwork-mat">
            <p className="label-caps text-muted-foreground mb-2">Collectors</p>
            <p className="museum-heading text-headline-lg text-primary">0</p>
          </div>
          <div className="artwork-mat">
            <p className="label-caps text-muted-foreground mb-2">Orders</p>
            <p className="museum-heading text-headline-lg text-primary">0</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div>
            <p className="label-caps text-muted-foreground mb-4">Quick Actions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a
                href="/admin/artworks"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Artworks
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  Manage artworks
                </p>
              </a>
              <a
                href="/admin/collections"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Collections
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  Manage collections
                </p>
              </a>
              <a
                href="/admin/orders"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Orders
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  View orders
                </p>
              </a>
              <a
                href="/admin/collectors"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Collectors
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  Manage collectors
                </p>
              </a>
              <a
                href="/admin/journal"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Journal
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  Manage journal
                </p>
              </a>
              <a
                href="/admin/media"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Media Library
                </h3>
                <p className="museum-body text-body-md text-muted-foreground">
                  Manage media
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
