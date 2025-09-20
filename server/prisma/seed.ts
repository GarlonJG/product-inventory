import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Create admin user
  await prisma.user.upsert({
    where: { email: 'admin@myinventory.com' },
    update: {},
    create: {
      email: 'admin@myinventory.com',
      firstName: 'Link',
      lastName: 'Lightfoot',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  // Create regular user
  await prisma.user.upsert({
    where: { email: 'user@myinventory.com' },
    update: {},
    create: {
      email: 'user@myinventory.com',
      firstName: 'Regular',
      lastName: 'NPC',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Test users have been seeded successfully');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
