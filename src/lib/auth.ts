import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentCollector() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const collector = await prisma.collector.findUnique({
    where: { clerkId: userId },
  });

  return collector;
}

export async function requireCollector() {
  const collector = await getCurrentCollector();
  
  if (!collector) {
    // Auto-provision a Collector record for any authenticated Clerk user
    const { userId, sessionClaims } = await auth();
    if (userId) {
      const email =
        (sessionClaims?.email as string | undefined) ||
        `${userId}@onwa.art`;
      const name =
        ((sessionClaims?.firstName as string | undefined) || '') +
        ' ' +
        ((sessionClaims?.lastName as string | undefined) || '');

      const newCollector = await prisma.collector.create({
        data: {
          clerkId: userId,
          email,
          name: name.trim() || null,
        },
      });
      return newCollector;
    }
    throw new Error("Unauthorized");
  }

  return collector;
}

export async function getCurrentAdmin() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  const admin = await prisma.admin.findUnique({
    where: { clerkId: userId },
  });

  return admin;
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    throw new Error("Unauthorized: admin access required");
  }

  return admin;
}
