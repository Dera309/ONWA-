import { NextRequest, NextResponse } from "next/server";
import { getCurrentCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordDownload } from "@/lib/downloads";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { licenseId: string } }
) {
  try {
    const { licenseId } = params;
    if (!licenseId) {
      return NextResponse.json({ error: "License ID is required" }, { status: 400 });
    }

    const collector = await getCurrentCollector();
    if (!collector) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: { artwork: true },
    });

    if (!license) {
      return NextResponse.json({ error: "License not found" }, { status: 404 });
    }

    // Verify ownership
    if (license.collectorId !== collector.id) {
      return NextResponse.json({ error: "Forbidden: You do not own this license" }, { status: 403 });
    }

    // Verify license status
    if (!license.active || license.revoked) {
      return NextResponse.json(
        { error: `License is no longer active${license.revokeReason ? `: ${license.revokeReason}` : ""}` },
        { status: 403 }
      );
    }

    // Verify download limit
    if (license.downloadCount >= license.maxDownloads) {
      return NextResponse.json(
        { error: `Maximum download limit (${license.maxDownloads}) reached for this license.` },
        { status: 403 }
      );
    }

    const artwork = license.artwork;
    const heroImage = artwork.heroImage || "";
    const resName = (license.resolution as any)?.name || "Original";
    const filename = `${artwork.slug}-${resName.toLowerCase()}${path.extname(heroImage) || ".png"}`;

    // Handle data URL (base64 stored in database)
    if (heroImage.startsWith("data:")) {
      const commaIndex = heroImage.indexOf(",");
      const meta = heroImage.substring(0, commaIndex);
      const base64Data = heroImage.substring(commaIndex + 1);
      const mimeMatch = meta.match(/data:([^;]+)/);
      const contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const buffer = Buffer.from(base64Data, "base64");
      const ext = contentType.split("/")[1] || "jpg";
      const downloadFilename = `${artwork.slug}-${resName.toLowerCase()}.${ext}`;

      // Record download
      await recordDownload(license.id);
      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { downloadCount: { increment: 1 } },
      });

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${downloadFilename}"`,
          "Content-Length": buffer.byteLength.toString(),
        },
      });
    }

    // Handle remote URL (e.g. Unsplash or R2 public URL)
    if (heroImage.startsWith("http://") || heroImage.startsWith("https://")) {
      const imageRes = await fetch(heroImage);
      if (!imageRes.ok) {
        return NextResponse.json({ error: "Failed to retrieve artwork file" }, { status: 502 });
      }

      const buffer = await imageRes.arrayBuffer();
      const contentType = imageRes.headers.get("content-type") || "image/png";

      // Record download
      await recordDownload(license.id);
      await prisma.artwork.update({
        where: { id: artwork.id },
        data: { downloadCount: { increment: 1 } },
      });

      return new NextResponse(buffer, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${filename}"`,
          "Content-Length": buffer.byteLength.toString(),
        },
      });
    }

    // Handle local file
    const cleanPath = heroImage.startsWith("/") ? heroImage.slice(1) : heroImage;
    const candidates = [
      path.join(process.cwd(), "public", cleanPath),
      path.join(process.cwd(), "public", "uploads", cleanPath),
      path.join(process.cwd(), cleanPath),
    ];

    let foundPath = candidates.find((p) => existsSync(p));

    if (!foundPath) {
      return NextResponse.json({ error: "Artwork file not found on server" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(foundPath);
    const ext = path.extname(foundPath).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
    };
    const contentType = mimeTypes[ext] || "application/octet-stream";

    // Record download
    await recordDownload(license.id);
    await prisma.artwork.update({
      where: { id: artwork.id },
      data: { downloadCount: { increment: 1 } },
    });

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("[Download API error]", err);
    return NextResponse.json({ error: "Internal server error downloading artwork" }, { status: 500 });
  }
}