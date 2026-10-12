"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface CollectionCoverImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function CollectionCoverImage({ src, alt, className = "" }: CollectionCoverImageProps) {
  const [hasError, setHasError] = useState(false);

  const normalizedSrc = src
    ? src.startsWith("http") || src.startsWith("/") || src.startsWith("data:")
      ? src
      : `/${src}`
    : null;

  if (!normalizedSrc || hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 bg-surface-container-low">
        <ImageIcon className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden select-none protected-artwork-container">
      <img
        src={normalizedSrc}
        alt={alt}
        draggable={false}
        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none select-none ${className}`}
        onError={() => setHasError(true)}
      />
      {/* Transparent anti-save overlay */}
      <div className="absolute inset-0 z-10 bg-transparent cursor-pointer" aria-hidden="true" />
    </div>
  );
}
