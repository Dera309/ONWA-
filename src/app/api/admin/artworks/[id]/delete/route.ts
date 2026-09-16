import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Cascade delete any related records to prevent foreign key / constraint errors
    await prisma.wishlistItem.deleteMany({
      where: { artworkId: id },
    });

    await prisma.review.deleteMany({
      where: { artworkId: id },
    });

    await prisma.relatedArtwork.deleteMany({
      where: {
        OR: [{ artworkId: id }, { relatedId: id }],
      },
    });

    await prisma.license.deleteMany({
      where: { artworkId: id },
    });

    await prisma.orderItem.deleteMany({
      where: { artworkId: id },
    });

    // Delete the artwork
    await prisma.artwork.delete({
      where: { id },
    });

    const isHtmlForm = request.headers.get("accept")?.includes("text/html");
    if (isHtmlForm) {
      return NextResponse.redirect(new URL("/admin/artworks", request.url));
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete artwork" },
      { status: 500 }
    );
  }
}
