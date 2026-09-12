import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@/lib/payments/paystack";
import { fulfillOrderAndLicense } from "@/lib/payments/fulfillment";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature") || "";

    const isValid = await verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    if (event.event === "charge.success") {
      const { reference, amount, customer, metadata, status, channel } = event.data;

      if (status !== "success") {
        return NextResponse.json({ received: true });
      }

      const {
        artwork_id,
        resolution,
        license_type,
        collector_id,
        artwork_title,
        artwork_slug,
      } = metadata || {};

      if (!artwork_id) {
        return NextResponse.json({ received: true, message: "No artwork in metadata" });
      }

      await fulfillOrderAndLicense({
        paymentId: reference,
        paymentProvider: "PAYSTACK",
        collectorId: collector_id,
        collectorEmail: customer?.email,
        collectorName: `${customer?.first_name || ""} ${customer?.last_name || ""}`.trim(),
        artworkId: artwork_id,
        artworkTitle: artwork_title,
        artworkSlug: artwork_slug,
        resolution: resolution || "Web",
        licenseType: license_type || "PERSONAL",
        amount: (amount || 0) / 100,
        paymentMethod: channel || "card",
      });
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[Paystack webhook]", err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
