import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixCorruptedArtwork() {
  console.log('Fixing corrupted artwork with error message as title...');

  try {
    // Find the corrupted artwork
    const corrupted = await prisma.artwork.findFirst({
      where: {
        title: {
          contains: 'Port 3000 is in use'
        }
      }
    });

    if (corrupted) {
      console.log('Found corrupted artwork:', corrupted.id);
      
      // Update it with a proper title
      const updated = await prisma.artwork.update({
        where: { id: corrupted.id },
        data: {
          title: 'Ancient Egypt Artwork',
          subtitle: 'Digital Art Collection',
        }
      });

      console.log('✅ Fixed artwork:');
      console.log(`   Old title: ${corrupted.title.substring(0, 50)}...`);
      console.log(`   New title: ${updated.title}`);
    } else {
      console.log('❌ No corrupted artwork found');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCorruptedArtwork();
