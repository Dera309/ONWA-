"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Layers, ArrowRight, Image as ImageIcon } from "lucide-react";
import { CollectionCoverImage } from "@/app/admin/collections/CollectionCoverImage";

export interface SerializedCollection {
  id: string;
  slug: string;
  name: string;
  description: string;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  curatorNote?: string | null;
  region?: string | null;
  country?: string | null;
  era?: string | null;
  featured: boolean;
  artworkCount?: number;
  _count?: {
    artworks: number;
  };
  moonCycle?: {
    id: string;
    name: string;
    phase: string;
    description?: string | null;
  } | null;
}

export interface MoonPhaseItem {
  id: string;
  name: string;
  description: string;
  image?: string;
}

interface CollectionsClientProps {
  initialCollections: SerializedCollection[];
  moonPhases: MoonPhaseItem[];
}

export function CollectionsClient({
  initialCollections,
  moonPhases,
}: CollectionsClientProps) {
  const [selectedPhase, setSelectedPhase] = useState<string>("All");

  const filteredCollections = useMemo(() => {
    if (selectedPhase === "All") {
      return initialCollections;
    }
    return initialCollections.filter((col) => {
      const colPhaseName = col.moonCycle?.name?.toLowerCase().trim();
      const targetPhaseName = selectedPhase.toLowerCase().trim();
      return colPhaseName === targetPhaseName || colPhaseName?.includes(targetPhaseName);
    });
  }, [initialCollections, selectedPhase]);

  const handlePhaseClick = (phaseName: string) => {
    if (selectedPhase.toLowerCase() === phaseName.toLowerCase()) {
      setSelectedPhase("All");
    } else {
      setSelectedPhase(phaseName);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      {/* Moon Cycles Guide & Interactive Selector */}
      <section className="py-12 px-4 border-b border-border/20 bg-surface-container-lowest/40">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="label-caps text-xs text-primary mb-1">Celestial Phases</p>
              <h2 className="museum-heading text-headline-md text-primary">
                Explore by Moon Cycle
              </h2>
            </div>
            {selectedPhase !== "All" && (
              <button
                type="button"
                onClick={() => setSelectedPhase("All")}
                className="text-xs label-caps text-muted-foreground hover:text-primary transition-colors border border-border/40 px-3 py-1.5 rounded"
              >
                Reset Filter (Show All)
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {moonPhases.map((phase) => {
              const isSelected = selectedPhase.toLowerCase() === phase.name.toLowerCase();
              const countForPhase = initialCollections.filter((col) =>
                col.moonCycle?.name?.toLowerCase().includes(phase.name.toLowerCase())
              ).length;

              return (
                <div
                  key={phase.id}
                  onClick={() => handlePhaseClick(phase.name)}
                  className={`artwork-mat group cursor-pointer p-6 transition-all duration-300 rounded-lg flex flex-col justify-between ${
                    isSelected
                      ? "border-primary bg-primary/10 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                      : "hover:border-primary/50 hover:bg-surface-container-low/30"
                  }`}
                >
                  <div>
                    <div className="aspect-square bg-surface-container-low mb-4 flex items-center justify-center p-4 relative overflow-hidden rounded group-hover:bg-surface-container transition-colors duration-300">
                      <img
                        src={phase.image || "/images/lunar/full-moon.svg"}
                        alt={phase.name}
                        className={`w-20 sm:w-24 h-20 sm:h-24 object-contain transition-transform duration-500 drop-shadow-[0_0_20px_rgba(212,175,55,0.25)] ${
                          isSelected ? "scale-110" : "group-hover:scale-105"
                        }`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    <div className="flex items-center justify-between mb-1">
                      <p className="label-caps text-primary text-xs font-semibold">
                        {phase.name}
                      </p>
                      <span className="text-[10px] label-caps px-2 py-0.5 rounded bg-surface-container-low text-muted-foreground border border-border/20">
                        {countForPhase} {countForPhase === 1 ? "collection" : "collections"}
                      </span>
                    </div>

                    <p className="museum-body text-body-sm text-muted-foreground line-clamp-2 mt-2">
                      {phase.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/10 flex items-center justify-between text-xs label-caps">
                    <span className={isSelected ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-primary"}>
                      {isSelected ? "Active Phase" : "Filter Collections"}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${isSelected ? "text-primary translate-x-1" : "text-muted-foreground group-hover:translate-x-1 group-hover:text-primary"}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Section Heading & Filter Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-border/20">
            <div>
              <p className="label-caps text-muted-foreground text-xs mb-1">Sanctuary Archives</p>
              <h2 className="museum-heading text-headline-lg text-primary flex items-center gap-2">
                <Layers className="w-6 h-6 text-primary" />
                <span>
                  {selectedPhase === "All"
                    ? "All Curated Collections"
                    : `${selectedPhase} Collections`}
                </span>
                <span className="text-body-md text-muted-foreground font-normal">
                  ({filteredCollections.length})
                </span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedPhase("All")}
                className={`px-4 py-2 label-caps text-xs rounded transition-all cursor-pointer ${
                  selectedPhase === "All"
                    ? "border border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                    : "border border-border/40 text-muted-foreground hover:border-primary/60 hover:text-primary hover:bg-surface-container-low"
                }`}
              >
                All
              </button>
              {moonPhases.map((phase) => (
                <button
                  key={phase.id}
                  type="button"
                  onClick={() => setSelectedPhase(phase.name)}
                  className={`px-4 py-2 label-caps text-xs rounded transition-all cursor-pointer ${
                    selectedPhase.toLowerCase() === phase.name.toLowerCase()
                      ? "border border-primary bg-primary/10 text-primary font-semibold shadow-sm"
                      : "border border-border/40 text-muted-foreground hover:border-primary/60 hover:text-primary hover:bg-surface-container-low"
                  }`}
                >
                  {phase.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collections Grid */}
          {filteredCollections.length === 0 ? (
            <div className="artwork-mat p-12 text-center max-w-md mx-auto space-y-4 my-12">
              <p className="museum-heading text-headline-md text-primary">No Collections in this Phase</p>
              <p className="museum-body text-body-md text-muted-foreground">
                There are currently no published collections under the {selectedPhase} phase.
              </p>
              <button
                type="button"
                onClick={() => setSelectedPhase("All")}
                className="inline-flex items-center justify-center px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs cursor-pointer"
              >
                View All Collections
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCollections.map((col) => {
                const count = col._count?.artworks ?? col.artworkCount ?? 0;

                return (
                  <Link
                    key={col.id}
                    href={`/collection/${col.slug}`}
                    className="artwork-mat group block p-6 overflow-hidden border border-border/30 hover:border-primary/60 transition-all duration-300 bg-surface-container-lowest/40 hover:bg-surface-container-low/30 rounded-lg flex flex-col justify-between"
                  >
                    <div>
                      {/* Cover Image */}
                      <div className="aspect-video bg-surface-container-low rounded-md overflow-hidden mb-5 relative border border-border/20">
                        <CollectionCoverImage src={col.coverImage} alt={col.name} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                        
                        {col.featured && (
                          <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-primary-foreground text-[10px] label-caps rounded-full flex items-center gap-1 shadow-md">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </div>
                        )}

                        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white/90 text-xs">
                          <span className="label-caps text-[10px] tracking-wider px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
                            {col.moonCycle?.name || "Moon Theme"}
                          </span>
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm border border-white/10">
                            {count} {count === 1 ? "Masterwork" : "Masterworks"}
                          </span>
                        </div>
                      </div>

                      {/* Region / Country */}
                      <p className="label-caps text-[11px] text-muted-foreground mb-2">
                        {[col.region, col.country, col.era].filter(Boolean).join(" · ") || "African Heritage"}
                      </p>

                      {/* Collection Title */}
                      <h3 className="museum-heading text-headline-md text-primary mb-3 group-hover:text-primary/90 transition-colors">
                        {col.name}
                      </h3>

                      {/* Description */}
                      <p className="museum-body text-body-sm text-muted-foreground line-clamp-3 leading-relaxed mb-4">
                        {col.description}
                      </p>
                    </div>

                    {/* View Action Link */}
                    <div className="pt-4 border-t border-border/10 flex items-center justify-between text-xs label-caps text-primary">
                      <span className="font-semibold group-hover:underline">
                        Enter Collection
                      </span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
