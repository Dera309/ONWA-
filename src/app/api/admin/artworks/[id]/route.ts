import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily bypass authentication check for testing
    // const { userId } = auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;
    const formData = await request.formData();

    // Extract form fields
    const title = formData.get("title") as string;
    const subtitle = formData.get("subtitle") as string | null;
    const description = formData.get("description") as string | null;
    const story = formData.get("story") as string;
    const curatorNote = formData.get("curatorNote") as string | null;
    const historicalContext = formData.get("historicalContext") as string | null;
    const spiritualMeaning = formData.get("spiritualMeaning") as string | null;
    const collectionId = formData.get("collectionId") as string;
    const moonCycleId = formData.get("moonCycleId") as string;
    const region = formData.get("region") as string;
    const country = formData.get("country") as string;
    const ethnicGroup = formData.get("ethnicGroup") as string | null;
    const era = formData.get("era") as string | null;
    const medium = formData.get("medium") as string | null;
    const style = formData.get("style") as string | null;
    const price = parseFloat(formData.get("price") as string);
    const status = formData.get("status") as Status | null;
    const ambientAudioUrl = formData.get("ambientAudioUrl") as string | null;
    const ambientAudioFile = formData.get("ambientAudio") as File | null;

    // Validate required fields
    if (!title || !story || !collectionId || !moonCycleId || !region || !country || isNaN(price)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let ambientAudio = ambientAudioUrl;
    if (ambientAudioFile && ambientAudioFile.size > 0) {
      try {
        const { uploadFile } = await import("@/lib/storage");
        const key = `artworks/${id}/audio/${ambientAudioFile.name}`;
        const bytes = await ambientAudioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        ambientAudio = await uploadFile(key, buffer, ambientAudioFile.type);
      } catch (err) {
        console.error("Error uploading audio:", err);
      }
    }

    // Update the artwork
    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        title,
        subtitle,
        description,
        story,
        curatorNote,
        historicalContext,
        spiritualMeaning,
        collectionId,
        moonCycleId,
        region,
        country,
        ethnicGroup,
        era,
        medium,
        style,
        price,
        ...(ambientAudio !== undefined && { ambientAudio }),
        ...(status && { status }),
      },
    });

    return NextResponse.json({ artwork }, { status: 200 });
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      { error: "Failed to update artwork" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily bypass authentication check for testing
    // const { userId } = auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { id } = params;

    // Delete the artwork
    await prisma.artwork.delete({
      where: { id },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error deleting artwork:", error);
    return NextResponse.json(
      { error: "Failed to delete artwork" },
      { status: 500 }
    );
  }
}
