import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.user.updateMany({
    data: { role: 'SUPERADMIN' }
  });
  console.log(`Successfully promoted ${result.count} user(s) to SUPERADMIN!`);
  process.exit(0);
}
main().catch(console.error);
