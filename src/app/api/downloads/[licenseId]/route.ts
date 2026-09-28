import { NextRequest, NextResponse } from "next/server";
import { getCurrentCollector } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordDownload } from "@/lib/downloads";
import {
  generateArtworkDossierMarkdown,
  generateArtworkDossierJson,
} from "@/lib/artwork-dossier";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import JSZip from "jszip";

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

    const { searchParams } = new URL(req.url);
    const format = (searchParams.get("format") || searchParams.get("type") || "package").toLowerCase();

    const collector = await getCurrentCollector();
    if (!collector) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const license = await prisma.license.findUnique({
      where: { id: licenseId },
      include: {
        artwork: {
          include: {
            collection: true,
            moonCycle: true,
          },
        },
        collector: true,
        order: true,
      },
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

    const artwork = license.artwork;
    const resName = (license.resolution as any)?.name || (license.resolution as any)?.label || "Original";

    // Prepare Dossier data
    const dossierInput = {
      title: artwork.title,
      subtitle: artwork.subtitle,
      description: artwork.description,
      story: artwork.story,
      curatorNote: artwork.curatorNote,
      historicalContext: artwork.historicalContext,
      spiritualMeaning: artwork.spiritualMeaning,
      heroImageAlt: artwork.heroImageAlt,
      creativeProcess: artwork.creativeProcess,
      artistNotes: artwork.artistNotes,
      region: artwork.region,
      country: artwork.country,
      ethnicGroup: artwork.ethnicGroup,
      era: artwork.era,
      medium: artwork.medium,
      style: artwork.style,
      slug: artwork.slug,
      collection: artwork.collection
        ? {
            name: artwork.collection.name,
            slug: artwork.collection.slug,
            curatorNote: artwork.collection.curatorNote,
          }
        : null,
      moonCycle: artwork.moonCycle
        ? {
            name: artwork.moonCycle.name,
            phase: artwork.moonCycle.phase,
            theme: artwork.moonCycle.theme,
          }
        : null,
      license: {
        licenseKey: license.licenseKey,
        type: license.type,
        resolution: license.resolution,
        acquiredAt: license.createdAt,
        collectorName: collector.name || collector.email,
      },
    };

    // If downloading ONLY the dossier text / markdown
    if (format === "dossier" || format === "story" || format === "markdown" || format === "md" || format === "txt" || format === "text") {
      const mdContent = generateArtworkDossierMarkdown(dossierInput);
      const isText = format === "txt" || format === "text";
      const contentType = isText ? "text/plain; charset=utf-8" : "text/markdown; charset=utf-8";
      const ext = isText ? "txt" : "md";

      return new NextResponse(mdContent, {
        headers: {
          "Content-Type": contentType,
          "Content-Disposition": `attachment; filename="${artwork.slug}-story-and-curation.${ext}"`,
        },
      });
    }

    // If downloading ONLY the metadata JSON
    if (format === "json") {
      const jsonContent = generateArtworkDossierJson(dossierInput);
      return new NextResponse(jsonContent, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Content-Disposition": `attachment; filename="${artwork.slug}-curation-metadata.json"`,
        },
      });
    }

    // Otherwise, we need the high-resolution artwork image asset (either for image-only or for the full package zip)
    // Check download limit for high-res asset downloads
    if (license.downloadCount >= license.maxDownloads) {
      return NextResponse.json(
        { error: `Maximum download limit (${license.maxDownloads}) reached for this license.` },
        { status: 403 }
      );
    }

    const heroImage = artwork.heroImage || "";
    let imageBuffer: Buffer;
    let imageExt = ".png";
    let imageContentType = "image/png";

    // 1. Handle data URL (base64 stored in database)
    if (heroImage.startsWith("data:")) {
      const commaIndex = heroImage.indexOf(",");
      const meta = heroImage.substring(0, commaIndex);
      const base64Data = heroImage.substring(commaIndex + 1);
      const mimeMatch = meta.match(/data:([^;]+)/);
      imageContentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      imageBuffer = Buffer.from(base64Data, "base64");
      const extMatch = imageContentType.split("/")[1] || "jpg";
      imageExt = `.${extMatch.replace("jpeg", "jpg")}`;
    }
    // 2. Handle remote URL (e.g. Unsplash or R2 public URL)
    else if (heroImage.startsWith("http://") || heroImage.startsWith("https://")) {
      const imageRes = await fetch(heroImage);
      if (!imageRes.ok) {
        return NextResponse.json({ error: "Failed to retrieve artwork file" }, { status: 502 });
      }
      const arrayBuf = await imageRes.arrayBuffer();
      imageBuffer = Buffer.from(arrayBuf);
      imageContentType = imageRes.headers.get("content-type") || "image/png";
      const extMatch = imageContentType.split("/")[1] || "png";
      imageExt = `.${extMatch.replace("jpeg", "jpg")}`;
    }
    // 3. Handle local file
    else {
      const cleanPath = heroImage.startsWith("/") ? heroImage.slice(1) : heroImage;
      const candidates = [
        path.join(process.cwd(), "public", cleanPath),
        path.join(process.cwd(), "public", "uploads", cleanPath),
        path.join(process.cwd(), cleanPath),
      ];

      const foundPath = candidates.find((p) => existsSync(p));
      if (!foundPath) {
        return NextResponse.json({ error: "Artwork file not found on server" }, { status: 404 });
      }

      imageBuffer = await fs.readFile(foundPath);
      const ext = path.extname(foundPath).toLowerCase();
      imageExt = ext || ".png";
      const mimeTypes: Record<string, string> = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
        ".mp3": "audio/mpeg",
        ".wav": "audio/wav",
      };
      imageContentType = mimeTypes[ext] || "application/octet-stream";
    }

    const imageFilename = `${artwork.slug}-${resName.toLowerCase()}${imageExt}`;

    // Record download count
    await recordDownload(license.id);
    await prisma.artwork.update({
      where: { id: artwork.id },
      data: { downloadCount: { increment: 1 } },
    });

    // If image only requested
    if (format === "image" || format === "artwork") {
      return new NextResponse(imageBuffer as any, {
        headers: {
          "Content-Type": imageContentType,
          "Content-Disposition": `attachment; filename="${imageFilename}"`,
          "Content-Length": imageBuffer.byteLength.toString(),
        },
      });
    }

    // Default: Package (ZIP archive with Artwork Image + Story & Curation Dossier + Metadata JSON)
    const zip = new JSZip();
    zip.file(imageFilename, imageBuffer);
    
    const mdContent = generateArtworkDossierMarkdown(dossierInput);
    zip.file(`${artwork.slug}-story-and-curation.md`, mdContent);

    const jsonContent = generateArtworkDossierJson(dossierInput);
    zip.file(`${artwork.slug}-metadata.json`, jsonContent);

    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: { level: 6 },
    });

    const zipFilename = `${artwork.slug}-collector-package.zip`;

    return new NextResponse(zipBuffer as any, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${zipFilename}"`,
        "Content-Length": zipBuffer.byteLength.toString(),
      },
    });
  } catch (err) {
    console.error("[Download API error]", err);
    return NextResponse.json({ error: "Internal server error downloading artwork package" }, { status: 500 });
  }
}