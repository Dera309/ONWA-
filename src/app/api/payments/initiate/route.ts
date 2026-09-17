import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { initializeTransaction } from "@/lib/payments/paystack";
import { licenseTypes } from "@/config/payment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // Guard: Paystack key must be configured
    if (!process.env.PAYSTACK_SECRET_KEY) {
      return NextResponse.json(
        { error: "Payment system is not configured yet. Please add your PAYSTACK_SECRET_KEY to .env and restart the server." },
        { status: 503 }
      );
    }

    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email =
      (sessionClaims?.email as string | undefined) ||
      (sessionClaims?.primaryEmail as string | undefined) ||
      `${userId}@onwa.art`;
    const name = [sessionClaims?.firstName, sessionClaims?.lastName]
      .filter(Boolean)
      .join(" ");

    let collector = await prisma.collector.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: { equals: email, mode: "insensitive" } },
        ],
      },
    });

    if (!collector) {
      collector = await prisma.collector.create({
        data: {
          clerkId: userId,
          email,
          name: name.trim() || null,
        },
      });
    } else if (collector.clerkId !== userId) {
      collector = await prisma.collector.update({
        where: { id: collector.id },
        data: { clerkId: userId },
      });
    }

    const body = await req.json();
    const { artworkId, resolution, licenseType = "PERSONAL" } = body;

    if (!artworkId || !resolution) {
      return NextResponse.json(
        { error: "artworkId and resolution are required" },
        { status: 400 }
      );
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId, status: "PUBLISHED" },
    });
    if (!artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    // Check if collector already owns an active license for this license type
    const existingLicense = await prisma.license.findFirst({
      where: {
        collectorId: collector.id,
        artworkId,
        type: licenseType,
        active: true,
        revoked: false,
      },
    });
    if (existingLicense) {
      return NextResponse.json(
        {
          error: "You already own an active license for this artwork.",
          alreadyOwned: true,
          licenseId: existingLicense.id,
        },
        { status: 409 }
      );
    }

    const multiplier =
      licenseTypes[licenseType as keyof typeof licenseTypes]?.priceMultiplier ?? 1;

    // Find resolution price multiplier from stored artwork resolutions
    const resolutions = Array.isArray(artwork.availableResolutions)
      ? (artwork.availableResolutions as any[])
      : [];
    const resMeta = resolutions.find(
      (r: any) => r.name?.toLowerCase() === resolution?.toLowerCase()
    );
    const resMultiplier = resMeta?.priceMultiplier ?? 1;

    const amount = artwork.price * multiplier * resMultiplier;

    const transaction = await initializeTransaction({
      artworkId,
      resolution,
      licenseType,
      amount,
      currency: artwork.currency || "USD",
      email: collector.email,
      metadata: {
        collector_id: collector.id,
        artwork_slug: artwork.slug,
        artwork_title: artwork.title,
      },
    });

    return NextResponse.json({
      authorizationUrl: transaction.authorization_url,
      reference: transaction.reference,
      amount,
    });
  } catch (err) {
    console.error("[POST /api/payments/initiate]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to initiate payment" },
      { status: 500 }
    );
  }
}
