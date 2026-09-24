import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { uploadFile, generateCollectionCoverKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const collection = await prisma.collection.findUnique({
      where: { id: params.id },
      include: {
        moonCycle: true,
        artworks: true,
      },
    });

    if (!collection) {
      return NextResponse.json({ error: "Collection not found" }, { status: 404 });
    }

    return NextResponse.json({ collection });
  } catch (error) {
    console.error("Error fetching collection:", error);
    return NextResponse.json(
      { error: "Failed to fetch collection" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const moonCycleId = formData.get("moonCycleId") as string;
    const curatorNote = formData.get("curatorNote") as string | null;
    const region = formData.get("region") as string | null;
    const country = formData.get("country") as string | null;
    const era = formData.get("era") as string | null;
    const status = (formData.get("status") as Status) || undefined;
    const featured = formData.get("featured") !== null ? formData.get("featured") === "true" : undefined;
    const coverImageFile = formData.get("coverImage") as File | null;
    const coverImageAlt = formData.get("coverImageAlt") as string | null;
    const coverImageUrl = formData.get("coverImageUrl") as string | null;

    if (!name || !description || !moonCycleId) {
      return NextResponse.json(
        { error: "Name, description, and Moon Cycle are required." },
        { status: 400 }
      );
    }

    let coverImage = coverImageUrl || undefined;
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const key = generateCollectionCoverKey(id, coverImageFile.name);
        const bytes = await coverImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        coverImage = await uploadFile(key, buffer, coverImageFile.type);
      } catch (uploadError: any) {
        console.error("Error uploading cover image:", uploadError);
        return NextResponse.json(
          { error: `Cover image upload failed: ${uploadError?.message || "Unknown error"}` },
          { status: 500 }
        );
      }
    }

    const updated = await prisma.collection.update({
      where: { id },
      data: {
        name,
        description,
        moonCycleId,
        curatorNote,
        region,
        country,
        era,
        ...(status && {
          status,
          publishedAt: status === Status.PUBLISHED ? new Date() : null,
        }),
        ...(featured !== undefined && { featured }),
        ...(coverImage && { coverImage }),
        ...(coverImageAlt !== null && { coverImageAlt }),
      },
      include: {
        moonCycle: true,
      },
    });

    return NextResponse.json({ collection: updated });
  } catch (error: any) {
    console.error("Error updating collection:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update collection" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if collection has artworks
    const artworkCount = await prisma.artwork.count({
      where: { collectionId: id },
    });

    if (artworkCount > 0) {
      return NextResponse.json(
        {
          error: `Cannot delete collection with ${artworkCount} associated artwork(s). Reassign or delete the artworks first.`,
        },
        { status: 400 }
      );
    }

    await prisma.collection.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting collection:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to delete collection" },
      { status: 500 }
    );
  }
}
