import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test connection by querying a simple count
    const count = await prisma.artwork.count();
    console.log('✅ Database connection successful!');
    console.log(`Found ${count} artworks in database`);
    
    // Test collections
    const collectionCount = await prisma.collection.count();
    console.log(`Found ${collectionCount} collections in database`);
    
    // Test admin
    const adminCount = await prisma.admin.count();
    console.log(`Found ${adminCount} admin users in database`);
    
  } catch (error) {
    console.error('❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
