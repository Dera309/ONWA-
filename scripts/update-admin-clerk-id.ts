import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking for existing admin records...');

  // Check if admin exists by clerkId
  const existingAdmin = await prisma.admin.findFirst({
    where: {
      clerkId: 'user_3H0O4Un3kI9lH2adrPJFENLEe67',
    },
  });

  if (existingAdmin) {
    console.log('Admin already exists with this clerk ID');
    console.log('Admin record:', {
      id: existingAdmin.id,
      email: existingAdmin.email,
      name: existingAdmin.name,
      clerkId: existingAdmin.clerkId,
      role: existingAdmin.role,
    });
    return;
  }

  // Check if admin exists by email
  const adminByEmail = await prisma.admin.findFirst({
    where: {
      email: 'admin@onwa.art',
    },
  });

  if (adminByEmail) {
    console.log('Found existing admin by email, updating clerk ID...');
    await prisma.admin.update({
      where: {
        id: adminByEmail.id,
      },
      data: {
        clerkId: 'user_3H0O4Un3kI9lH2adrPJFENLEe67',
      },
    });
    console.log('Updated admin clerk ID');
  } else {
    console.log('No existing admin found, creating new admin record...');
    // Create admin record
    const admin = await prisma.admin.create({
      data: {
        clerkId: 'user_3H0O4Un3kI9lH2adrPJFENLEe67',
        email: 'admin@onwa.art',
        name: 'Admin User',
        role: 'SUPER_ADMIN',
        permissions: ['all'],
      },
    });

    console.log('Created admin record:', admin.email);
  }

  // Verify the update
  const updatedAdmin = await prisma.admin.findFirst({
    where: {
      clerkId: 'user_3H0O4Un3kI9lH2adrPJFENLEe67',
    },
  });

  console.log('Admin record:', {
    id: updatedAdmin?.id,
    email: updatedAdmin?.email,
    name: updatedAdmin?.name,
    clerkId: updatedAdmin?.clerkId,
    role: updatedAdmin?.role,
  });
}

main()
  .catch((e) => {
    console.error('Error updating admin clerk ID:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
