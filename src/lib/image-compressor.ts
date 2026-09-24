/**
 * Client-side image compression utility to prevent HTTP 413 (Payload Too Large)
 * when uploading high-resolution artworks or collection covers to Vercel/Next.js.
 */

export async function compressImageIfNeeded(
  file: File,
  maxSizeBytes = 3.5 * 1024 * 1024, // 3.5 MB (stays comfortably within Vercel's 4.5MB ceiling)
  maxDimension = 2560
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

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down if dimensions exceed maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return resolve(file);
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);

        // Determine best output format
        const outputType = file.type === "image/png" ? "image/webp" : file.type;
        const quality = 0.88;

        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't reduce size, fallback to original
              return resolve(file);
            }

            const cleanFileName = file.name.replace(/\.[^/.]+$/, "") + (outputType === "image/webp" ? ".webp" : ".jpg");
            const compressedFile = new File([blob], cleanFileName, {
              type: outputType,
              lastModified: Date.now(),
            });

            resolve(compressedFile);
          },
          outputType,
          quality
        );
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
