// Prisma client instance
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaGlobal = global as unknown as { prisma?: PrismaClient };
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

// Interactive transactions here span several statements (wallet moves, ledger
// rows, notifications). Prisma's 5s default can lapse on a cold start, which
// surfaced as a 500 from the provider webhook, so they share one bound.
export const INTERACTIVE_TRANSACTION_OPTIONS = { timeout: 15000 };

export { prisma };