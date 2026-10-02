import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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