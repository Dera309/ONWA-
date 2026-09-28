"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

interface Resolution {
  name?: string;
  label?: string;
  width: number;
  height: number;
  dpi?: number;
  priceMultiplier?: number;
}

interface OwnedLicense {
  id: string;
  type: string;
  resolution?: any;
}

interface ArtworkActionsProps {
  artworkId: string;
  artworkTitle: string;
  price: number;
  resolutions: Resolution[];
  ownedLicenses?: OwnedLicense[];
}

export default function ArtworkActions({
  artworkId,
  artworkTitle,
  price,
  resolutions,
  ownedLicenses = [],
}: ArtworkActionsProps) {
  const router = useRouter();
  const [selectedResolution, setSelectedResolution] = useState<string>(
    resolutions[0]?.name || resolutions[0]?.label || "Web"
  );
  const [selectedLicense, setSelectedLicense] = useState<string>("PERSONAL");
  const [dynamicOwnedTypes, setDynamicOwnedTypes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistAdded, setWishlistAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const licenseOptions = [
    { value: "PERSONAL", label: "Personal Use", multiplier: 1 },
    { value: "COMMERCIAL", label: "Commercial Use", multiplier: 2.5 },
    { value: "EXTENDED_COMMERCIAL", label: "Extended Commercial", multiplier: 5 },
  ];

  // Check if current selected license is owned
  const isLicenseOwned =
    ownedLicenses.some((l) => l.type === selectedLicense) ||
    dynamicOwnedTypes.includes(selectedLicense);

  const resolutionMeta = resolutions.find(
    (r) => (r.name || r.label)?.toLowerCase() === selectedResolution.toLowerCase()
  );
  const licenseMeta = licenseOptions.find((l) => l.value === selectedLicense);
  const totalPrice =
    price * (resolutionMeta?.priceMultiplier ?? 1) * (licenseMeta?.multiplier ?? 1);

  async function handleAddToRitual() {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payments/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artworkId,
          resolution: selectedResolution,
          licenseType: selectedLicense,
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 401 || text.includes("sign-in") || text.includes("login") || text.includes("Clerk")) {
          router.push("/sign-in");
          return;
        }
        throw new Error(
          res.status === 404
            ? "Payment service endpoint not found (404). Please refresh the page."
            : `Server error (${res.status}). Please try again shortly.`
        );
      }

      if (res.status === 401 || data.error === "Unauthorized" || data.requiresAuth) {
        router.push("/sign-in");
        return;
      }

      if (res.status === 409 || data.alreadyOwned) {
        // Mark as owned for this license type
        setDynamicOwnedTypes((prev) => [...prev, selectedLicense]);
        setError(null);
        return;
      }

      if (res.status === 503) {
        throw new Error("Payments are not available yet. Please check back soon.");
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to initiate payment");
      }

      if (!data.authorizationUrl) {
        throw new Error("Payment gateway did not return a checkout URL.");
      }

      // Redirect to Paystack checkout
      window.location.href = data.authorizationUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleFutureCollection() {
    setWishlistLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkId }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = JSON.parse(text);
      } catch {
        if (res.status === 401 || text.includes("sign-in") || text.includes("login") || text.includes("Clerk")) {
          router.push("/sign-in");
          return;
        }
        throw new Error(`Server returned error (${res.status}). Please try again.`);
      }

      if (res.status === 401 || data.error === "Unauthorized") {
        router.push("/sign-in");
        return;
      }

      if (res.status === 409 || res.ok) {
        setWishlistAdded(true);
      } else {
        throw new Error(data.error || "Failed to save to Future Collection");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Resolution selector */}
      {resolutions.length > 0 && (
        <div>
          <p className="label-caps text-muted-foreground mb-3">Print Version & Aspect Ratio</p>
          <div className="space-y-2">
            {resolutions.map((res) => {
              const name = res.name || res.label || `${res.width}×${res.height}`;
              const resPrice = price * (res.priceMultiplier ?? 1) * (licenseMeta?.multiplier ?? 1);
              const isSelected = selectedResolution.toLowerCase() === name.toLowerCase();

              return (
                <button
                  key={name}
                  onClick={() => setSelectedResolution(name)}
                  className={`w-full text-left px-4 py-3 border transition-colors rounded ${
                    isSelected
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border/20 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm text-foreground">{name}</span>
                    <span className="font-semibold text-primary">${resPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {res.width} × {res.height} px{res.dpi ? ` · ${res.dpi} DPI` : " · 300 DPI"}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* License selector */}
      <div>
        <p className="label-caps text-muted-foreground mb-3">License Type</p>
        <div className="space-y-2">
          {licenseOptions.map((opt) => {
            const isOwned =
              ownedLicenses.some((l) => l.type === opt.value) ||
              dynamicOwnedTypes.includes(opt.value);

            return (
              <button
                key={opt.value}
                onClick={() => setSelectedLicense(opt.value)}
                className={`w-full flex justify-between items-center px-4 py-3 border transition-colors text-sm rounded ${
                  selectedLicense === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border/20 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-foreground">{opt.label}</span>
                  {isOwned && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary border border-primary/30 rounded font-mono">
                      OWNED
                    </span>
                  )}
                </span>
                <span className="font-semibold text-primary">${(price * (resolutionMeta?.priceMultiplier ?? 1) * opt.multiplier).toFixed(2)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* What's included in Ritual Acquisition */}
      <div className="bg-surface-container-low/60 border border-primary/20 rounded p-4 space-y-2.5">
        <p className="label-caps text-[11px] text-primary font-semibold flex items-center gap-1.5">
          <span>✨</span>
          <span>Included in Ritual Acquisition Package:</span>
        </p>
        <ul className="text-xs text-muted-foreground/90 space-y-1.5">
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>{selectedResolution}</strong> (300 DPI Ultra High-Res Master Print File)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Story</strong> (Ancestral mythology & narrative)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Curator Note</strong> (Museum curatorial perspective)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Historical Context</strong> (Era, traditions & origins)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Spiritual Meaning</strong> (Cosmology & sacred symbolism)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Image Alt Text</strong> (Detailed visual description)</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="text-primary font-bold">✓</span>
            <span><strong>Cryptographic Provenance License</strong> with lifetime Vault access</span>
          </li>
        </ul>
      </div>

      {/* Total or Owned Banner */}
      {isLicenseOwned ? (
        <div className="p-4 bg-primary/10 border border-primary/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold text-primary">Already in Your Vault</p>
              <p className="text-xs text-muted-foreground">
                You own an active {selectedLicense.replace(/_/g, " ")} license for this masterwork.
              </p>
            </div>
          </div>
          <Link
            href="/collected-works"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold label-caps hover:opacity-90 transition-opacity shrink-0 rounded"
          >
            <span>View Works</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex justify-between items-center border-t border-border/20 pt-4">
          <p className="label-caps text-muted-foreground">Total</p>
          <p className="museum-heading text-headline-md text-primary">${totalPrice.toFixed(2)}</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded">
          {error}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        {isLicenseOwned ? (
          <div className="flex-1 flex flex-col sm:flex-row gap-2">
            {ownedLicenses.length > 0 && (
              <a
                href={`/api/downloads/${(ownedLicenses.find((l) => l.type === selectedLicense) || ownedLicenses[0]).id}?format=package`}
                download
                className="flex-1 inline-flex items-center justify-center px-4 py-3.5 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 label-caps text-xs sm:text-sm font-semibold gap-2 text-center rounded"
              >
                <span>📦 Download Masterpiece Package (.zip)</span>
              </a>
            )}
            <Link
              href="/collected-works"
              className="inline-flex items-center justify-center px-4 py-3.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm font-semibold gap-1.5 text-center rounded"
            >
              <span>Collected Works</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <button
            onClick={handleAddToRitual}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded font-semibold"
          >
            {isLoading ? "Processing Ritual..." : `Add to Ritual — $${totalPrice.toFixed(2)}`}
          </button>
        )}
        <button
          onClick={handleFutureCollection}
          disabled={wishlistLoading || wishlistAdded}
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed rounded"
        >
          {wishlistAdded ? "✓ Saved" : wishlistLoading ? "Saving..." : "Future Collection"}
        </button>
      </div>
    </div>
  );
}
