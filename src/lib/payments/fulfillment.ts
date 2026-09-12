import { prisma } from "@/lib/prisma";
import { licenseTypes } from "@/config/payment";
import { randomUUID } from "crypto";
import { LicenseType } from "@prisma/client";

export interface FulfillParams {
  paymentId: string;
  paymentProvider: "PAYSTACK" | "LEMON_SQUEEZY";
  collectorId?: string;
  collectorEmail: string;
  collectorName?: string;
  artworkId: string;
  artworkTitle?: string;
  artworkSlug?: string;
  resolution: string;
  licenseType: string;
  amount: number;
  paymentMethod?: string;
}

export async function fulfillOrderAndLicense(params: FulfillParams) {
  // Idempotency check: if order already exists for this payment reference, return it
  const existingOrder = await prisma.order.findFirst({
    where: { paymentId: params.paymentId },
    include: {
      items: true,
      licenses: {
        include: {
          artwork: true,
        },
      },
    },
  });

  if (existingOrder) {
    return {
      order: existingOrder,
      license: existingOrder.licenses[0] || null,
      isNew: false,
    };
  }

  // Ensure collector exists
  let collectorId = params.collectorId;
  if (!collectorId) {
    const existingCollector = await prisma.collector.findFirst({
      where: { email: params.collectorEmail },
    });
    if (existingCollector) {
      collectorId = existingCollector.id;
    } else {
      const newCollector = await prisma.collector.create({
        data: {
          clerkId: `guest_${randomUUID().slice(0, 12)}`,
          email: params.collectorEmail,
          name: params.collectorName || null,
        },
      });
      collectorId = newCollector.id;
    }
  }

  const artwork = await prisma.artwork.findUnique({
    where: { id: params.artworkId },
    select: { id: true, title: true, slug: true, heroImage: true, price: true },
  });

  if (!artwork) {
    throw new Error(`Artwork not found: ${params.artworkId}`);
  }

  const validLicenseType = (
    Object.keys(licenseTypes).includes(params.licenseType)
      ? params.licenseType
      : "PERSONAL"
  ) as LicenseType;

  const licenseConfig =
    licenseTypes[validLicenseType as keyof typeof licenseTypes] ??
    licenseTypes.PERSONAL;

  // Create Order
  const order = await prisma.order.create({
    data: {
      orderNumber: `ONWA-${Date.now()}`,
      collectorId: collectorId,
      collectorEmail: params.collectorEmail,
      collectorName: params.collectorName || null,
      paymentProvider: params.paymentProvider,
      paymentId: params.paymentId,
      paymentStatus: "COMPLETED",
      paymentMethod: params.paymentMethod || "card",
      currency: "USD",
      subtotal: params.amount,
      tax: 0,
      total: params.amount,
      status: "COMPLETED",
      paidAt: new Date(),
      completedAt: new Date(),
      items: {
        create: {
          artworkId: artwork.id,
          artworkTitle: params.artworkTitle || artwork.title,
          artworkSlug: params.artworkSlug || artwork.slug,
          artworkImage: artwork.heroImage,
          resolution: { name: params.resolution },
          licenseType: validLicenseType,
          unitPrice: params.amount,
          price: params.amount,
        },
      },
    },
  });

  // Create License
  const license = await prisma.license.create({
    data: {
      licenseKey: `LIC-${randomUUID().replace(/-/g, "").toUpperCase().slice(0, 16)}`,
      collectorId: collectorId,
      artworkId: artwork.id,
      orderId: order.id,
      type: validLicenseType,
      resolution: { name: params.resolution },
      maxDownloads: licenseConfig.maxDownloads,
      active: true,
    },
    include: {
      artwork: true,
    },
  });

  return {
    order,
    license,
    isNew: true,
  };
}
