import { Metadata } from "next";
import Link from "next/link";
import { verifyTransaction } from "@/lib/payments/paystack";
import { fulfillOrderAndLicense } from "@/lib/payments/fulfillment";
import { getCurrentCollector } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Payment Verification | ONWA",
};

export default async function PaystackVerifyPage({
  searchParams,
}: {
  searchParams: { reference?: string; trxref?: string };
}) {
  const reference = searchParams.reference || searchParams.trxref;
  let status: "success" | "failed" | "pending" = "pending";
  let message = "";
  let licenseKey = "";
  let artworkTitle = "";
  let licenseId = "";

  if (reference) {
    try {
      const data = await verifyTransaction(reference);
      
      if (data && data.status === "success") {
        status = "success";
        message = "Your collection ritual has been completed successfully.";

        const currentCollector = await getCurrentCollector();
        const metadata = data.metadata || {};

        if (metadata.artwork_id) {
          const fulfillment = await fulfillOrderAndLicense({
            paymentId: reference,
            paymentProvider: "PAYSTACK",
            collectorId: metadata.collector_id || currentCollector?.id,
            collectorEmail: data.customer?.email || currentCollector?.email || "",
            collectorName: `${data.customer?.first_name || ""} ${data.customer?.last_name || ""}`.trim() || currentCollector?.name || undefined,
            artworkId: metadata.artwork_id,
            artworkTitle: metadata.artwork_title,
            artworkSlug: metadata.artwork_slug,
            resolution: metadata.resolution || "Web",
            licenseType: metadata.license_type || "PERSONAL",
            amount: (data.amount || 0) / 100,
            paymentMethod: data.channel || "card",
          });

          if (fulfillment.license) {
            licenseKey = fulfillment.license.licenseKey;
            licenseId = fulfillment.license.id;
            artworkTitle = fulfillment.license.artwork?.title || metadata.artwork_title || "Artwork";
          }
        }
      } else {
        status = "failed";
        message = data?.gateway_response || "The transaction could not be verified.";
      }
    } catch (err) {
      console.error("[Paystack verify error]", err);
      status = "failed";
      message = err instanceof Error ? err.message : "Failed to verify transaction";
    }
  } else {
    status = "failed";
    message = "No payment reference was provided.";
  }

  return (
    <main className="min-h-screen bg-background pt-20 flex items-center justify-center">
      <div className="container max-w-lg mx-auto px-4 py-16 text-center">
        <div className="artwork-mat p-8 sm:p-12 space-y-6">
          <p className="label-caps text-muted-foreground">The Ritual of Collection</p>

          <h1 className="museum-heading text-headline-lg text-primary">
            {status === "success"
              ? "Collection Confirmed"
              : status === "failed"
              ? "Payment Unsuccessful"
              : "Order Processing"}
          </h1>

          <p className="museum-body text-body-md text-muted-foreground">
            {message}
          </p>

          {status === "success" && (
            <div className="bg-background/50 border border-primary/20 p-4 text-left space-y-2 rounded">
              {artworkTitle && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Artwork:</span>
                  <span className="text-primary font-medium">{artworkTitle}</span>
                </div>
              )}
              {licenseKey && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">License Key:</span>
                  <span className="font-mono text-xs text-primary">{licenseKey}</span>
                </div>
              )}
            </div>
          )}

          {reference && (
            <p className="font-mono text-xs text-muted-foreground/60 break-all">
              Reference: {reference}
            </p>
          )}

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            {status === "success" ? (
              <>
                {licenseId && (
                  <a
                    href={`/api/downloads/${licenseId}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 label-caps text-xs font-semibold"
                    download
                  >
                    Download Artwork
                  </a>
                )}
                <Link
                  href="/collected-works"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
                >
                  Collected Works
                </Link>
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs"
                >
                  Gallery
                </Link>
              </>
            ) : (
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
              >
                Back to Gallery
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
