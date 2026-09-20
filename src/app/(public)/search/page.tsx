"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search as SearchIcon, X, Loader2, Sparkles, Image as ImageIcon, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProtectedArtworkImage } from "@/components/shared/ProtectedArtworkImage";

interface SearchResults {
  artworks: any[];
  collections: any[];
  journal: any[];
  stories: any[];
}

const QUICK_SUGGESTIONS = [
  "Mother Nature",
  "Egypt",
  "Yoruba",
  "Mali",
  "Kente",
  "Full Moon",
  "West Africa",
];

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialQuery = searchParams.get("q") || "";
  const initialType = searchParams.get("type") || "all";

  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string>(initialType);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [results, setResults] = useState<SearchResults>({
    artworks: [],
    collections: [],
    journal: [],
    stories: [],
  });

  const performSearch = useCallback(
    async (searchTerm: string, type: string) => {
      const clean = searchTerm.trim();
      if (!clean) {
        setResults({ artworks: [], collections: [], journal: [], stories: [] });
        setHasSearched(false);
        return;
      }

      setIsSearching(true);
      setHasSearched(true);

      try {
        const params = new URLSearchParams();
        params.set("q", clean);
        params.set("type", type);

        const res = await fetch(`/api/search?${params.toString()}`);
        if (!res.ok) throw new Error("Search request failed");

        const data = await res.json();
        setResults({
          artworks: data.results?.artworks || [],
          collections: data.results?.collections || [],
          journal: data.results?.journal || [],
          stories: data.results?.stories || [],
        });
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Execute search on initial mount or when query param changes
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const t = searchParams.get("type") || "all";
    setQuery(q);
    setActiveType(t);

    if (q) {
      performSearch(q, t);
    }
  }, [searchParams, performSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const params = new URLSearchParams();
    params.set("q", query.trim());
    if (activeType !== "all") {
      params.set("type", activeType);
    }

    router.push(`/search?${params.toString()}`, { scroll: false });
    performSearch(query.trim(), activeType);
  };

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    if (query.trim()) {
      const params = new URLSearchParams();
      params.set("q", query.trim());
      if (type !== "all") {
        params.set("type", type);
      }
      router.push(`/search?${params.toString()}`, { scroll: false });
      performSearch(query.trim(), type);
    }
  };

  const handleSuggestionClick = (term: string) => {
    setQuery(term);
    const params = new URLSearchParams();
    params.set("q", term);
    if (activeType !== "all") {
      params.set("type", activeType);
    }
    router.push(`/search?${params.toString()}`, { scroll: false });
    performSearch(term, activeType);
  };

  const handleClear = () => {
    setQuery("");
    setHasSearched(false);
    setResults({ artworks: [], collections: [], journal: [], stories: [] });
    router.push("/search", { scroll: false });
  };

  const totalResults =
    results.artworks.length +
    results.collections.length +
    results.journal.length +
    results.stories.length;

  return (
    <div className="min-h-screen pt-28 md:pt-36 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <p className="label-caps text-muted-foreground mb-3 text-xs">Explore Museum Archive</p>
          <h1 className="museum-heading text-display-md-mobile md:text-display-md text-primary mb-4">
            Search ONWA
          </h1>
          <p className="museum-body text-sm md:text-body-md text-muted-foreground">
            Discover masterworks, sacred collections, cultural stories, and essays across Africa.
          </p>
        </div>

        {/* Search Input Form */}
        <div className="max-w-3xl mx-auto mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center shadow-lg rounded-lg border border-border/40 bg-surface-container-lowest focus-within:border-primary/60 transition-colors">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search artworks, collections, culture, stories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-28 text-base md:text-lg bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground/60"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                {query && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                <Button
                  type="submit"
                  disabled={!query.trim() || isSearching}
                  className="h-10 px-5 label-caps text-xs cursor-pointer"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Searching</span>
                    </>
                  ) : (
                    <span>Search</span>
                  )}
                </Button>
              </div>
            </div>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Suggestions:
            </span>
            {QUICK_SUGGESTIONS.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => handleSuggestionClick(term)}
                className="px-2.5 py-1 rounded-full border border-border/40 bg-surface-container-low/50 text-muted-foreground hover:text-primary hover:border-primary/50 transition-colors cursor-pointer"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        {hasSearched && (
          <div className="max-w-3xl mx-auto mb-10 flex items-center justify-center gap-2 border-b border-border/20 pb-4">
            {[
              { id: "all", label: "All", count: totalResults, icon: Layers },
              { id: "artworks", label: "Artworks", count: results.artworks.length, icon: ImageIcon },
              { id: "collections", label: "Collections", count: results.collections.length, icon: Layers },
              { id: "journal", label: "Journal & Stories", count: results.journal.length + results.stories.length, icon: BookOpen },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTypeChange(tab.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 label-caps text-xs rounded transition-colors cursor-pointer ${
                    isActive
                      ? "border border-primary bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-surface-container-low"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                  {hasSearched && !isSearching && (
                    <span className="text-[10px] opacity-70">({tab.count})</span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {isSearching && (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="museum-body text-body-md text-muted-foreground">
              Searching the museum archive for "{query}"...
            </p>
          </div>
        )}

        {/* Results Area */}
        {!isSearching && hasSearched && (
          <div className="space-y-16">
            {totalResults === 0 ? (
              <div className="text-center py-16 max-w-md mx-auto space-y-4">
                <p className="museum-heading text-headline-md text-primary">No Results Found</p>
                <p className="museum-body text-body-md text-muted-foreground">
                  We could not find anything matching "{query}". Try checking the spelling or searching for a different cultural keyword.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <Link
                    href="/gallery"
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
                  >
                    Explore Gallery
                  </Link>
                  <Link
                    href="/collections"
                    className="inline-flex items-center justify-center px-6 py-2.5 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs"
                  >
                    View Collections
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Artworks Results */}
                {(activeType === "all" || activeType === "artworks") && results.artworks.length > 0 && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/20 pb-3">
                      <h2 className="museum-heading text-headline-md text-primary flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        Artworks ({results.artworks.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {results.artworks.map((artwork) => (
                        <Link
                          key={artwork.id}
                          href={`/artwork/${artwork.slug}`}
                          className="block border border-border/20 p-4 group cursor-pointer hover:border-primary/50 transition-all bg-surface-container-lowest/30 hover:bg-surface-container-low/20"
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
                              {artwork.region || artwork.country}
                            </p>
                            <h3 className="museum-heading text-headline-md text-primary group-hover:text-primary/90 transition-colors line-clamp-1">
                              {artwork.title}
                            </h3>
                            <p className="museum-body text-body-sm text-muted-foreground line-clamp-2">
                              {artwork.description || artwork.story}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Collections Results */}
                {(activeType === "all" || activeType === "collections") && results.collections.length > 0 && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/20 pb-3">
                      <h2 className="museum-heading text-headline-md text-primary flex items-center gap-2">
                        <Layers className="w-5 h-5 text-primary" />
                        Collections ({results.collections.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.collections.map((col) => (
                        <Link
                          key={col.id}
                          href={`/collection/${col.slug}`}
                          className="block border border-border/20 p-6 group cursor-pointer hover:border-primary/50 transition-all bg-surface-container-lowest/30 hover:bg-surface-container-low/20"
                        >
                          <p className="label-caps text-muted-foreground text-[11px] mb-2">
                            {col.moonCycle?.name || "Collection"}
                          </p>
                          <h3 className="museum-heading text-headline-lg text-primary group-hover:text-primary/90 transition-colors mb-2">
                            {col.name}
                          </h3>
                          <p className="museum-body text-body-sm text-muted-foreground line-clamp-3">
                            {col.description}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}

                {/* Journal & Stories Results */}
                {(activeType === "all" || activeType === "journal") && (results.journal.length > 0 || results.stories.length > 0) && (
                  <section className="space-y-6">
                    <div className="flex items-center justify-between border-b border-border/20 pb-3">
                      <h2 className="museum-heading text-headline-md text-primary flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Journal & Stories ({results.journal.length + results.stories.length})
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {results.journal.map((post) => (
                        <Link
                          key={post.id}
                          href={`/journal/${post.slug}`}
                          className="block border border-border/20 p-6 group cursor-pointer hover:border-primary/50 transition-all bg-surface-container-lowest/30 hover:bg-surface-container-low/20"
                        >
                          <p className="label-caps text-muted-foreground text-[11px] mb-2">
                            Journal · {post.author || "Curator"}
                          </p>
                          <h3 className="museum-heading text-headline-md text-primary group-hover:text-primary/90 transition-colors mb-2">
                            {post.title}
                          </h3>
                          <p className="museum-body text-body-sm text-muted-foreground line-clamp-3">
                            {post.excerpt || post.content}
                          </p>
                        </Link>
                      ))}
                      {results.stories.map((story) => (
                        <Link
                          key={story.id}
                          href={`/journal/${story.slug}`}
                          className="block border border-border/20 p-6 group cursor-pointer hover:border-primary/50 transition-all bg-surface-container-lowest/30 hover:bg-surface-container-low/20"
                        >
                          <p className="label-caps text-muted-foreground text-[11px] mb-2">
                            Story · {story.region}
                          </p>
                          <h3 className="museum-heading text-headline-md text-primary group-hover:text-primary/90 transition-colors mb-2">
                            {story.title}
                          </h3>
                          <p className="museum-body text-body-sm text-muted-foreground line-clamp-3">
                            {story.excerpt || story.content}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}
          </div>
        )}

        {/* Initial Empty State */}
        {!hasSearched && !isSearching && (
          <div className="text-center py-16 border border-border/10 rounded-xl bg-surface-container-lowest/20 p-8">
            <p className="museum-heading text-headline-md text-primary mb-3">
              Begin Your Cultural Journey
            </p>
            <p className="museum-body text-body-md text-muted-foreground max-w-lg mx-auto mb-8">
              Search by kingdom, ethnic group, artwork title, spiritual meaning, or era to explore the depths of African heritage.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs"
              >
                Browse Gallery
              </Link>
              <Link
                href="/collections"
                className="inline-flex items-center justify-center px-6 py-3 border border-border text-muted-foreground hover:border-primary hover:text-primary transition-all duration-300 label-caps text-xs"
              >
                Explore Collections
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-32 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
