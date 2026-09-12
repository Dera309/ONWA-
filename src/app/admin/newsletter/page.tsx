import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Newsletter | Admin | ONWA" };

export default async function AdminNewsletterPage() {
  let subs: Awaited<ReturnType<typeof prisma.newsletterSubscription.findMany>> = [];
  let dbError: string | null = null;

  try {
    subs = await prisma.newsletterSubscription.findMany({ orderBy: { subscribedAt: "desc" } });
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database error";
  }

  const active = subs.filter((s) => s.status === "active").length;

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Newsletter</h1>
          <p className="museum-body text-body-lg text-muted-foreground">Manage newsletter subscriptions</p>
        </div>
        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-6 mb-12">
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Total</p>
            <p className="museum-heading text-headline-lg text-primary">{subs.length}</p>
          </div>
          <div className="artwork-mat p-6">
            <p className="label-caps text-muted-foreground mb-2">Active</p>
            <p className="museum-heading text-headline-lg text-primary">{active}</p>
          </div>
        </div>
        {subs.length === 0 && !dbError && (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No subscribers yet.</p>
          </div>
        )}
        <div className="space-y-3">
          {subs.map((s) => (
            <div key={s.id} className="artwork-mat p-4 flex justify-between items-center">
              <div>
                <p className="text-sm text-primary">{s.email}</p>
                {s.name && <p className="text-xs text-muted-foreground">{s.name}</p>}
              </div>
              <span className={`px-2 py-1 text-xs rounded ${
                s.status === "active"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}>{s.status}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
