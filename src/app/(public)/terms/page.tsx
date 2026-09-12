import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ONWA - African Digital Museum",
  description: "Terms and conditions governing digital art acquisition, licensing, and museum access.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pt-24 pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-12">
          <p className="label-caps text-muted-foreground mb-4">Legal & Governance</p>
          <h1 className="museum-heading text-headline-lg text-primary mb-4">
            Terms of Service
          </h1>
          <p className="museum-body text-body-lg text-muted-foreground">
            Effective Date: July 2026
          </p>
        </div>

        <div className="artwork-mat p-8 md:p-12 space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">1. Agreement to Terms</h2>
            <p>
              By accessing ONWA, browsing exhibitions, or collecting digital artwork licenses, you agree to comply with these terms, our license agreements, and all applicable cultural intellectual property laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">2. Digital Art Licensing</h2>
            <p>
              Acquisition of digital artwork on ONWA conveys a non-exclusive, worldwide digital license governed by the tier selected at checkout (Personal, Commercial, or Extended Commercial). Ownership of underlying copyright and cultural provenance remains with ONWA and the contributing artists.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">3. Collector Conduct</h2>
            <p>
              Collectors may not redistribute, resell, claim moral authorship of, or misrepresent the cultural origin of ONWA digital masterworks beyond the explicit terms of their acquired license key.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="museum-heading text-headline-sm text-primary">4. Digital Delivery & Refunds</h2>
            <p>
              Upon successful payment verification, license certificates and high-resolution asset downloads are delivered instantly to your Collector Dashboard. Due to the immutable nature of digital downloads, sales are non-refundable once assets have been accessed.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}