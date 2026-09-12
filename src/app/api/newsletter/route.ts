import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address format." },
        { status: 400 }
      );
    }

    // Check if subscription already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({
          success: true,
          message: "You are already part of the Collector Circle.",
          alreadySubscribed: true,
        });
      }

      // Reactivate subscription if previously unsubscribed
      await prisma.newsletterSubscription.update({
        where: { email: cleanEmail },
        data: {
          status: "active",
          subscribedAt: new Date(),
          unsubscribedAt: null,
          name: name ? String(name).trim() : existing.name,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your subscription has been reactivated.",
      });
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email: cleanEmail,
        name: name ? String(name).trim() : null,
        status: "active",
        categories: ["all", "art", "culture", "drops"],
        subscribedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Welcome to the Collector Circle. Thank you for subscribing.",
    });
  } catch (error: any) {
    console.error("[Newsletter API Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while processing your subscription. Please try again.",
      },
      { status: 500 }
    );
  }
}
