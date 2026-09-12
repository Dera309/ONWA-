import { prisma } from "./prisma";
import { requireCollector } from "./auth";

export async function verifyDownloadAccess(
  artworkId: string,
  collectorId: string
) {
  const license = await prisma.license.findFirst({
    where: {
      collectorId,
      artworkId,
      active: true,
      revoked: false,
    },
  });

  return !!license;
}

export async function recordDownload(licenseId: string) {
  await prisma.license.update({
    where: { id: licenseId },
    data: {
      downloadCount: { increment: 1 },
      lastDownloadAt: new Date(),
    },
  });
}
