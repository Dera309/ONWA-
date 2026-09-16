import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Orders | Admin | ONWA",
  description: "View and manage orders.",
};

export default async function AdminOrdersPage() {
  let orders: any[] = [];
  let dbError: string | null = null;

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { collector: { select: { name: true, email: true } } },
    });
  } catch (err) {
    console.error("[AdminOrders] DB error:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Orders</h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            View all collector orders
          </p>
        </div>

        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database connection error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}

        {orders.length === 0 && !dbError ? (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No orders yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="artwork-mat p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="museum-heading text-lg sm:text-headline-md text-primary mb-1">
                    #{order.orderNumber}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                    {order.collector.name || order.collector.email} · {order.currency} {order.total.toFixed(2)}
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded font-medium ${
                      order.status === "COMPLETED"
                        ? "bg-green-500/10 text-green-400 border border-green-500/20"
                        : order.status === "CANCELLED"
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                    }`}>{order.status}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
