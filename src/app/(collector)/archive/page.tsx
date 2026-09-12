import { Metadata } from "next";
import Link from "next/link";
import { requireCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

export const metadata: Metadata = {
  title: "Collector Archive | ONWA",
  description: "View your order history in the Collector Archive.",
};

export default async function CollectorArchivePage() {
  const collector = await requireCollector();

  let orders: any[] = [];
  try {
    orders = await prisma.order.findMany({
      where: { collectorId: collector.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        licenses: true,
      },
    });
  } catch (err) {
    console.error("[CollectorArchive] Error querying orders:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Collector</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Collector Archive
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            A permanent chronological record of your acquired artwork orders and receipts.
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="artwork-mat p-12 text-center">
            <p className="museum-body text-body-md text-muted-foreground mb-4">
              No orders found in your archive.
            </p>
            <p className="text-sm text-muted-foreground/80 mb-8 max-w-md mx-auto">
              Once you complete an artwork ritual, your transaction receipts and invoices will be cataloged here.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="artwork-mat p-6 border border-border/40">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/20 pb-4 mb-4">
                  <div>
                    <span className="label-caps text-xs text-muted-foreground">Order Number</span>
                    <h3 className="museum-heading text-headline-sm text-primary">#{order.orderNumber}</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-xs text-muted-foreground items-center">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60">Date</span>
                      <span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60">Provider</span>
                      <span>{order.paymentProvider}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60">Total</span>
                      <span className="text-primary font-semibold">${order.total.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 text-[11px] rounded ${
                        order.status === "COMPLETED"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : order.status === "CANCELLED"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item: any) => {
                    const resName = (item.resolution as any)?.name || "Full";
                    return (
                      <div key={item.id} className="flex items-center justify-between gap-4 p-3 bg-background/40 rounded border border-border/10">
                        <div className="flex items-center gap-4">
                          <ProtectedArtworkImage
                            src={item.artworkImage}
                            alt={item.artworkTitle}
                            className="w-14 h-14 object-cover rounded"
                            containerClassName="w-14 h-14 shrink-0 rounded overflow-hidden"
                            showWatermark={false}
                          />
                          <div>
                            <h4 className="museum-heading text-sm text-primary">{item.artworkTitle}</h4>
                            <p className="text-xs text-muted-foreground">
                              {item.licenseType.replace(/_/g, " ")} · {resName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-primary">${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 flex justify-end gap-3">
                  <Link
                    href="/collected-works"
                    className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
                  >
                    View in Collected Works
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}