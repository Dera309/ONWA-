import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Payments | Admin | ONWA" };

export default async function AdminPaymentsPage() {
  let orders: any[] = [];
  let dbError: string | null = null;

  try {
    orders = await prisma.order.findMany({
      where: { paymentStatus: "COMPLETED" },
      orderBy: { paidAt: "desc" },
      include: { collector: { select: { name: true, email: true } } },
    });
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database error";
  }

  const total = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Payments</h1>
          <p className="museum-body text-body-lg text-muted-foreground">View completed payment history</p>
        </div>
        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Total Revenue</p>
            <p className="museum-heading text-headline-lg text-primary">${total.toFixed(2)}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Transactions</p>
            <p className="museum-heading text-headline-lg text-primary">{orders.length}</p>
          </div>
        </div>
        {orders.length === 0 && !dbError && (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No payments yet.</p>
          </div>
        )}
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="artwork-mat p-6 flex justify-between items-center">
              <div>
                <h3 className="museum-heading text-headline-md text-primary mb-1">#{order.orderNumber}</h3>
                <p className="text-sm text-muted-foreground">{order.collector.name || order.collector.email} Â· {order.paymentProvider}</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-medium">{order.currency} {order.total.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "â€”"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
