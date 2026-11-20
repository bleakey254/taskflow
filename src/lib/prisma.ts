// Prisma client instance
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaGlobal = global as any;
let prisma: PrismaClient;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  if (!prismaGlobal.prisma) {
    prismaGlobal.prisma = new PrismaClient({ adapter });
  }
  prisma = prismaGlobal.prisma;
}

export { prisma };