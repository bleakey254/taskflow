import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const SEED_PASSWORD = 'Password123!';
const WORKER_EMAIL = 'worker@taskflow.dev';
const CLIENT_EMAIL = 'client@taskflow.dev';
const ADMIN_EMAIL = 'admin@taskflow.dev';

async function main() {
  console.log('Starting database seed...');

  // Create initial task categories
  const categories = [
    { name: 'Design', description: 'Graphic design, UI/UX, logo creation, branding' },
    { name: 'Development', description: 'Web development, mobile apps, software engineering' },
    { name: 'Writing & Translation', description: 'Content writing, copywriting, translation, editing' },
    { name: 'Marketing & Social Media', description: 'Digital marketing, social media management, SEO' },
    { name: 'Data Entry & Analysis', description: 'Data processing, spreadsheet work, research, analytics' },
    { name: 'Video & Animation', description: 'Video editing, animation, motion graphics, video production' },
    { name: 'Music & Audio', description: 'Music production, audio editing, voice over, sound design' },
    { name: 'Business & Consulting', description: 'Business planning, consulting, financial analysis, administrative support' },
  ];

  for (const categoryData of categories) {
    // Check if category already exists
    const existingCategory = await prisma.taskCategory.findUnique({
      where: { name: categoryData.name },
    });

    if (!existingCategory) {
      await prisma.taskCategory.create({
        data: categoryData,
      });
      console.log(`Created category: ${categoryData.name}`);
    } else {
      console.log(`Category already exists: ${categoryData.name}`);
    }
  }

  // Demo accounts (idempotent: re-running resets their password)
  const passwordHash = await bcrypt.hash(SEED_PASSWORD, 12);

  const worker = await prisma.user.upsert({
    where: { email: WORKER_EMAIL },
    update: { name: 'Sam Worker', password: passwordHash, role: Role.WORKER, status: 'ACTIVE' },
    create: { email: WORKER_EMAIL, name: 'Sam Worker', password: passwordHash, role: Role.WORKER, status: 'ACTIVE' },
  });

  await prisma.workerProfile.upsert({
    where: { userId: worker.id },
    update: {},
    create: { userId: worker.id },
  });

  await prisma.wallet.upsert({
    where: { workerId: worker.id },
    update: {},
    create: { workerId: worker.id },
  });

  const client = await prisma.user.upsert({
    where: { email: CLIENT_EMAIL },
    update: { name: 'Chris Client', password: passwordHash, role: Role.CLIENT, status: 'ACTIVE' },
    create: { email: CLIENT_EMAIL, name: 'Chris Client', password: passwordHash, role: Role.CLIENT, status: 'ACTIVE' },
  });

  await prisma.clientProfile.upsert({
    where: { userId: client.id },
    update: {},
    create: { userId: client.id },
  });

  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { name: 'Ada Admin', password: passwordHash, role: Role.ADMIN, status: 'ACTIVE' },
    create: { email: ADMIN_EMAIL, name: 'Ada Admin', password: passwordHash, role: Role.ADMIN, status: 'ACTIVE' },
  });

  console.log('\nDemo accounts ready (password: ' + SEED_PASSWORD + ')');
  console.log(`  Worker: ${WORKER_EMAIL}`);
  console.log(`  Client: ${CLIENT_EMAIL}`);
  console.log(`  Admin:  ${ADMIN_EMAIL} (${admin.role})`);

  console.log('Database seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
