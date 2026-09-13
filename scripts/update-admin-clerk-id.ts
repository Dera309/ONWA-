import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = 'chideraobia7@gmail.com';
  const name = 'chidera';

  console.log(`Configuring primary admin for ${email} (${name})...`);

  // Find all existing admins
  const admins = await prisma.admin.findMany();
  console.log(`Found ${admins.length} admin record(s) in DB.`);

  let targetAdmin = admins.find(
    (a) => a.email.toLowerCase() === email.toLowerCase()
  );

  if (targetAdmin) {
    targetAdmin = await prisma.admin.update({
      where: { id: targetAdmin.id },
      data: {
        email,
        name,
        role: 'SUPER_ADMIN',
        permissions: ['all'],
      },
    });
    console.log('✅ Updated admin record:', targetAdmin);
  } else if (admins.length > 0) {
    // Update the first admin record to be chideraobia7@gmail.com
    targetAdmin = await prisma.admin.update({
      where: { id: admins[0].id },
      data: {
        email,
        name,
        role: 'SUPER_ADMIN',
        permissions: ['all'],
      },
    });
    console.log('✅ Replaced previous admin with primary admin:', targetAdmin);
  } else {
    // Create new
    targetAdmin = await prisma.admin.create({
      data: {
        clerkId: 'admin_chidera',
        email,
        name,
        role: 'SUPER_ADMIN',
        permissions: ['all'],
      },
    });
    console.log('✅ Created primary admin record:', targetAdmin);
  }

  const finalAdmins = await prisma.admin.findMany();
  console.log('Current Admin(s) in Database:', finalAdmins);
}

main()
  .catch((e) => {
    console.error('Error updating admin clerk ID:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
