"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";

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
  const touchTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    // 1. Intercept Screenshot & Developer Tool Keyboard Shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen / PrtScn
      if (e.key === "PrintScreen" || e.code === "PrintScreen") {
        triggerProtectionShield("Screenshot blocked by ONWA Museum DRM.");
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

    // 2. Global Right-Click & Context Menu Prevention (Mobile & Desktop)
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      // Allow context menu only inside editable form elements
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }
      e.preventDefault();
      showWarningToast("Right-click & saving are restricted by ONWA Museum DRM.");
    };

    // 3. Global Drag & Drop Prevention
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
      showWarningToast("Extracting or dragging artworks is prohibited.");
    };

    // 4. Global Copy & Cut Prevention
    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.closest(".allow-copy"))) {
        return;
      }
      e.preventDefault();
      if (e.clipboardData) {
        e.clipboardData.setData("text/plain", "Protected Masterwork — ONWA Digital Museum. Unauthorized reproduction is strictly prohibited.");
      }
      showWarningToast("Copying content is restricted to preserve artwork copyright.");
    };

    // 5. Mobile Gesture & Multi-touch Protection
    const handleTouchStart = (e: TouchEvent) => {
      // Intercept Android 3-finger screenshot gesture
      if (e.touches && e.touches.length >= 3) {
        e.preventDefault();
        triggerProtectionShield("Multi-finger capture gesture blocked by ONWA DRM.");
        return;
      }

      // Intercept Mobile Long-Press (which triggers iOS / Android 'Save Image' callout)
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "IMG" || target.closest(".protected-artwork-container") || target.closest("main"))) {
        touchTimerRef.current = setTimeout(() => {
          showWarningToast("Image saving and long-press menus are disabled on mobile devices.");
        }, 450);
      }
    };

    const handleTouchEnd = () => {
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    const handleTouchMove = () => {
      // User is scrolling normally, clear long-press timer
      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
        touchTimerRef.current = null;
      }
    };

    // 6. Print & PDF Export Obfuscation
    const handleBeforePrint = () => {
      setIsShieldActive(true);
    };

    const handleAfterPrint = () => {
      setIsShieldActive(false);
    };

    // 7. Tab Visibility, App Switching & Focus Loss (Shields during OS screenshots / app switcher)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsShieldActive(true);
      } else {
        setTimeout(() => setIsShieldActive(false), 300);
      }
    };

    const handleWindowBlur = () => {
      // When screen capture tools, notification bars, or app switchers gain focus
      setIsShieldActive(true);
    };

    const handleWindowFocus = () => {
      setTimeout(() => setIsShieldActive(false), 200);
    };

    // Attach listeners
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("keyup", handleKeyUp, true);
    document.addEventListener("contextmenu", handleContextMenu, { capture: true });
    document.addEventListener("dragstart", handleDragStart, { capture: true });
    document.addEventListener("copy", handleCopy, { capture: true });
    document.addEventListener("cut", handleCopy, { capture: true });

    // Touch events for mobile
    window.addEventListener("touchstart", handleTouchStart, { capture: true, passive: false });
    window.addEventListener("touchend", handleTouchEnd, { capture: true });
    window.addEventListener("touchcancel", handleTouchEnd, { capture: true });
    window.addEventListener("touchmove", handleTouchMove, { capture: true, passive: true });

    // Focus & visibility events
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);
    window.addEventListener("pagehide", handleWindowBlur);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("keyup", handleKeyUp, true);
      document.removeEventListener("contextmenu", handleContextMenu, { capture: true });
      document.removeEventListener("dragstart", handleDragStart, { capture: true });
      document.removeEventListener("copy", handleCopy, { capture: true });
      document.removeEventListener("cut", handleCopy, { capture: true });

      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchend", handleTouchEnd, { capture: true });
      window.removeEventListener("touchcancel", handleTouchEnd, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });

      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
      window.removeEventListener("pagehide", handleWindowBlur);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (touchTimerRef.current) {
        clearTimeout(touchTimerRef.current);
      }
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
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] px-6 py-3 bg-black/95 text-primary border border-primary/40 shadow-2xl rounded backdrop-blur-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <p className="text-xs label-caps font-medium tracking-wide">
            {warningMessage}
          </p>
        </div>
      )}

      {/* App Switcher & Screen Capture Obfuscation Curtain */}
      {isShieldActive && (
        <div
          className="fixed inset-0 z-[9998] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center select-none pointer-events-auto"
          aria-hidden="true"
        >
          <div className="w-14 h-14 rounded-full border border-primary/40 flex items-center justify-center mb-4 bg-primary/5">
            <span className="text-2xl">🛡️</span>
          </div>
          <h3 className="museum-heading text-headline-sm text-primary mb-2">
            Protected Cultural Masterwork
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
            Screenshots, screen recording, and unauthorized image saving are restricted by ONWA Museum DRM to preserve artist copyright and sacred African heritage.
          </p>
        </div>
      )}
    </ArtworkProtectionContext.Provider>
  );
}