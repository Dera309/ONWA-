import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ONWA - African Digital Museum",
  description: "Privacy policy and data governance practices at ONWA.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Legal & Privacy</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Privacy Policy
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Last Updated: July 2026
          </p>
        </div>

        <div className="artwork-mat p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">1. Our Commitment</h2>
            <p>
              ONWA is committed to honoring your digital privacy and safeguarding your personal data. We collect only the information necessary to fulfill artwork licensing, authenticate your collector account, and provide an immersive museum experience.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">2. Information We Collect</h2>
            <p>
              When you create an account, purchase digital licenses, or subscribe to our cultural journal, we collect your name, email address, and order transaction metadata. Payment credentials are encrypted and processed directly by our authorized PCI-DSS compliant gateways (Paystack and Lemon Squeezy); ONWA never stores raw payment card numbers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">3. Digital Rights & Storage</h2>
            <p>
              Your acquired artwork download records and cryptographic license keys are cataloged in our secure databases to ensure your lifetime entitlement to download and re-download your acquired high-resolution artworks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">4. Analytics & Tracking</h2>
            <p>
              We utilize anonymized analytics to measure exhibition attendance and understand how global collectors interact with African cultural narratives. We do not sell, rent, or trade personal data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">5. Contact Our Privacy Officer</h2>
            <p>
              For inquiries regarding data modification, export, or deletion requests, please contact privacy@onwa.art.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}