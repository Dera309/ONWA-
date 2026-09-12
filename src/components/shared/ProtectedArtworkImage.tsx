"use client";

import React, { useState } from "react";
import { useArtworkProtection } from "@/components/providers/ArtworkProtectionProvider";

interface ProtectedArtworkImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  watermark?: boolean;
  watermarkText?: string;
  showWatermark?: boolean;
  aspectRatio?: string;
}

export function ProtectedArtworkImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "",
  watermark = true,
  watermarkText = "ONWA DIGITAL MUSEUM • COPYRIGHT PROTECTED",
  showWatermark = true,
}: ProtectedArtworkImageProps) {
  const { isShieldActive, showWarningToast } = useArtworkProtection();
  const [isHovered, setIsHovered] = useState(false);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    showWarningToast("Image extraction & right-click are restricted by ONWA Museum DRM.");
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
    showWarningToast("Dragging artworks is prohibited.");
  };

  return (
    <div
      className={`relative overflow-hidden select-none protected-artwork-container ${containerClassName}`}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Base Artwork Image */}
      <img
        src={src}
        alt={alt}
        className={`protected-artwork-image transition-all duration-500 pointer-events-none ${
          isShieldActive ? "artwork-capture-shielded" : className
        }`}
        draggable={false}
      />

      {/* 2. Transparent Anti-Save / Anti-Extract Shield Layer */}
      <div
        className="absolute inset-0 z-10 bg-transparent cursor-default"
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        aria-hidden="true"
      />

      {/* 3. Subtle Museum Watermark & Forensic Pattern Layer */}
      {showWatermark && watermark && (
        <div
          className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-4 overflow-hidden select-none opacity-40 hover:opacity-60 transition-opacity"
          aria-hidden="true"
        >
          {/* Subtle Diagonal Museum Pattern */}
          <div className="absolute inset-0 flex items-center justify-center -rotate-12 pointer-events-none opacity-15">
            <span className="text-[12px] md:text-sm font-mono tracking-[0.3em] uppercase text-white/70 whitespace-nowrap">
              {watermarkText} · {watermarkText}
            </span>
          </div>

          {/* Top Security Seal */}
          <div className="flex justify-between items-start text-[9px] font-mono tracking-widest text-white/50 uppercase">
            <span>ONWA MUSEUM DRM</span>
            <span className="px-1.5 py-0.5 border border-white/20 bg-black/40 backdrop-blur-sm rounded text-[8px]">
              AUTHENTIC WORK
            </span>
          </div>

          {/* Bottom Provenance Watermark */}
          <div className="flex justify-between items-end text-[9px] font-mono tracking-widest text-white/40 uppercase">
            <span>PREVIEW ONLY · REPRODUCTION PROHIBITED</span>
            <span>© ONWA</span>
          </div>
        </div>
      )}

      {/* 4. Active Screenshot / Screen Recording Blackout Shield */}
      {isShieldActive && (
        <div className="absolute inset-0 z-30 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-100">
          <div className="w-12 h-12 rounded-full border border-primary/50 flex items-center justify-center mb-4">
            <span className="text-xl text-primary">🛡️</span>
          </div>
          <h4 className="museum-heading text-headline-sm text-primary mb-2">
            Protected Cultural Masterwork
          </h4>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            Screenshots, screen recording, and unauthorized reproductions are restricted by ONWA Museum DRM to preserve artist copyright and sacred African heritage.
          </p>
        </div>
      )}
    </div>
  );
}