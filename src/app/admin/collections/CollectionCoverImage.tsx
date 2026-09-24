"use client";

import { useState } from "react";
import { Image as ImageIcon } from "lucide-react";

interface CollectionCoverImageProps {
  src?: string | null;
  alt: string;
}

export function CollectionCoverImage({ src, alt }: CollectionCoverImageProps) {
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
    <img
      src={normalizedSrc}
      alt={alt}
      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      onError={() => setHasError(true)}
    />
  );
}
