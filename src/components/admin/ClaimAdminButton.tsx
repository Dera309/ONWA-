"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";

export function ClaimAdminButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClaim = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/claim", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to claim curator privileges");
      }
      // Refresh page to load admin layout
      window.location.href = "/admin/dashboard";
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 pt-2">
      <Button
        onClick={handleClaim}
        disabled={loading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 label-caps py-2.5 flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span>Activating Curator Access...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Activate Curator Access</span>
          </>
        )}
      </Button>
      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
          {error}
        </p>
      )}
    </div>
  );
}