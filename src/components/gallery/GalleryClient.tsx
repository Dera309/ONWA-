"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";
import { Loader2 } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface MoonCycle {
  id: string;
  name: string;
  phase: string;
}

interface Artwork {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  region: string;
  country: string;
  heroImage: string;
  collection?: Collection | null;
  moonCycle?: MoonCycle | null;
}

interface GalleryClientProps {
  initialArtworks: Artwork[];
  initialTotal: number;
  initialTotalPages: number;
  currentRegion: string;
}

const REGIONS = [
  "All",
  "West Africa",
  "East Africa",
  "North Africa",
  "Southern Africa",
  "Central Africa",
];

export function GalleryClient({
  initialArtworks,
  initialTotal,
  initialTotalPages,
  currentRegion,
}: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedRegion, setSelectedRegion] = useState<string>(
    searchParams.get("region") || currentRegion || "All"
  );
  const [artworks, setArtworks] = useState<Artwork[]>(initialArtworks);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(initialTotalPages);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);

  // Sync selectedRegion when URL param changes
  useEffect(() => {
    const urlRegion = searchParams.get("region") || "All";
    if (urlRegion !== selectedRegion) {
      setSelectedRegion(urlRegion);
      fetchArtworks(urlRegion, 1, false);
    }
  }, [searchParams, selectedRegion]);

  const fetchArtworks = async (region: string, targetPage: number, append: boolean) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("limit", "12");
      if (region && region !== "All") {
        params.set("region", region);
      }

      const res = await fetch(`/api/artworks?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch artworks");

      const data = await res.json();
      const newArtworks: Artwork[] = data.artworks || [];
      const newTotalPages: number = data.pagination?.totalPages || 1;

      if (append) {
        setArtworks((prev) => [...prev, ...newArtworks]);
      } else {
        setArtworks(newArtworks);
      }

      setPage(targetPage);
      setTotalPages(newTotalPages);
    } catch (err) {
      console.error("Error loading artworks:", err);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleRegionClick = (region: string) => {
    if (region === selectedRegion) return;

    setSelectedRegion(region);
    const newParams = new URLSearchParams(searchParams.toString());
    if (region === "All") {
      newParams.delete("region");
    } else {
      newParams.set("region", region);
    }

    const newQuery = newParams.toString();
    router.push(newQuery ? `/gallery?${newQuery}` : "/gallery", { scroll: false });
    fetchArtworks(region, 1, false);
  };

  const handleLoadMore = () => {
    if (page < totalPages && !isLoadingMore) {
      fetchArtworks(selectedRegion, page + 1, true);
    }
  };

  return (
    <div>
      {/* Filters Bar */}
      <section className="py-8 px-4 border-b border-border/20 bg-background/50 backdrop-blur-sm sticky top-20 z-20">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {REGIONS.map((region) => {
              const isActive =
                (selectedRegion === "All" && region === "All") ||
                selectedRegion.toLowerCase() === region.toLowerCase();

              return (
                <button
                  key={region}
                  type="button"
                  onClick={() => handleRegionClick(region)}
                  className={`px-3 sm:px-4 py-1.5 sm:py-2 label-caps text-xs transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border border-border/50 text-muted-foreground hover:border-primary/60 hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {region}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 px-4 min-h-[50vh]">
        <div className="container mx-auto max-w-7xl">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="museum-body text-body-md text-muted-foreground">
                Loading {selectedRegion === "All" ? "artworks" : `${selectedRegion} artworks`}...
              </p>
            </div>
          ) : artworks.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto space-y-4">
              <p className="museum-heading text-headline-md text-primary">No Artworks Found</p>
              <p className="museum-body text-body-md text-muted-foreground">
                There are currently no artworks listed under {selectedRegion}.
              </p>
              <button
                type="button"
                onClick={() => handleRegionClick("All")}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
              >
                View All Artworks
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {artworks.map((artwork) => (
                <Link
                  key={artwork.id}
                  href={`/artwork/${artwork.slug}`}
                  className="block border border-border/20 p-4 group cursor-pointer hover:border-primary/50 transition-all duration-300 bg-surface-container-lowest/30 hover:bg-surface-container-low/20"
                >
                  <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center overflow-hidden relative">
                    {artwork.heroImage ? (
                      <ProtectedArtworkImage
                        src={artwork.heroImage}
                        alt={artwork.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        containerClassName="w-full h-full"
                        watermarkText={`ONWA · ${artwork.title.toUpperCase()}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-surface-container to-surface-container-low group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="label-caps text-muted-foreground text-[11px] tracking-wider">
                      {artwork.region}
                    </p>
                    <h3 className="museum-heading text-headline-md text-primary group-hover:text-primary/90 transition-colors line-clamp-1">
                      {artwork.title}
                    </h3>
                    <p className="museum-body text-body-md text-muted-foreground line-clamp-1">
                      {artwork.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Load More Section */}
      {!isLoading && artworks.length > 0 && page < totalPages && (
        <section className="py-12 px-4 text-center border-t border-border/10">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground disabled:opacity-50 transition-all duration-300 label-caps cursor-pointer"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading Artworks...</span>
              </>
            ) : (
              <span>Load More Artworks</span>
            )}
          </button>
        </section>
      )}
    </div>
  );
}
