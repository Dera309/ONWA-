"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface ArtworkUploadFormProps {
  collections: Collection[];
  moonCycles: MoonCycle[];
}

export default function ArtworkUploadForm({ collections, moonCycles }: ArtworkUploadFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null);
  const [collectionId, setCollectionId] = useState<string>("");
  const [moonCycleId, setMoonCycleId] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      formData.set("collectionId", collectionId);
      formData.set("moonCycleId", moonCycleId);
      
      // For now, we'll use a placeholder URL if no file is uploaded
      // In production, you'd upload to R2/S3 and get the URL
      if (heroImageFile) {
        formData.append("heroImage", heroImageFile);
      } else {
        formData.append("heroImageUrl", "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800");
      }

      const response = await fetch("/api/admin/artworks", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload artwork");
      }

      router.push("/admin/artworks");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded">
          {error}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">Basic Information</h2>
        
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input id="title" name="title" required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="subtitle">Subtitle</Label>
          <Input id="subtitle" name="subtitle" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" name="description" rows={3} className="mt-1" />
        </div>
      </div>

      {/* Media */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">Media</h2>
        
        <div>
          <Label htmlFor="heroImage">Hero Image</Label>
          <Input 
            id="heroImage" 
            name="heroImage" 
            type="file" 
            accept="image/*"
            onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
            className="mt-1" 
          />
          <p className="text-sm text-muted-foreground mt-1">
            Upload an image or leave empty to use a placeholder
          </p>
        </div>

        <div>
          <Label htmlFor="heroImageAlt">Image Alt Text</Label>
          <Input id="heroImageAlt" name="heroImageAlt" className="mt-1" />
        </div>

        <div>
          <Label htmlFor="ambientAudio">Ambient Audio (Soundscape)</Label>
          <Input 
            id="ambientAudio" 
            name="ambientAudio" 
            type="file" 
            accept="audio/*,.mp3,.wav,.ogg,.m4a"
            className="mt-1" 
          />
          <p className="text-sm text-muted-foreground mt-1">
            Upload an MP3/WAV ambient soundscape for this artwork (optional)
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">Content</h2>
        
        <div>
          <Label htmlFor="story">Story *</Label>
          <Textarea id="story" name="story" rows={5} required className="mt-1" />
        </div>

        <div>
          <Label htmlFor="curatorNote">Curator Note</Label>
          <Textarea id="curatorNote" name="curatorNote" rows={3} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="historicalContext">Historical Context</Label>
          <Textarea id="historicalContext" name="historicalContext" rows={3} className="mt-1" />
        </div>

        <div>
          <Label htmlFor="spiritualMeaning">Spiritual Meaning</Label>
          <Textarea id="spiritualMeaning" name="spiritualMeaning" rows={3} className="mt-1" />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">Classification</h2>
        
        <div>
          <Label htmlFor="collectionId">Collection *</Label>
          <Select value={collectionId} onValueChange={setCollectionId} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a collection" />
            </SelectTrigger>
            <SelectContent>
              {collections.map((collection) => (
                <SelectItem key={collection.id} value={collection.id}>
                  {collection.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="moonCycleId">Moon Cycle *</Label>
          <Select value={moonCycleId} onValueChange={setMoonCycleId} required>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select a moon cycle" />
            </SelectTrigger>
            <SelectContent>
              {moonCycles.map((cycle) => (
                <SelectItem key={cycle.id} value={cycle.id}>
                  {cycle.name} ({cycle.phase})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="region">Region *</Label>
          <Input id="region" name="region" required className="mt-1" placeholder="e.g., West Africa" />
        </div>

        <div>
          <Label htmlFor="country">Country *</Label>
          <Input id="country" name="country" required className="mt-1" placeholder="e.g., Nigeria" />
        </div>

        <div>
          <Label htmlFor="ethnicGroup">Ethnic Group</Label>
          <Input id="ethnicGroup" name="ethnicGroup" className="mt-1" placeholder="e.g., Yoruba" />
        </div>

        <div>
          <Label htmlFor="era">Era</Label>
          <Input id="era" name="era" className="mt-1" placeholder="e.g., Ancient" />
        </div>

        <div>
          <Label htmlFor="medium">Medium</Label>
          <Input id="medium" name="medium" className="mt-1" placeholder="e.g., Digital" />
        </div>

        <div>
          <Label htmlFor="style">Style</Label>
          <Input id="style" name="style" className="mt-1" placeholder="e.g., Abstract" />
        </div>
      </div>

      {/* Commerce */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">Commerce</h2>
        
        <div>
          <Label htmlFor="price">Price (USD) *</Label>
          <Input id="price" name="price" type="number" step="0.01" required className="mt-1" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? "Uploading..." : "Upload Artwork"}
        </Button>
        <Button 
          type="button" 
          variant="secondary" 
          onClick={() => router.back()}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
