"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsSearching(true);
      // TODO: Implement actual search functionality
      console.log("Searching for:", query);
      setTimeout(() => setIsSearching(false), 1000);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="museum-heading text-4xl md:text-5xl text-primary mb-8 text-center">
            Search ONWA
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-12">
            <div className="relative flex items-center">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search artworks, collections, culture..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full h-12 sm:h-14 pl-12 sm:pl-14 pr-24 sm:pr-28 text-sm sm:text-lg bg-card border-border/20 rounded-md"
              />
              <Button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="absolute right-1.5 sm:right-2 top-1/2 -translate-y-1/2 h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>
          </form>

          {/* Search Results Placeholder */}
          {query && (
            <div className="space-y-6">
              <h2 className="museum-heading text-2xl text-primary">
                Search Results
              </h2>
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-4">
                  Search functionality is coming soon.
                </p>
                <p className="text-sm">
                  In the meantime, browse our{" "}
                  <a href="/gallery" className="text-primary hover:underline">
                    Gallery
                  </a>{" "}
                  or{" "}
                  <a href="/collections" className="text-primary hover:underline">
                    Collections
                  </a>
                  .
                </p>
              </div>
            </div>
          )}

          {!query && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">
                Enter a search term to explore our collection of African digital artwork.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
