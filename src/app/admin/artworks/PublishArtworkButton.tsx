"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";

export default function PublishArtworkButton({ artworkId }: { artworkId: string }) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);

    try {
      const res = await fetch(`/api/admin/artworks/${artworkId}/publish`, {
        method: "POST",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to publish artwork");
      }

      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to publish artwork");
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handlePublish}
      disabled={isPublishing}
      className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-3"
      title="Publish artwork"
    >
      {isPublishing ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Publishing...</span>
        </>
      ) : (
        <>
          <Send className="w-3.5 h-3.5" />
          <span>Publish</span>
        </>
      )}
    </button>
  );
}
