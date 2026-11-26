import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Categories - TaskFlow Admin',
  description: 'Task categories available to clients',
};

export default async function CategoryConfigPage() {
  const admin = await requireRole([Role.ADMIN]);

  const categories = await prisma.taskCategory.findMany({
    include: { _count: { select: { tasks: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <AdminShell
      userName={admin.name}
      title="Categories"
      description="Categories are seeded with the database, so this list is read-only."
    >
      {categories.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState icon="category" title="No categories" hint="Run the database seed to create the default categories." />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between gap-space-md p-space-md border-b border-outline-variant/50 last:border-0"
              >
                <div className="min-w-0">
                  <p className="font-label-md text-label-md text-on-surface font-bold">{category.name}</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    {category.description ?? 'No description'}
                  </p>
                </div>
                <Badge variant="outline" size="sm">
                  {category._count.tasks} task{category._count.tasks === 1 ? '' : 's'}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
