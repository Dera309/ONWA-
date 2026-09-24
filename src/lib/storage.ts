import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Check if R2 is configured
const isR2Configured = !!(
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ACCOUNT_ID
);

const s3Client = isR2Configured ? new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
}) : null;

const BUCKET_NAME = process.env.R2_BUCKET_NAME || "onwa-artworks";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";
const LOCAL_STORAGE_PATH = process.env.LOCAL_STORAGE_PATH || "./public/uploads";

export async function uploadFile(
  key: string,
  body: Buffer | Uint8Array | Blob | string,
  contentType: string
) {
  if (isR2Configured && s3Client) {
    // Upload to Cloudflare R2
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
    });

    await s3Client.send(command);
    return `${PUBLIC_URL}/${key}`;
  } else {
    // Convert body to Buffer
    let buffer: Buffer;
    if (typeof body === 'string') {
      buffer = Buffer.from(body);
    } else if (body instanceof Buffer) {
      buffer = body;
    } else if (body instanceof Uint8Array) {
      buffer = Buffer.from(body);
    } else if (body instanceof Blob) {
      const arrayBuffer = await body.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = Buffer.from(body as any);
    }

    // Attempt local storage write in non-serverless environments (best-effort, non-blocking)
    if (!process.env.VERCEL) {
      try {
        const { writeFile, mkdir } = await import("fs/promises");
        const { join } = await import("path");
        const { existsSync } = await import("fs");

        const dirPath = join(LOCAL_STORAGE_PATH, key.split('/').slice(0, -1).join('/'));
        if (!existsSync(dirPath)) {
          await mkdir(dirPath, { recursive: true });
        }
        await writeFile(join(LOCAL_STORAGE_PATH, key), buffer);
      } catch (err) {
        // Silently continue - base64 data URL provides 100% durability
      }
    }

    // Return self-contained base64 data URL to ensure 100% persistence across serverless & all environments
    const mime = contentType || "image/jpeg";
    return `data:${mime};base64,${buffer.toString("base64")}`;
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600) {
  if (!key) return "";
  if (key.startsWith("data:") || key.startsWith("http://") || key.startsWith("https://")) {
    return key;
  }

  if (isR2Configured && s3Client) {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } else {
    // For local storage, return the direct URL
    return `/uploads/${key}`;
  }
}

export async function deleteFile(key: string) {
  if (!key || key.startsWith("data:") || key.startsWith("http://") || key.startsWith("https://")) {
    return;
  }

  if (isR2Configured && s3Client) {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
  } else {
    // Delete from local storage
    const { join } = await import("path");
    const filePath = join(LOCAL_STORAGE_PATH, key);
    const fs = await import('fs/promises');
    try {
      await fs.unlink(filePath);
    } catch (error) {
      console.error('Error deleting local file:', error);
    }
  }
}

function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
}

export function generateArtworkKey(artworkId: string, resolution: string, extension: string) {
  return `artworks/${artworkId}/${resolution}.${extension}`;
}

export function generateGalleryKey(artworkId: string, filename: string) {
  return `artworks/${artworkId}/gallery/${sanitizeFilename(filename)}`;
}

export function generateHeroImageKey(artworkId: string, filename: string) {
  return `artworks/${artworkId}/hero/${sanitizeFilename(filename)}`;
}

export function generateCollectionCoverKey(collectionId: string, filename: string) {
  return `collections/${collectionId}/cover/${sanitizeFilename(filename)}`;
}

