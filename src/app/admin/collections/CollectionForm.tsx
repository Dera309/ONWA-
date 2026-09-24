"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { compressImageIfNeeded } from "@/lib/image-compressor";
import { Status } from "@prisma/client";
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

interface MoonCycle {
  id: string;
  name: string;
  phase: string;
}

interface Collection {
  id?: string;
  name: string;
  description: string;
  moonCycleId: string;
  curatorNote?: string | null;
  region?: string | null;
  country?: string | null;
  era?: string | null;
  status?: Status;
  featured?: boolean;
  coverImage?: string | null;
  coverImageAlt?: string | null;
}

interface CollectionFormProps {
  collection?: Collection;
  moonCycles: MoonCycle[];
  isEditing?: boolean;
}

export default function CollectionForm({
  collection,
  moonCycles,
  isEditing = false,
}: CollectionFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState(collection?.name || "");
  const [description, setDescription] = useState(collection?.description || "");
  const [moonCycleId, setMoonCycleId] = useState(
    collection?.moonCycleId || (moonCycles[0]?.id ?? "")
  );
  const [region, setRegion] = useState(collection?.region || "");
  const [country, setCountry] = useState(collection?.country || "");
  const [era, setEra] = useState(collection?.era || "");
  const [curatorNote, setCuratorNote] = useState(collection?.curatorNote || "");
  const [status, setStatus] = useState<Status>(collection?.status || Status.PUBLISHED);
  const [featured, setFeatured] = useState<boolean>(collection?.featured || false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageAlt, setCoverImageAlt] = useState(collection?.coverImageAlt || "");
  const [imagePreview, setImagePreview] = useState<string | null>(
    collection?.coverImage || null
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!name.trim()) throw new Error("Collection Name is required.");
      if (!description.trim()) throw new Error("Description is required.");
      if (!moonCycleId) throw new Error("Moon Cycle is required.");

      const formData = new FormData();
      formData.set("name", name.trim());
      formData.set("description", description.trim());
      formData.set("moonCycleId", moonCycleId);
      formData.set("region", region.trim());
      formData.set("country", country.trim());
      formData.set("era", era.trim());
      formData.set("curatorNote", curatorNote.trim());
      formData.set("status", status);
      formData.set("featured", featured ? "true" : "false");
      formData.set("coverImageAlt", coverImageAlt.trim());

      if (coverImageFile) {
        const fileToUpload = await compressImageIfNeeded(coverImageFile);
        formData.set("coverImage", fileToUpload);
      } else if (collection?.coverImage) {
        formData.set("coverImageUrl", collection.coverImage);
      } else {
        formData.set(
          "coverImageUrl",
          "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800"
        );
      }

      const endpoint = isEditing && collection?.id
        ? `/api/admin/collections/${collection.id}`
        : "/api/admin/collections";

      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(endpoint, {
        method,
        body: formData,
      });

      let data: any = {};
      try {
        data = await response.json();
      } catch {
        if (response.status === 413) {
          throw new Error("File payload is too large (HTTP 413). Please upload an image under 4.5MB.");
        }
        throw new Error(`Server returned HTTP ${response.status}`);
      }

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error("File payload is too large (HTTP 413). Please upload an image under 4.5MB.");
        }
        throw new Error(data.error || `Failed to save collection (HTTP ${response.status})`);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/collections");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
      <div className="flex items-center justify-between pb-4 border-b border-border/20">
        <Link
          href="/admin/collections"
          className="inline-flex items-center gap-1.5 text-xs label-caps text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collections
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-md">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-md">
          {isEditing ? "Collection updated successfully!" : "Collection created successfully!"} Redirecting...
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="museum-heading text-headline-md text-primary">General Information</h2>

        <div>
          <Label htmlFor="name" className="text-xs label-caps">
            Collection Name *
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Kingdom of Benin"
            required
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-xs label-caps">
            Description *
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Artworks celebrating the bronze casting mastery and royal heritage of the Benin Empire..."
            rows={4}
            required
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Curation & Moon Cycle */}
      <div className="space-y-4 pt-4 border-t border-border/10">
        <h2 className="museum-heading text-headline-md text-primary">Curation & Theme</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="moonCycleId" className="text-xs label-caps">
              Associated Moon Cycle *
            </Label>
            <Select value={moonCycleId} onValueChange={setMoonCycleId} required>
              <SelectTrigger className="mt-1.5">
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
            <Label htmlFor="status" className="text-xs label-caps">
              Publishing Status
            </Label>
            <Select value={status} onValueChange={(val) => setStatus(val as Status)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="curatorNote" className="text-xs label-caps">
            Curator's Note (Optional)
          </Label>
          <Textarea
            id="curatorNote"
            value={curatorNote}
            onChange={(e) => setCuratorNote(e.target.value)}
            placeholder="Insight into why this collection was assembled and its historical context..."
            rows={3}
            className="mt-1.5"
          />
        </div>
      </div>

      {/* Regional Metadata */}
      <div className="space-y-4 pt-4 border-t border-border/10">
        <h2 className="museum-heading text-headline-md text-primary">Geography & Era</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="region" className="text-xs label-caps">
              Region
            </Label>
            <Input
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              placeholder="e.g. West Africa"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="country" className="text-xs label-caps">
              Country
            </Label>
            <Input
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. Nigeria"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="era" className="text-xs label-caps">
              Historical Era
            </Label>
            <Input
              id="era"
              value={era}
              onChange={(e) => setEra(e.target.value)}
              placeholder="e.g. 13th Century"
              className="mt-1.5"
            />
          </div>
        </div>
      </div>

      {/* Cover Media */}
      <div className="space-y-4 pt-4 border-t border-border/10">
        <h2 className="museum-heading text-headline-md text-primary">Cover Image</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="space-y-4">
            <div>
              <Label htmlFor="coverImage" className="text-xs label-caps">
                Upload Cover Photo
              </Label>
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5 cursor-pointer"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Upload a cover artwork or leave blank to use a default placeholder.
              </p>
            </div>

            <div>
              <Label htmlFor="coverImageAlt" className="text-xs label-caps">
                Cover Image Alt Text
              </Label>
              <Input
                id="coverImageAlt"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                placeholder="Visual description of the cover image"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
              />
              <Label htmlFor="featured" className="text-xs label-caps cursor-pointer">
                Feature on Museum Homepage
              </Label>
            </div>
          </div>

          {/* Preview Box */}
          <div className="border border-border/30 rounded-lg p-3 bg-surface-container-lowest flex flex-col items-center justify-center min-h-[180px]">
            {imagePreview ? (
              <div className="relative w-full aspect-video rounded overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Cover Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="text-center text-muted-foreground space-y-2 p-6">
                <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
                <p className="text-xs">No cover image selected</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Submission */}
      <div className="flex gap-4 pt-6 border-t border-border/20">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 label-caps text-xs sm:text-sm h-11"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              <span>Saving Collection...</span>
            </>
          ) : (
            <span>{isEditing ? "Update Collection" : "Create Collection"}</span>
          )}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="px-6 label-caps text-xs h-11"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
