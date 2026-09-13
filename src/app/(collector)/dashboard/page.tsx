import { Metadata } from "next";
import Link from "next/link";
import { requireCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collector Dashboard | ONWA",
  description: "Access your Collector Dashboard to view your archive, collected works, and future collection.",
};

export default async function CollectorDashboardPage() {
  const collector = await requireCollector();

  let collectedCount = 0;
  let wishlistCount = 0;
  let totalSpent = 0;
  let recentOrders: any[] = [];
  let isAdmin = false;

  try {
    const [licenseCount, wishCount, orders, adminRecord] = await Promise.all([
      prisma.license.count({
        where: { collectorId: collector.id, active: true, revoked: false },
      }),
      prisma.wishlistItem.count({
        where: { collectorId: collector.id },
      }),
      prisma.order.findMany({
        where: { collectorId: collector.id, status: "COMPLETED" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: { items: true },
      }),
      prisma.admin.findFirst({
        where: {
          OR: [
            { clerkId: collector.clerkId },
            { email: { equals: collector.email, mode: "insensitive" } },
          ],
        },
      }),
    ]);

    collectedCount = licenseCount;
    wishlistCount = wishCount;
    recentOrders = orders;
    totalSpent = orders.reduce((sum, o) => sum + o.total, 0);
    isAdmin = !!adminRecord;
  } catch (err) {
    console.error("[CollectorDashboard] Error fetching stats:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        {isAdmin && (
          <div className="mb-8 p-4 rounded bg-primary/10 border border-primary/30 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl">🏛️</span>
              <div>
                <p className="text-sm font-semibold text-primary">Curator Administrator</p>
                <p className="text-xs text-muted-foreground">You have full curator access to manage artworks, collections, and museum operations.</p>
              </div>
            </div>
            <Link
              href="/admin/dashboard"
              className="inline-flex items-center px-4 py-2 text-xs font-semibold label-caps bg-primary text-primary-foreground hover:bg-primary/90 rounded transition-colors"
            >
              Curator Dashboard →
            </Link>
          </div>
        )}

        {/* Dashboard Header */}
        <div className="mb-12">
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Welcome, {collector.name || "Collector"}
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage your acquired digital masterpieces, download license files, and explore your curated archive.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Collected Works</p>
            <p className="museum-heading text-headline-lg text-primary">{collectedCount}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Future Collection</p>
            <p className="museum-heading text-headline-lg text-primary">{wishlistCount}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Total Invested</p>
            <p className="museum-heading text-headline-lg text-primary">${totalSpent.toFixed(2)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-8">
          <div>
            <p className="label-caps text-muted-foreground mb-4">Quick Actions</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                href="/collected-works"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Collected Works
                </h3>
                <p className="museum-body text-body-sm text-muted-foreground">
                  Access your digital art downloads
                </p>
              </Link>
              <Link
                href="/archive"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Collector Archive
                </h3>
                <p className="museum-body text-body-sm text-muted-foreground">
                  View your complete order history
                </p>
              </Link>
              <Link
                href="/future-collection"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Future Collection
                </h3>
                <p className="museum-body text-body-sm text-muted-foreground">
                  View your saved wishlist
                </p>
              </Link>
              <Link
                href="/licenses"
                className="artwork-mat block p-6 hover:border-primary transition-colors cursor-pointer"
              >
                <h3 className="museum-heading text-headline-md text-primary mb-2">
                  Licenses
                </h3>
                <p className="museum-body text-body-sm text-muted-foreground">
                  Manage license certificates
                </p>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <p className="label-caps text-muted-foreground mb-4">Recent Orders</p>
            {recentOrders.length === 0 ? (
              <div className="artwork-mat p-8 text-center">
                <p className="museum-body text-body-md text-muted-foreground mb-4">
                  No recent orders yet.
                </p>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
                >
                  Explore Gallery
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="artwork-mat p-4 flex justify-between items-center">
                    <div>
                      <h4 className="museum-heading text-sm text-primary">#{order.orderNumber}</h4>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item(s)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-primary">${order.total.toFixed(2)}</p>
                      <Link href="/collected-works" className="text-xs text-primary/80 hover:underline">
                        View Works →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}