"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0c] text-white min-h-screen flex items-center justify-center px-4 font-sans antialiased">
        <div className="text-center max-w-md">
          <h1 className="text-5xl font-serif font-bold mb-4 text-[#C5A880]">500</h1>
          <h2 className="text-xl font-serif mb-2 text-white">System Error</h2>
          <p className="text-sm text-neutral-400 mb-8">
            An unexpected error occurred in the ONWA Museum application.
          </p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => reset()} variant="default" className="text-xs uppercase tracking-wider">
              Try again
            </Button>
            <Button variant="secondary" className="text-xs uppercase tracking-wider" asChild>
              <Link href="/">Return home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
