import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const artworksQuerySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("12"),
  region: z.string().optional(),
  country: z.string().optional(),
  moonCycle: z.string().optional(),
  status: z.string().optional().default("PUBLISHED"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = artworksQuerySchema.parse(Object.fromEntries(searchParams));

    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;

    const where: any = {
      status: query.status,
    };

    if (query.region && query.region.toLowerCase() !== "all") {
      where.region = { contains: query.region, mode: "insensitive" };
    }

    if (query.country) {
      where.country = query.country;
    }

    if (query.moonCycle) {
      where.moonCycleId = query.moonCycle;
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
          collection: true,
          moonCycle: true,
        },
        orderBy: { publishedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.artwork.count({ where }),
    ]);

    return NextResponse.json({
      artworks,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Failed to fetch artworks", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
