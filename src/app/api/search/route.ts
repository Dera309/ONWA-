import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = "force-dynamic";

const searchQuerySchema = z.object({
  q: z.string().min(1),
  type: z.enum(["all", "artworks", "collections", "journal", "stories"]).optional().default("all"),
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("12"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchQuerySchema.parse(Object.fromEntries(searchParams));

    const page = parseInt(query.page);
    const limit = parseInt(query.limit);
    const skip = (page - 1) * limit;

    const results: any = {
      artworks: [],
      collections: [],
      journal: [],
      stories: [],
    };

    if (query.type === "all" || query.type === "artworks") {
      results.artworks = await prisma.artwork.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
            { story: { contains: query.q, mode: "insensitive" } },
            { region: { contains: query.q, mode: "insensitive" } },
            { country: { contains: query.q, mode: "insensitive" } },
            { ethnicGroup: { contains: query.q, mode: "insensitive" } },
          ],
        },
        include: {
          collection: true,
          moonCycle: true,
        },
        skip: query.type === "artworks" ? skip : 0,
        take: query.type === "artworks" ? limit : 5,
      });
    }

    if (query.type === "all" || query.type === "collections") {
      results.collections = await prisma.collection.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { name: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
          ],
        },
        include: {
          moonCycle: true,
        },
        skip: query.type === "collections" ? skip : 0,
        take: query.type === "collections" ? limit : 5,
      });
    }

    if (query.type === "all" || query.type === "journal") {
      results.journal = await prisma.journal.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { excerpt: { contains: query.q, mode: "insensitive" } },
            { content: { contains: query.q, mode: "insensitive" } },
          ],
        },
        skip: query.type === "journal" ? skip : 0,
        take: query.type === "journal" ? limit : 5,
      });
    }

    if (query.type === "all" || query.type === "stories") {
      results.stories = await prisma.story.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { content: { contains: query.q, mode: "insensitive" } },
          ],
        },
        skip: query.type === "stories" ? skip : 0,
        take: query.type === "stories" ? limit : 5,
      });
    }

    return NextResponse.json({
      query: query.q,
      type: query.type,
      results,
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}