import { Metadata } from "next";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Licenses | Admin | ONWA",
  description: "Manage all artwork licenses.",
};

export default async function AdminLicensesPage() {
  let licenses: {
    id: string;
    licenseKey: string;
    type: string;
    active: boolean;
    revoked: boolean;
    downloadCount: number;
    maxDownloads: number;
    createdAt: Date;
    expiresAt: Date | null;
    artwork: { title: string };
    collector: { name: string | null; email: string };
  }[] = [];
  let dbError: string | null = null;

  try {
    licenses = await prisma.license.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        licenseKey: true,
        type: true,
        active: true,
        revoked: true,
        downloadCount: true,
        maxDownloads: true,
        createdAt: true,
        expiresAt: true,
        artwork: { select: { title: true } },
        collector: { select: { name: true, email: true } },
      },
    });
  } catch (err) {
    console.error("[AdminLicenses] DB error:", err);
    dbError = err instanceof Error ? err.message : "Database error";
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Curator's Office</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Licenses
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage all issued artwork licenses
          </p>
        </div>

        {dbError && (
          <div className="mb-8 p-4 border border-red-500/30 bg-red-500/10 text-red-400 text-sm rounded">
            <p className="font-semibold mb-1">Database connection error</p>
            <p className="font-mono text-xs break-all">{dbError}</p>
          </div>
        )}

        {licenses.length === 0 && !dbError ? (
          <div className="artwork-mat p-8">
            <p className="museum-body text-body-md text-muted-foreground">
              No licenses issued yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {licenses.map((license) => (
              <div key={license.id} className="artwork-mat p-6">
                <div className="flex flex-wrap gap-6 justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="museum-heading text-headline-md text-primary mb-1">
                      {license.artwork.title}
                    </h3>
                    <p className="museum-body text-body-sm text-muted-foreground mb-2">
                      {license.collector.name || license.collector.email}
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mb-3">
                      {license.licenseKey}
                    </p>
                    <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                      <span>{license.type.replace(/_/g, " ")}</span>
                      <span>•</span>
                      <span>
                        {license.downloadCount} / {license.maxDownloads} downloads
                      </span>
                      <span>•</span>
                      <span>
                        {new Date(license.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        license.revoked
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : license.active
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                      }`}
                    >
                      {license.revoked ? "Revoked" : license.active ? "Active" : "Inactive"}
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
