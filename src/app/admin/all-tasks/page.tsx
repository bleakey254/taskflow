import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'All Tasks - TaskFlow Admin',
  description: 'Every task posted on the platform',
};

const statusVariant: Record<string, 'primary' | 'secondary' | 'tertiary' | 'error' | 'neutral'> = {
  DRAFT: 'neutral',
  SUBMITTED_FOR_APPROVAL: 'tertiary',
  PUBLISHED: 'secondary',
  VIEWED: 'secondary',
  UNLOCKED: 'secondary',
  IN_PROGRESS: 'primary',
  COMPLETED: 'secondary',
  REJECTED: 'error',
  CANCELLED: 'neutral',
  DISPUTED: 'error',
};

export default async function AllTasksPage() {
  const admin = await requireRole([Role.ADMIN]);

  const tasks = await prisma.task.findMany({
    include: {
      client: { select: { name: true, email: true } },
      category: { select: { name: true } },
      _count: { select: { submissions: true, unlocks: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return (
    <AdminShell userName={admin.name} title="All Tasks" description="Every task posted on the platform">
      {tasks.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState icon="task_alt" title="No tasks yet" hint="Tasks appear here as soon as a client saves a draft." />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant="outline" size="sm">{task.category.name}</Badge>
                      <Badge variant={statusVariant[task.status] ?? 'neutral'} size="sm">{task.status}</Badge>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">{task.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {task.client.name} · {task.client.email} · posted {task.createdAt.toLocaleDateString()}
                    </p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                      {task._count.unlocks} unlocked · {task._count.submissions} submissions
                      {task.deadline ? ` · due ${task.deadline.toLocaleDateString()}` : ''}
                    </p>
                  </div>
                  <div className="text-right sm:ml-space-md">
                    <p className="font-currency-stat text-currency-stat text-on-surface font-bold">
                      {formatMoney(task.budget)}
                    </p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant">{task.currency}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
