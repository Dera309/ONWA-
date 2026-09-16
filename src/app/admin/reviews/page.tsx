import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Reviews | Admin | ONWA" };

export default async function AdminReviewsPage() {
  let reviews: any[] = [];
  let dbError: string | null = null;

  try {
    reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        artwork: { select: { title: true } },
        collector: { select: { name: true, email: true } },
      },
    });
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Reviews</h1>
          <p className="museum-body text-body-lg text-muted-foreground">Moderate artwork reviews</p>
        </div>
        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}
        {reviews.length === 0 && !dbError && (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No reviews yet.</p>
          </div>
        )}
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="artwork-mat p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h3 className="museum-heading text-lg sm:text-headline-md text-primary">{r.artwork.title}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {r.collector.name || r.collector.email} · {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                  </p>
                </div>
                <span className={`px-2.5 py-0.5 text-xs rounded font-medium w-fit ${
                  r.status === "APPROVED" ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : r.status === "REJECTED" ? "bg-red-500/10 text-red-400 border border-red-500/20"
                  : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>{r.status}</span>
              </div>
              {r.comment && <p className="text-xs sm:text-sm text-muted-foreground mt-2">{r.comment}</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
