import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function POST(
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

    // Update artwork status to PUBLISHED
    const artwork = await prisma.artwork.update({
      where: { id },
      data: {
        status: Status.PUBLISHED,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({ artwork }, { status: 200 });
  } catch (error) {
    console.error("Error publishing artwork:", error);
    return NextResponse.json(
      { error: "Failed to publish artwork" },
      { status: 500 }
    );
  }
}
