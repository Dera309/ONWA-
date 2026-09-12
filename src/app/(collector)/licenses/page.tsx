import { Metadata } from "next";
import Link from "next/link";
import { requireCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

export const metadata: Metadata = {
  title: "My Licenses | ONWA",
  description: "Manage your artwork licenses.",
};

export default async function LicensesPage() {
  const collector = await requireCollector();

  let licenses: any[] = [];

  try {
    licenses = await prisma.license.findMany({
      where: { collectorId: collector.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        licenseKey: true,
        type: true,
        active: true,
        downloadCount: true,
        maxDownloads: true,
        createdAt: true,
        expiresAt: true,
        resolution: true,
        artwork: {
          select: {
            id: true,
            title: true,
            slug: true,
            heroImage: true,
            heroImageAlt: true,
          },
        },
      },
    });
  } catch (err) {
    console.error("[Licenses] DB error:", err);
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Collector</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Licenses
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Manage your artwork licenses, verify authentic ownership, and track digital rights.
          </p>
        </div>

        {licenses.length === 0 ? (
          <div className="artwork-mat p-12 text-center">
            <p className="museum-body text-body-md text-muted-foreground mb-4">
              No licenses yet. Purchase an artwork to receive an authentic museum license.
            </p>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps mt-4"
            >
              Browse Gallery
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {licenses.map((license) => {
              const resName = (license.resolution as any)?.name || "Full";
              const canDownload = license.active && license.downloadCount < license.maxDownloads;

              return (
                <div key={license.id} className="artwork-mat p-6 border border-border/40">
                  <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                    <div className="flex gap-4 sm:gap-6 items-center">
                      <ProtectedArtworkImage
                        src={license.artwork.heroImage}
                        alt={license.artwork.heroImageAlt || license.artwork.title}
                        className="w-20 h-20 object-cover rounded"
                        containerClassName="w-20 h-20 shrink-0 rounded overflow-hidden"
                        showWatermark={false}
                      />
                      <div>
                        <h3 className="museum-heading text-headline-sm text-primary mb-1">
                          {license.artwork.title}
                        </h3>
                        <p className="label-caps text-xs text-muted-foreground mb-2">
                          {license.type.replace(/_/g, " ")} License · {resName}
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                          <span>
                            Key: <span className="font-mono text-primary">{license.licenseKey}</span>
                          </span>
                          <span>
                            Downloads: {license.downloadCount} / {license.maxDownloads}
                          </span>
                          {license.expiresAt && (
                            <span>
                              Expires: {new Date(license.expiresAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto justify-end">
                      <span
                        className={`inline-block px-2.5 py-1 text-xs rounded ${
                          license.active
                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20"
                        }`}
                      >
                        {license.active ? "Active" : "Revoked"}
                      </span>

                      {canDownload ? (
                        <a
                          href={`/api/downloads/${license.id}`}
                          download
                          className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground hover:opacity-90 transition-all label-caps text-xs font-semibold"
                        >
                          Download File
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Limit reached
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}