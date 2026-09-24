"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Status } from "@prisma/client";

interface Collection {
  id: string;
  name: string;
  slug: string;
}

interface MoonCycle {
  id: string;
  name: string;
  phase: string;
}

interface Artwork {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  heroImage: string;
  heroImageAlt: string | null;
  story: string;
  curatorNote: string | null;
  historicalContext: string | null;
  spiritualMeaning: string | null;
  creativeProcess: string | null;
  artistNotes: string | null;
  collectionId: string;
  moonCycleId: string;
  region: string;
  country: string;
  ethnicGroup: string | null;
  era: string | null;
  medium: string | null;
  style: string | null;
  price: number;
  ambientAudio?: string | null;
  status: Status;
}

interface ArtworkEditFormProps {
  artwork: Artwork;
  collections: Collection[];
  moonCycles: MoonCycle[];
}

export default function ArtworkEditForm({ artwork, collections, moonCycles }: ArtworkEditFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [collectionId, setCollectionId] = useState(artwork.collectionId);
  const [moonCycleId, setMoonCycleId] = useState(artwork.moonCycleId);
  const [status, setStatus] = useState<Status>(artwork.status);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("collectionId", collectionId);
      formData.set("moonCycleId", moonCycleId);
      formData.set("status", status);

      const response = await fetch(`/api/admin/artworks/${artwork.id}`, {
        method: "PUT",
        body: formData,
      });

      let errorData: any = {};
      try {
        errorData = await response.json();
      } catch {
        if (response.status === 413) {
          throw new Error("File payload is too large (HTTP 413). Please upload files under 4.5MB.");
        }
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("File payload is too large (HTTP 413). Please upload files under 4.5MB.");
        }
        throw new Error(errorData.error || `Failed to update artwork (HTTP ${response.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/artworks");
        router.refresh();
      }, 1200);
    } catch (err: any) {
      setError(err instanceof Error ? err.message : "Failed to update artwork");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded">
          Artwork updated successfully! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            name="title"
            defaultValue={artwork.title}
            required
            className="artwork-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            defaultValue={artwork.subtitle || ""}
            className="artwork-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={artwork.description || ""}
          rows={3}
          className="artwork-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Story *</Label>
        <Textarea
          id="story"
          name="story"
          defaultValue={artwork.story}
          rows={5}
          required
          className="artwork-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="curatorNote">Curator's Note</Label>
        <Textarea
          id="curatorNote"
          name="curatorNote"
          defaultValue={artwork.curatorNote || ""}
          rows={3}
          className="artwork-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="collection">Collection *</Label>
          <Select value={collectionId} onValueChange={setCollectionId}>
            <SelectTrigger className="artwork-input">
              <SelectValue placeholder="Select collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="moonCycle">Moon Cycle *</Label>
          <Select value={moonCycleId} onValueChange={setMoonCycleId}>
            <SelectTrigger className="artwork-input">
              <SelectValue placeholder="Select moon cycle" />
            </SelectTrigger>
            <SelectContent>
              {moonCycles.map((mc) => (
                <SelectItem key={mc.id} value={mc.id}>
                  {mc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="region">Region *</Label>
          <Input
            id="region"
            name="region"
            defaultValue={artwork.region}
            required
            className="artwork-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            defaultValue={artwork.country}
            required
            className="artwork-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="ethnicGroup">Ethnic Group</Label>
          <Input
            id="ethnicGroup"
            name="ethnicGroup"
            defaultValue={artwork.ethnicGroup || ""}
            className="artwork-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="era">Era</Label>
          <Input
            id="era"
            name="era"
            defaultValue={artwork.era || ""}
            className="artwork-input"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="medium">Medium</Label>
          <Input
            id="medium"
            name="medium"
            defaultValue={artwork.medium || ""}
            className="artwork-input"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="style">Style</Label>
          <Input
            id="style"
            name="style"
            defaultValue={artwork.style || ""}
            className="artwork-input"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="price">Price (USD) *</Label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          defaultValue={artwork.price}
          required
          className="artwork-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(val) => setStatus(val as Status)}>
          <SelectTrigger className="artwork-input">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="SCHEDULED">Scheduled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ambientAudio">Ambient Audio (Upload MP3/WAV)</Label>
        <Input
          id="ambientAudio"
          name="ambientAudio"
          type="file"
          accept="audio/*,.mp3,.wav,.ogg,.m4a"
          className="artwork-input"
        />
        {artwork.ambientAudio && (
          <p className="text-xs text-muted-foreground font-mono">
            Current audio: {artwork.ambientAudio}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="historicalContext">Historical Context</Label>
        <Textarea
          id="historicalContext"
          name="historicalContext"
          defaultValue={artwork.historicalContext || ""}
          rows={3}
          className="artwork-input"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="spiritualMeaning">Spiritual Meaning</Label>
        <Textarea
          id="spiritualMeaning"
          name="spiritualMeaning"
          defaultValue={artwork.spiritualMeaning || ""}
          rows={3}
          className="artwork-input"
        />
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Artwork"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}