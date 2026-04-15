import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin1234', 10);

  await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: {
      email: 'admin@hotel.com',
      password: hashed,
      firstName: 'Admin',
      lastName: 'Hotel',
      role: Role.ADMIN,
    },
  });

  console.log('Admin created: admin@hotel.com / admin1234');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());