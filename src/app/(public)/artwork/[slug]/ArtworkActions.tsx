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

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

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

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

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
          <p className="label-caps text-muted-foreground mb-3">Resolution</p>
          <div className="space-y-2">
            {resolutions.map((res) => {
              const name = res.name || res.label || `${res.width}×${res.height}`;
              const resPrice = price * (res.priceMultiplier ?? 1) * (licenseMeta?.multiplier ?? 1);
              return (
                <button
                  key={name}
                  onClick={() => setSelectedResolution(name)}
                  className={`w-full flex justify-between items-center px-4 py-3 border transition-colors text-sm ${
                    selectedResolution === name
                      ? "border-primary text-primary"
                      : "border-border/20 text-muted-foreground hover:border-primary/50"
                  }`}
                >
                  <span>{name} — {res.width}×{res.height}{res.dpi ? ` · ${res.dpi}dpi` : ""}</span>
                  <span>${resPrice.toFixed(2)}</span>
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
                className={`w-full flex justify-between items-center px-4 py-3 border transition-colors text-sm ${
                  selectedLicense === opt.value
                    ? "border-primary text-primary"
                    : "border-border/20 text-muted-foreground hover:border-primary/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span>{opt.label}</span>
                  {isOwned && (
                    <span className="px-1.5 py-0.5 text-[10px] bg-primary/20 text-primary border border-primary/30 rounded font-mono">
                      OWNED
                    </span>
                  )}
                </span>
                <span>${(price * (resolutionMeta?.priceMultiplier ?? 1) * opt.multiplier).toFixed(2)}</span>
              </button>
            );
          })}
        </div>
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
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold label-caps hover:opacity-90 transition-opacity shrink-0"
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
          <Link
            href="/collected-works"
            className="flex-1 inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 bg-primary text-primary-foreground hover:opacity-90 transition-all duration-300 label-caps text-xs sm:text-sm font-semibold gap-2 text-center"
          >
            <span>Access in Collected Works</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        ) : (
          <button
            onClick={handleAddToRitual}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Processing..." : "Add to Ritual"}
          </button>
        )}
        <button
          onClick={handleFutureCollection}
          disabled={wishlistLoading || wishlistAdded}
          className="inline-flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {wishlistAdded ? "✓ Saved" : wishlistLoading ? "Saving..." : "Future Collection"}
        </button>
      </div>
    </div>
  );
}
