import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
console.log('Seed script starting...');
async function main() {
  console.log('Creating user...');

  const hashedPassword = await bcrypt.hash('test1234', 10);

  await prisma.user.create({
    data: {
      email: 'zirkanew82@gmail.com',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('User created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
