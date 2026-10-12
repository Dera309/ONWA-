"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Wifi } from "lucide-react";

export function NetworkStatusProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check initial online status
    if (!navigator.onLine) {
      setIsOffline(true);
    }

    const handleOffline = () => {
      setIsOffline(true);
      setShowRestored(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowRestored(true);
      const timer = setTimeout(() => {
        setShowRestored(false);
      }, 3000);
      return () => clearTimeout(timer);
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return (
    <>
      {children}

      {/* Offline Alert Banner */}
      {isOffline && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 bg-red-950/90 text-red-200 border border-red-500/30 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-sans tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
        >
          <WifiOff className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>Internet connection lost · Reconnecting to authentication & servers...</span>
        </div>
      )}

      {/* Online Restored Toast */}
      {showRestored && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 bg-emerald-950/90 text-emerald-200 border border-emerald-500/30 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2.5 text-xs font-sans tracking-wide animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
        >
          <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          <span>Connection restored · Reconnected</span>
        </div>
      )}
    </>
  );
}
