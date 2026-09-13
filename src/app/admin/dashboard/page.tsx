import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard | ONWA",
  description: "Admin dashboard for managing ONWA's digital museum.",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  let artworkCount = 0;
  let collectionCount = 0;
  let collectorCount = 0;
  let orderCount = 0;

  try {
    const [artworks, collections, collectors, orders] = await Promise.all([
      prisma.artwork.count().catch(() => 0),
      prisma.collection.count().catch(() => 0),
      prisma.collector.count().catch(() => 0),
      prisma.order.count().catch(() => 0),
    ]);
    artworkCount = artworks;
    collectionCount = collections;
    collectorCount = collectors;
    orderCount = orders;
  } catch (err) {
    console.error("[AdminDashboard] Error fetching counts:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-8 pb-16">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-3">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-3">
            Museum Management
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage artworks, collections, collectors, and orders in real time.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2 text-xs">Artworks</p>
            <p className="museum-heading text-3xl md:text-4xl text-primary font-bold">{artworkCount}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2 text-xs">Collections</p>
            <p className="museum-heading text-3xl md:text-4xl text-primary font-bold">{collectionCount}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2 text-xs">Collectors</p>
            <p className="museum-heading text-3xl md:text-4xl text-primary font-bold">{collectorCount}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2 text-xs">Orders</p>
            <p className="museum-heading text-3xl md:text-4xl text-primary font-bold">{orderCount}</p>
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
