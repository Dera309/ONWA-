import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Delete existing data to avoid conflicts
  console.log('Clearing existing data...');
  await prisma.artwork.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.moonCycle.deleteMany({});
  await prisma.admin.deleteMany({});
  console.log('Cleared existing data');

  // Create Admin user (replace with your actual Clerk user ID)
  console.log('Creating admin user...');
  const admin = await prisma.admin.create({
    data: {
      clerkId: 'user_placeholder', // Replace with actual Clerk user ID
      email: 'admin@onwa.art',
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      permissions: ['all'],
    },
  });
  console.log('Created admin user:', admin.email);

  // Create Moon Cycles
  const newMoon = await prisma.moonCycle.create({
    data: {
      name: 'New Moon',
      phase: 'NEW_MOON',
      description: 'Beginnings and creation stories',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-07'),
      isActive: false,
    },
  });

  const waxingCrescent = await prisma.moonCycle.create({
    data: {
      name: 'Waxing Crescent',
      phase: 'WAXING_CRESCENT',
      description: 'Growth and transformation',
      startDate: new Date('2024-01-08'),
      endDate: new Date('2024-01-14'),
      isActive: false,
    },
  });

  const fullMoon = await prisma.moonCycle.create({
    data: {
      name: 'Full Moon',
      phase: 'FULL_MOON',
      description: 'Illumination and revelation',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-01-21'),
      isActive: true,
    },
  });

  const waningCrescent = await prisma.moonCycle.create({
    data: {
      name: 'Waning Crescent',
      phase: 'WANING_CRESCENT',
      description: 'Reflection and wisdom',
      startDate: new Date('2024-01-22'),
      endDate: new Date('2024-01-28'),
      isActive: false,
    },
  });

  console.log('Created moon cycles');

  // Create Collections
  const yorubaCollection = await prisma.collection.create({
    data: {
      slug: 'yoruba-kingdom',
      name: 'Yoruba Kingdom',
      description: 'Artworks celebrating the rich heritage of the Yoruba people',
      coverImage: 'yoruba-cover.jpg',
      moonCycleId: fullMoon.id,
      status: Status.PUBLISHED,
      featured: true,
      artworkCount: 0,
      viewCount: 0,
    },
  });

  const egyptCollection = await prisma.collection.create({
    data: {
      slug: 'ancient-egypt',
      name: 'Ancient Egypt',
      description: 'Artworks inspired by the civilization of the Nile',
      coverImage: 'egypt-cover.jpg',
      moonCycleId: fullMoon.id,
      status: Status.PUBLISHED,
      featured: true,
      artworkCount: 0,
      viewCount: 0,
    },
  });

  const maliCollection = await prisma.collection.create({
    data: {
      slug: 'mali-empire',
      name: 'Mali Empire',
      description: 'Celebrating the golden age of West Africa',
      coverImage: 'mali-cover.jpg',
      moonCycleId: waxingCrescent.id,
      status: Status.PUBLISHED,
      featured: false,
      artworkCount: 0,
      viewCount: 0,
    },
  });

  console.log('Created collections');

  // Create Artworks
  const artworks = [
    {
      slug: 'the-moon-queen',
      title: 'The Moon Queen',
      description: 'This artwork explores Yoruba spirituality and lunar symbolism, representing the divine feminine energy that governs the night sky.',
      heroImage: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800',
      gallery: [{ key: 'moon-queen-1.jpg', alt: 'The Moon Queen', width: 800, height: 1000 }],
      story: 'In the depths of the night sky, where stars whisper ancient secrets...',
      region: 'West Africa',
      country: 'Nigeria',
      price: 500,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: yorubaCollection.id,
      moonCycleId: fullMoon.id,
      publishedAt: new Date(),
      featured: true,
    },
    {
      slug: 'oba-of-benin',
      title: 'Oba of Benin',
      description: 'A tribute to the ancient kings of the Benin Empire, known for their sophisticated bronze casting and artistic mastery.',
      heroImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
      gallery: [{ key: 'oba-benin-1.jpg', alt: 'Oba of Benin', width: 800, height: 1000 }],
      story: 'The bronze heads of Benin tell stories of kings and queens...',
      region: 'West Africa',
      country: 'Nigeria',
      price: 750,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: yorubaCollection.id,
      moonCycleId: fullMoon.id,
      publishedAt: new Date(),
      featured: true,
    },
    {
      slug: 'nubian-queen',
      title: 'Nubian Queen',
      description: 'Celebrating the powerful queens of ancient Nubia, who ruled with wisdom and strength along the Nile.',
      heroImage: 'https://images.unsplash.com/photo-1596464716127-f9a08b928d42?w=800',
      gallery: [{ key: 'nubian-queen-1.jpg', alt: 'Nubian Queen', width: 800, height: 1000 }],
      story: 'Along the banks of the Nile, queens rose to power...',
      region: 'North Africa',
      country: 'Egypt',
      price: 600,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: egyptCollection.id,
      moonCycleId: fullMoon.id,
      publishedAt: new Date(),
      featured: true,
    },
    {
      slug: 'sundiata-keita',
      title: 'Sundiata Keita',
      description: 'The Lion King who founded the Mali Empire, embodying courage, leadership, and the spirit of West African royalty.',
      heroImage: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
      gallery: [{ key: 'sundiata-1.jpg', alt: 'Sundiata Keita', width: 800, height: 1000 }],
      story: 'The epic of Sundiata echoes through the ages...',
      region: 'West Africa',
      country: 'Mali',
      price: 550,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: maliCollection.id,
      moonCycleId: waxingCrescent.id,
      publishedAt: new Date(),
      featured: false,
    },
    {
      slug: 'great-zimbabwe',
      title: 'Great Zimbabwe',
      description: 'The magnificent stone structures of Great Zimbabwe, testament to the architectural genius of the Shona people.',
      heroImage: 'https://images.unsplash.com/photo-1528642474493-1e0b7533b6a4?w=800',
      gallery: [{ key: 'zimbabwe-1.jpg', alt: 'Great Zimbabwe', width: 800, height: 1000 }],
      story: 'Stone walls rise from the earth, built by hands long gone...',
      region: 'Southern Africa',
      country: 'Zimbabwe',
      price: 650,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: maliCollection.id,
      moonCycleId: waxingCrescent.id,
      publishedAt: new Date(),
      featured: false,
    },
    {
      slug: 'queen-sheba',
      title: 'Queen of Sheba',
      description: 'The legendary ruler whose wisdom and beauty captured the imagination of ancient civilizations.',
      heroImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
      gallery: [{ key: 'sheba-1.jpg', alt: 'Queen of Sheba', width: 800, height: 1000 }],
      story: 'From the highlands of Ethiopia came a queen of legend...',
      region: 'East Africa',
      country: 'Ethiopia',
      price: 700,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: maliCollection.id,
      moonCycleId: newMoon.id,
      publishedAt: new Date(),
      featured: false,
    },
    {
      slug: 'kente-weaver',
      title: 'Kente Weaver',
      description: 'The intricate art of Kente weaving, where every pattern tells a story of Ashanti heritage and identity.',
      heroImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800',
      gallery: [{ key: 'kente-1.jpg', alt: 'Kente Weaver', width: 800, height: 1000 }],
      story: 'Threads of gold and silk weave tales of ancestry...',
      region: 'West Africa',
      country: 'Ghana',
      price: 450,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: yorubaCollection.id,
      moonCycleId: waningCrescent.id,
      publishedAt: new Date(),
      featured: false,
    },
    {
      slug: 'pyramid-builder',
      title: 'Pyramid Builder',
      description: 'Honoring the architects and laborers who built the pyramids, monuments that have stood for millennia.',
      heroImage: 'https://images.unsplash.com/photo-1503177119275-0aa32b3a9368?w=800',
      gallery: [{ key: 'pyramid-1.jpg', alt: 'Pyramid Builder', width: 800, height: 1000 }],
      story: 'Under the desert sun, monuments to eternity rise...',
      region: 'North Africa',
      country: 'Egypt',
      price: 800,
      availableResolutions: [{ width: 1920, height: 2400, dpi: 300, priceMultiplier: 1 }],
      status: Status.PUBLISHED,
      collectionId: egyptCollection.id,
      moonCycleId: fullMoon.id,
      publishedAt: new Date(),
      featured: true,
    },
  ];

  for (const artwork of artworks) {
    await prisma.artwork.create({ data: artwork });
  }

  console.log('Created artworks');

  // Update collection artwork counts
  await prisma.collection.update({
    where: { id: yorubaCollection.id },
    data: { artworkCount: 3 },
  });

  await prisma.collection.update({
    where: { id: egyptCollection.id },
    data: { artworkCount: 2 },
  });

  await prisma.collection.update({
    where: { id: maliCollection.id },
    data: { artworkCount: 3 },
  });

  console.log('Updated collection artwork counts');
  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
