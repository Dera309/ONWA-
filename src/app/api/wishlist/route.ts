import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { requireCollector } from "@/lib/auth";

export const dynamic = "force-dynamic";

// GET /api/wishlist — list collector's wishlist
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collector = await requireCollector().catch(() => null);
    if (!collector) {
      return NextResponse.json({ items: [] });
    }

    const items = await prisma.wishlistItem.findMany({
      where: { collectorId: collector.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ items });
  } catch (err) {
    console.error("[GET /api/wishlist]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// POST /api/wishlist — add artwork to wishlist
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collector = await requireCollector().catch(() => null);
    if (!collector) {
      return NextResponse.json({ error: "Collector profile could not be loaded" }, { status: 401 });
    }

    const { artworkId } = await req.json();
    if (!artworkId) {
      return NextResponse.json({ error: "artworkId required" }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId, status: "PUBLISHED" },
      select: { id: true, title: true, slug: true, heroImage: true },
    });
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    const item = await prisma.wishlistItem.upsert({
      where: {
        collectorId_artworkId: {
          collectorId: collector.id,
          artworkId,
        },
      },
      create: {
        collectorId: collector.id,
        artworkId,
        artworkTitle: artwork.title,
        artworkSlug: artwork.slug,
        artworkImage: artwork.heroImage,
      },
      update: {}, // already exists — no-op
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/wishlist]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/wishlist?artworkId=xxx — remove from wishlist
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const collector = await requireCollector().catch(() => null);
    if (!collector) {
      return NextResponse.json({ error: "Collector profile not found" }, { status: 404 });
    }

    const artworkId = req.nextUrl.searchParams.get("artworkId");
    if (!artworkId) {
      return NextResponse.json({ error: "artworkId required" }, { status: 400 });
    }

    await prisma.wishlistItem.deleteMany({
      where: { collectorId: collector.id, artworkId },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/wishlist]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
