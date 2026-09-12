import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stories | Admin | ONWA",
};

export default async function AdminStoriesPage() {
  let stories: Awaited<ReturnType<typeof prisma.story.findMany>> = [];
  let dbError: string | null = null;

  try {
    stories = await prisma.story.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    console.error("[AdminStories] DB error:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">Stories</h1>
          <p className="museum-body text-body-lg text-muted-foreground">Manage cultural stories</p>
        </div>
        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}
        {stories.length === 0 && !dbError ? (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No stories yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {stories.map((s) => (
              <div key={s.id} className="artwork-mat p-6 flex justify-between items-center">
                <div>
                  <h3 className="museum-heading text-headline-md text-primary mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.region} · {s.country}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded ${
                  s.status === "PUBLISHED"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>{s.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
