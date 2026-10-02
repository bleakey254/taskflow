// Prisma client instance
import { PrismaClient } from '@prisma/client';

const prismaGlobal = global as any;
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!prismaGlobal.prisma) {
    prismaGlobal.prisma = new PrismaClient();
  }
  prisma = prismaGlobal.prisma;
}

export { prisma };