"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="museum-heading text-4xl font-bold mb-4 text-primary">500</h1>
        <h2 className="museum-heading text-xl mb-2 text-foreground">Something went wrong</h2>
        <p className="museum-body text-sm text-muted-foreground mb-8">
          An unexpected error occurred while loading this exhibition.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => reset()} variant="default" className="label-caps text-xs">
            Try again
          </Button>
          <Button variant="secondary" className="label-caps text-xs" asChild>
            <Link href="/">Return home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
