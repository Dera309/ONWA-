import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata: Metadata = { title: "Journal | Admin | ONWA" };

export default async function AdminJournalPage() {
  let entries: Awaited<ReturnType<typeof prisma.journal.findMany>> = [];
  let dbError: string | null = null;

  try {
    entries = await prisma.journal.findMany({ orderBy: { createdAt: "desc" } });
  } catch (err) {
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex justify-between items-end">
          <div>
            <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
            <h1 className="museum-heading text-headline-lg text-primary mb-2">Journal</h1>
            <p className="museum-body text-body-lg text-muted-foreground">Manage journal entries</p>
          </div>
          <Link href="/admin/journal/new" className="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            New Entry
          </Link>
        </div>
        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}
        {entries.length === 0 && !dbError && (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">No journal entries yet.</p>
          </div>
        )}
        <div className="space-y-4">
          {entries.map((e) => (
            <div key={e.id} className="artwork-mat p-6 flex justify-between items-center">
              <div>
                <h3 className="museum-heading text-headline-md text-primary mb-1">{e.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{e.author} · {new Date(e.createdAt).toLocaleDateString()}</p>
                <span className={`px-2 py-1 text-xs rounded ${
                  e.status === "PUBLISHED"
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                }`}>{e.status}</span>
              </div>
              <Link href={`/admin/journal/${e.id}/edit`} className="text-sm text-primary hover:underline">Edit</Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
