"use client";

export default function DeleteArtworkButton({ artworkId }: { artworkId: string }) {
  return (
    <form
      action={`/api/admin/artworks/${artworkId}/delete`}
      method="POST"
      onSubmit={(e) => {
        if (!confirm("Are you sure you want to delete this artwork?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-destructive text-destructive-foreground hover:bg-destructive/90 h-8 px-3"
      >
        Delete
      </button>
    </form>
  );
}
