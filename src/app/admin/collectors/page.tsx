import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Collectors | Admin | ONWA",
  description: "Manage collectors.",
};

export default async function AdminCollectorsPage() {
  let collectors: Awaited<ReturnType<typeof prisma.collector.findMany>> = [];
  let dbError: string | null = null;

  try {
    collectors = await prisma.collector.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[AdminCollectors] DB error:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Collectors</h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            View and manage registered collectors
          </p>
        </div>

        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database connection error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}

        {collectors.length === 0 && !dbError ? (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No collectors registered yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {collectors.map((c) => (
              <div key={c.id} className="artwork-mat p-6 flex justify-between items-center">
                <div>
                  <h3 className="museum-heading text-headline-md text-primary mb-1">
                    {c.name || "Unnamed Collector"}
                  </h3>
                  <p className="text-sm text-muted-foreground">{c.email}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Joined {new Date(c.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
