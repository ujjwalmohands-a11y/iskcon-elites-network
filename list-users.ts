import 'dotenv/config';
import prisma from './src/lib/prisma';

async function main() {
  const users = await prisma.user.findMany();
  console.log('Total users:', users.length);
  for (const u of users) {
    console.log(u.email, u.role, u.username);
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
