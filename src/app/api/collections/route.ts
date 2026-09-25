import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const moonCycle = searchParams.get("moonCycle");
    const region = searchParams.get("region");
    const featured = searchParams.get("featured");

    const where: any = {
      status: "PUBLISHED",
    };

    if (moonCycle && moonCycle !== "All") {
      where.moonCycle = {
        name: { contains: moonCycle, mode: "insensitive" },
      };
    }

    if (region && region !== "All") {
      where.region = { contains: region, mode: "insensitive" };
    }

    if (featured === "true") {
      where.featured = true;
    }

    const collections = await prisma.collection.findMany({
      where,
      include: {
        moonCycle: true,
        _count: {
          select: { artworks: { where: { status: "PUBLISHED" } } },
        },
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ collections });
  } catch (error) {
    console.error("Error fetching public collections:", error);
    return NextResponse.json(
      { error: "Failed to fetch collections" },
      { status: 500 }
    );
  }
}
