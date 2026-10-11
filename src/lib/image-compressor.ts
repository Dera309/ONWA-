/**
 * Client-side image compression utility to prevent HTTP 413 (Payload Too Large)
 * when uploading high-resolution artworks or collection covers to Vercel/Next.js.
 */

export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes = 2.0 * 1024 * 1024, // 2.0 MB (well within Vercel's 4.5MB ceiling)
  maxDimension = 2048
): Promise<File> {
  // If file is already under limit or not an image, return as-is
  if (file.size <= maxSizeBytes || !file.type.startsWith("image/")) {
    return file;
  }

  // Non-compressible image types like SVG
  if (file.type === "image/svg+xml") {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = async () => {
        let currentWidth = img.width;
        let currentHeight = img.height;

        // Initial scale down if dimensions exceed maxDimension
        if (currentWidth > maxDimension || currentHeight > maxDimension) {
          if (currentWidth > currentHeight) {
            currentHeight = Math.round((currentHeight * maxDimension) / currentWidth);
            currentWidth = maxDimension;
          } else {
            currentWidth = Math.round((currentWidth * maxDimension) / currentHeight);
            currentHeight = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Output format: WebP gives superior compression efficiency
        const outputType = "image/webp";
        let quality = 0.85;
        let bestBlob: Blob | null = null;

        // Multi-pass iterative compression (up to 4 passes) to guarantee payload fits within server limits
        for (let pass = 0; pass < 4; pass++) {
          canvas.width = currentWidth;
          canvas.height = currentHeight;
          ctx.clearRect(0, 0, currentWidth, currentHeight);
          ctx.drawImage(img, 0, 0, currentWidth, currentHeight);

          const blob: Blob | null = await new Promise((res) => {
            canvas.toBlob((b) => res(b), outputType, quality);
          });

          if (!blob) break;
          bestBlob = blob;

          // If safely under target size, we are good
          if (blob.size <= maxSizeBytes) {
            break;
          }

          // Otherwise reduce quality and dimensions for next pass
          quality = Math.max(0.55, quality - 0.15);
          currentWidth = Math.round(currentWidth * 0.8);
          currentHeight = Math.round(currentHeight * 0.8);
        }

        if (bestBlob && bestBlob.size < file.size) {
          const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
          const compressedFile = new File([bestBlob], cleanFileName, {
            type: outputType,
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          resolve(file);
        }
      };

      img.onerror = () => {
        resolve(file);
      };
    };

    reader.onerror = () => {
      resolve(file);
    };
  });
}
