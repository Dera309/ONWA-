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
    // Fallback to local storage
    const { writeFile, mkdir } = await import("fs/promises");
    const { join } = await import("path");
    const { existsSync } = await import("fs");
    
    if (!existsSync(LOCAL_STORAGE_PATH)) {
      await mkdir(LOCAL_STORAGE_PATH, { recursive: true });
    }
    
    const filePath = join(LOCAL_STORAGE_PATH, key);
    const dirPath = join(LOCAL_STORAGE_PATH, key.split('/').slice(0, -1).join('/'));
    
    if (!existsSync(dirPath)) {
      await mkdir(dirPath, { recursive: true });
    }

    if (typeof body === 'string') {
      await writeFile(filePath, body);
    } else if (body instanceof Buffer || body instanceof Uint8Array) {
      await writeFile(filePath, Buffer.from(body));
    } else if (body instanceof Blob) {
      const arrayBuffer = await body.arrayBuffer();
      await writeFile(filePath, Buffer.from(arrayBuffer));
    }

    return `/uploads/${key}`;
  }
}

export async function getSignedDownloadUrl(key: string, expiresIn = 3600) {
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

