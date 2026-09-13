import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    let userEmail = "";
    let userName = "Admin Curator";

    try {
      const user = await currentUser();
      userEmail = user?.emailAddresses?.[0]?.emailAddress?.toLowerCase() || "";
      userName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Admin Curator";
    } catch (e) {
      console.warn("Could not fetch currentUser in claim API:", e);
    }

    if (!userEmail) {
      userEmail = `admin-${userId}@onwa.art`;
    }

    // Check if admin already exists by clerkId or email
    let admin = await prisma.admin.findFirst({
      where: {
        OR: [
          { clerkId: userId },
          { email: { equals: userEmail, mode: "insensitive" } },
        ],
      },
    });

    if (admin) {
      admin = await prisma.admin.update({
        where: { id: admin.id },
        data: {
          clerkId: userId,
          email: userEmail,
          name: userName,
          role: "SUPER_ADMIN",
          permissions: ["all"],
        },
      });
    } else {
      // Check if placeholder admin exists
      const placeholder = await prisma.admin.findFirst({
        where: { email: "admin@onwa.art" },
      });

      if (placeholder) {
        admin = await prisma.admin.update({
          where: { id: placeholder.id },
          data: {
            clerkId: userId,
            email: userEmail,
            name: userName,
            role: "SUPER_ADMIN",
            permissions: ["all"],
          },
        });
      } else {
        admin = await prisma.admin.create({
          data: {
            clerkId: userId,
            email: userEmail,
            name: userName,
            role: "SUPER_ADMIN",
            permissions: ["all"],
          },
        });
      }
    }

    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    console.error("Error in /api/admin/claim:", error);
    return NextResponse.json(
      { error: error.message || "Failed to claim curator privileges" },
      { status: 500 }
    );
  }
}