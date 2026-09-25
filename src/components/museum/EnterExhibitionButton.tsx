"use client";

import { ChevronDown } from "lucide-react";

interface EnterExhibitionButtonProps {
  targetId?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EnterExhibitionButton({
  targetId = "exhibition",
  className = "",
  children,
}: EnterExhibitionButtonProps) {
  const handleScroll = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      const headerOffset = 90;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    } else {
      const el = document.querySelector(`#${targetId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.location.hash = targetId;
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleScroll}
      className={`inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 label-caps text-xs sm:text-sm cursor-pointer shadow-sm group ${className}`}
    >
      <span>{children || "Enter Exhibition"}</span>
      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
    </button>
  );
}
