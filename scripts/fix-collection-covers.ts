import { prisma } from '../src/lib/prisma';
import fs from 'fs';
import path from 'path';

async function fixCollectionCovers() {
  console.log('--- Updating Collection Cover Images ---');

  const covers: Record<string, { url: string; alt: string }> = {
    'ancient-egypt': {
      url: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
      alt: 'Ancient Egypt Collection Cover',
    },
    'yoruba-kingdom': {
      url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      alt: 'Yoruba Kingdom Collection Cover',
    },
    'mali-empire': {
      url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
      alt: 'Mali Empire Collection Cover',
    },
  };

  for (const [slug, data] of Object.entries(covers)) {
    const col = await prisma.collection.findUnique({
      where: { slug },
    });

    if (col) {
      await prisma.collection.update({
        where: { id: col.id },
        data: {
          coverImage: data.url,
          coverImageAlt: data.alt,
        },
      });
      console.log(`✅ Updated ${col.name} (${slug}) -> ${data.url}`);
    }
  }

  // Also download the images into public/ as static fallback files
  const publicDir = path.join(process.cwd(), 'public');
  const staticFiles: Record<string, string> = {
    'egypt-cover.jpg': 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
    'yoruba-cover.jpg': 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
    'mali-cover.jpg': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
  };

  for (const [filename, url] of Object.entries(staticFiles)) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(path.join(publicDir, filename), buffer);
        console.log(`✅ Created static file: public/${filename}`);
      }
    } catch (e) {
      console.warn(`Could not download static file for ${filename}:`, e);
    }
  }

  console.log('Done!');
}

fixCollectionCovers()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
