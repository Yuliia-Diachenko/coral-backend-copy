import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
console.log('Seed script starting...');

async function main() {
  const emails = [
    'zirkanew82@gmail.com',
    'podolyak365@gmail.com',
    'glebkirsenko@gmail.com',
    'kobzar.anatolii.vl@gmail.com',
  ];

  const hashedPassword = await bcrypt.hash('test1234', 10);

  for (const email of emails) {
    console.log(`Creating user: ${email}...`);

    await prisma.user.upsert({
      where: { email },
      update: {}, // не змінюємо, якщо вже є
      create: {
        email,
        password: hashedPassword,
        role: 'ADMIN',
      },
    });

    console.log(`User ${email} created or already exists`);
  }
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seed finished.');
  });
