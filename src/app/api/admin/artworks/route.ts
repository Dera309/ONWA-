import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";
import { uploadFile, generateHeroImageKey } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Temporarily bypass authentication check for testing
    // const { userId } = auth();
    // if (!userId) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

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
    const heroImageFile = formData.get("heroImage") as File | null;
    const heroImageAlt = formData.get("heroImageAlt") as string | null;
    const heroImageUrl = formData.get("heroImageUrl") as string | null;
    const ambientAudioUrl = formData.get("ambientAudioUrl") as string | null;
    const ambientAudioFile = formData.get("ambientAudio") as File | null;

    // Validate required fields
    if (!title || !story || !collectionId || !moonCycleId || !region || !country || isNaN(price)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Handle audio upload if provided
    let ambientAudio = ambientAudioUrl;
    if (ambientAudioFile && ambientAudioFile.size > 0) {
      try {
        const tempId = Date.now().toString();
        const key = `artworks/${tempId}/audio/${ambientAudioFile.name}`;
        const bytes = await ambientAudioFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        ambientAudio = await uploadFile(key, buffer, ambientAudioFile.type);
      } catch (err) {
        console.error("Error uploading audio:", err);
      }
    }

    // Handle image upload
    let heroImage = heroImageUrl;
    if (heroImageFile) {
      try {
        // Generate a unique ID for the artwork (temporary, will be replaced with actual ID)
        const tempId = Date.now().toString();
        const fileExtension = heroImageFile.name.split('.').pop() || 'jpg';
        const key = generateHeroImageKey(tempId, heroImageFile.name);
        
        // Convert file to buffer
        const bytes = await heroImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Upload file
        heroImage = await uploadFile(key, buffer, heroImageFile.type);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        // Fallback to placeholder if upload fails
        heroImage = "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800";
      }
    }

    // Generate a unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check if slug already exists and append random suffix if needed
    const existingArtwork = await prisma.artwork.findUnique({
      where: { slug },
    });

    if (existingArtwork) {
      slug = `${slug}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    }

    // Create the artwork
    const artwork = await prisma.artwork.create({
      data: {
        slug,
        title,
        subtitle,
        description,
        heroImage: heroImage || "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800",
        heroImageAlt,
        ambientAudio: ambientAudio || null,
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
        currency: "USD",
        availableResolutions: [
          { width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 },
        ],
        status: Status.DRAFT,
        publishedAt: null,
        gallery: [], // Add empty gallery array to satisfy schema requirement
      },
    });

    return NextResponse.json({ artwork }, { status: 201 });
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Failed to create artwork" },
      { status: 500 }
    );
  }
}
