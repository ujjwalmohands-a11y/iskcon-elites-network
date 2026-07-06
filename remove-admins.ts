import 'dotenv/config';
import prisma from './src/lib/prisma';

async function main() {
  const emails = [
    'ujjwal.insights@gmail.com',
    'ibsc.iskconabids@gmail.com'
  ];

  for (const email of emails) {
    const user = await prisma.user.findFirst({ where: { email } });
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`Deleted user: ${email}`);
    } else {
      console.log(`User not found: ${email}`);
    }
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
