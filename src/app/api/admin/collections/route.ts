import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { uploadFile, generateCollectionCoverKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        moonCycle: true,
        _count: {
          select: { artworks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const moonCycleId = formData.get("moonCycleId") as string;
    const curatorNote = formData.get("curatorNote") as string | null;
    const region = formData.get("region") as string | null;
    const country = formData.get("country") as string | null;
    const era = formData.get("era") as string | null;
    const status = (formData.get("status") as Status) || Status.DRAFT;
    const featured = formData.get("featured") === "true";
    const coverImageFile = formData.get("coverImage") as File | null;
    const coverImageAlt = formData.get("coverImageAlt") as string | null;
    const coverImageUrl = formData.get("coverImageUrl") as string | null;

    if (!name || !description || !moonCycleId) {
      return NextResponse.json(
        { error: "Name, description, and Moon Cycle are required." },
        { status: 400 }
      );
    }

    // Verify moon cycle exists
    const moonCycle = await prisma.moonCycle.findUnique({
      where: { id: moonCycleId },
    });
    if (!moonCycle) {
      return NextResponse.json(
        { error: "Selected Moon Cycle does not exist." },
        { status: 400 }
      );
    }

    // Handle image upload
    let coverImage = coverImageUrl || "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800";
    if (coverImageFile && coverImageFile.size > 0) {
      try {
        const tempId = Date.now().toString();
        const key = generateCollectionCoverKey(tempId, coverImageFile.name);
        const bytes = await coverImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        coverImage = await uploadFile(key, buffer, coverImageFile.type);
      } catch (uploadError) {
        console.error("Error uploading cover image:", uploadError);
      }
    }

    // Generate unique slug
    let slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const existingCollection = await prisma.collection.findUnique({
      where: { slug },
    });

    if (existingCollection) {
      slug = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    }

    const collection = await prisma.collection.create({
      data: {
        slug,
        name,
        description,
        coverImage,
        coverImageAlt,
        moonCycleId,
        curatorNote,
        region,
        country,
        era,
        status,
        featured,
        publishedAt: status === Status.PUBLISHED ? new Date() : null,
      },
      include: {
        moonCycle: true,
      },
    });

    return NextResponse.json({ collection }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating collection:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create collection" },
      { status: 500 }
    );
  }
}
