import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Admin Setup Script');
  console.log('==================\n');

  // Get Clerk user ID from command line argument
  const clerkId = process.argv[2];

  if (!clerkId) {
    console.error('Error: Clerk user ID is required');
    console.log('Usage: npx tsx scripts/setup-admin.ts <clerk-user-id>');
    console.log('\nTo get your Clerk user ID:');
    console.log('1. Sign in to your application');
    console.log('2. Open browser DevTools (F12)');
    console.log('3. Go to Console and run: await window.Clerk.user?.id');
    console.log('4. Copy the returned ID and use it as the argument');
    process.exit(1);
  }

  console.log(`Setting up admin for Clerk user ID: ${clerkId}`);

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { clerkId },
  });

  if (existingAdmin) {
    console.log('Admin already exists for this user ID');
    console.log('Email:', existingAdmin.email);
    console.log('Role:', existingAdmin.role);
    process.exit(0);
  }

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      clerkId,
      email: 'admin@onwa.art', // Update with actual email
      name: 'Admin User',
      role: 'SUPER_ADMIN',
      permissions: ['all'],
    },
  });

  console.log('\n✅ Admin created successfully!');
  console.log('Clerk ID:', admin.clerkId);
  console.log('Email:', admin.email);
  console.log('Role:', admin.role);
  console.log('\nYou can now access the admin dashboard at /admin/dashboard');
}

main()
  .catch((e) => {
    console.error('Error setting up admin:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
