import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findArtwork() {
  console.log('Searching for artwork with details:');
  console.log('- Title: Ancient Egypt');
  console.log('- Moon Cycle: Waxing Crescent');
  console.log('- Region: West Africa');
  console.log('- Country: Nigeria');
  console.log('- Status: DRAFT');
  console.log('- Price: $20.00');
  console.log();

  try {
    // Search by title
    const byTitle = await prisma.artwork.findFirst({
      where: { title: 'Ancient Egypt' },
      include: {
        collection: true,
        moonCycle: true,
      },
    });

    if (byTitle) {
      console.log('✅ Found artwork by title:');
      console.log(JSON.stringify(byTitle, null, 2));
    } else {
      console.log('❌ No artwork found with title "Ancient Egypt"');
    }

    // Search all artworks for debugging
    console.log('\n--- All artworks in database ---');
    const allArtworks = await prisma.artwork.findMany({
      include: {
        collection: true,
        moonCycle: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    console.log(`Total artworks: ${allArtworks.length}`);
    allArtworks.forEach((artwork, index) => {
      console.log(`\n${index + 1}. ${artwork.title}`);
      console.log(`   ID: ${artwork.id}`);
      console.log(`   Status: ${artwork.status}`);
      console.log(`   Price: $${artwork.price}`);
      console.log(`   Collection: ${artwork.collection?.name || 'N/A'}`);
      console.log(`   Moon Cycle: ${artwork.moonCycle?.name || 'N/A'}`);
      console.log(`   Region: ${artwork.region}, ${artwork.country}`);
      console.log(`   Hero Image: ${artwork.heroImage}`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findArtwork();
