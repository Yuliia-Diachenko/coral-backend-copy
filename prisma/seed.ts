import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

console.log('Start seed');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);

  await prisma.user.createMany({
    data: [
      {
        email: 'admin@example.com',
        password,
        role: 'ADMIN',
        firstName: 'Alice',
        lastName: 'Admin',
      },
      {
        email: 'provider@example.com',
        password,
        role: 'PROVIDER',
        firstName: 'Bob',
        lastName: 'Provider',
      },
      {
        email: 'patient@example.com',
        password,
        role: 'PATIENT',
        firstName: 'Charlie',
        lastName: 'Patient',
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
