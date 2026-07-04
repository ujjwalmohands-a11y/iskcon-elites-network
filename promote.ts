import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  for (const user of users) {
    console.log(user.email, user.role);
    await prisma.user.update({
      where: { id: user.id },
      data: { role: 'SUPERADMIN' }
    });
    console.log('Promoted', user.email, 'to SUPERADMIN');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
