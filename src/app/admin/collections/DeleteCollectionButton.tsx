"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteCollectionButton({
  collectionId,
  collectionName,
}: {
  collectionId: string;
  collectionName: string;
}) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Are you sure you want to delete the collection "${collectionName}"? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/collections/${collectionId}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete collection");
      }

      router.refresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete collection");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center justify-center gap-1.5 rounded-md text-xs font-medium transition-colors bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 px-3 border border-destructive/20 cursor-pointer disabled:opacity-50"
      title={`Delete ${collectionName}`}
    >
      {isDeleting ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Deleting...</span>
        </>
      ) : (
        <>
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </>
      )}
    </button>
  );
}
