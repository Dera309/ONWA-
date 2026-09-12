"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ArtworkProtectionContextType {
  isShieldActive: boolean;
  triggerProtectionShield: (reason?: string) => void;
  showWarningToast: (message?: string) => void;
}

const ArtworkProtectionContext = createContext<ArtworkProtectionContextType>({
  isShieldActive: false,
  triggerProtectionShield: () => {},
  showWarningToast: () => {},
});

export const useArtworkProtection = () => useContext(ArtworkProtectionContext);

export function ArtworkProtectionProvider({ children }: { children: React.ReactNode }) {
  const [isShieldActive, setIsShieldActive] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const showWarningToast = useCallback((msg = "Artwork Protected — Screenshots, recording, and image extraction are restricted by ONWA Museum DRM.") => {
    setWarningMessage(msg);
    setTimeout(() => {
      setWarningMessage(null);
    }, 3500);
  }, []);

  const triggerProtectionShield = useCallback((reason?: string) => {
    setIsShieldActive(true);
    showWarningToast(reason);
    setTimeout(() => {
      setIsShieldActive(false);
    }, 2500);
  }, [showWarningToast]);

  useEffect(() => {
    // 1. Intercept Screenshot & Developer Tool Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen / PrtScn
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        triggerProtectionShield("Screenshot blocked by ONWA Museum DRM.");
        // Try clearing clipboard if possible
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Protected Artwork — ONWA Digital Museum").catch(() => {});
        }
      }

      // Windows Snipping Tool (Win + Shift + S) or Mac Screenshot (Cmd + Shift + 3 / 4 / 5)
      if (
        (e.metaKey || e.ctrlKey) &&
        e.shiftKey &&
        (e.key === "S" || e.key === "s" || e.key === "3" || e.key === "4" || e.key === "5")
      ) {
        triggerProtectionShield("Screen capture restricted on protected artwork.");
      }

      // Print (Ctrl + P / Cmd + P)
      if ((e.metaKey || e.ctrlKey) && (e.key === "P" || e.key === "p")) {
        e.preventDefault();
        showWarningToast("Printing is restricted to preserve artwork copyright.");
      }

      // Save Webpage (Ctrl + S / Cmd + S)
      if ((e.metaKey || e.ctrlKey) && (e.key === "S" || e.key === "s") && !e.shiftKey) {
        e.preventDefault();
        showWarningToast("Direct asset extraction is restricted.");
      }

      // View Source / Developer Tools (Ctrl+U, F12, Ctrl+Shift+I, Ctrl+Shift+C)
      if (
        e.key === "F12" ||
        ((e.metaKey || e.ctrlKey) && (e.key === "U" || e.key === "u")) ||
        ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === "I" || e.key === "i" || e.key === "C" || e.key === "c"))
      ) {
        // Obfuscate during inspection attempt
        setIsShieldActive(true);
        setTimeout(() => setIsShieldActive(false), 1500);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText("Protected Artwork — ONWA Digital Museum").catch(() => {});
        }
      }
    };

    // 2. Before Print handler
    const handleBeforePrint = () => {
      setIsShieldActive(true);
    };

    const handleAfterPrint = () => {
      setIsShieldActive(false);
    };

    // 3. Tab Visibility & App Switching Obfuscation (Prevents background capture/recording overlays)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
      } else {
        setTimeout(() => setIsShieldActive(false), 400);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [triggerProtectionShield, showWarningToast]);

  return (
    <ArtworkProtectionContext.Provider
      value={{
        isShieldActive,
        triggerProtectionShield,
        showWarningToast,
      }}
    >
      {children}

      {/* Global Protection Toast Notification */}
      {warningMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-black/95 text-primary border border-primary/40 shadow-2xl rounded backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <p className="text-xs label-caps font-medium tracking-wide">
            {warningMessage}
          </p>
        </div>
      )}
    </ArtworkProtectionContext.Provider>
  );
}