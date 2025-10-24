import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const res = await prisma.$queryRaw`SELECT 1 as ok`;
    console.log('DB query result:', res);
  } catch (err) {
    console.error('DB test failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
