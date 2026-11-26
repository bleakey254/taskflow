import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';

export const metadata = {
  title: 'Unlock Analytics - TaskFlow Admin',
  description: 'Task unlock volume and revenue',
};

export default async function UnlockAnalyticsPage() {
  const admin = await requireRole([Role.ADMIN]);

  const [totalUnlocks, revenue, successfulPayments, tasks] = await Promise.all([
    prisma.taskUnlock.count(),
    prisma.payment.aggregate({
      where: { status: 'SUCCEEDED', purpose: 'TASK_UNLOCK' },
      _sum: { amount: true },
    }),
    prisma.payment.count({ where: { status: 'SUCCEEDED', purpose: 'TASK_UNLOCK' } }),
    prisma.task.findMany({
      where: { unlocks: { some: {} } },
      select: {
        id: true,
        title: true,
        budget: true,
        client: { select: { name: true } },
        _count: { select: { unlocks: true } },
      },
      orderBy: { unlocks: { _count: 'desc' } },
      take: 25,
    }),
  ]);

  return (
    <AdminShell userName={admin.name} title="Unlock Analytics" description="How often workers pay to reveal task details">
      <StatGrid columns={3} gap="md">
        <DataCard
          title="Total unlocks"
          value={totalUnlocks}
          icon={<span className="material-symbols-outlined text-[24px]">lock_open</span>}
          iconColor="primary"
        />
        <DataCard
          title="Unlock revenue"
          value={formatMoney(revenue._sum.amount ?? 0)}
          icon={<span className="material-symbols-outlined text-[24px]">payments</span>}
          iconColor="secondary"
          subtitle={`${successfulPayments} successful charges`}
        />
        <DataCard
          title="Tasks with unlocks"
          value={tasks.length}
          icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
          iconColor="tertiary"
        />
      </StatGrid>

      <div className="mt-space-xl">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Most unlocked tasks" />
          <CardContent>
            {tasks.length === 0 ? (
              <EmptyState icon="lock_open" title="No unlocks yet" hint="Unlock a task as a worker to populate this list." />
            ) : (
              <div className="space-y-0">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between gap-space-md p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium truncate">{task.title}</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {task.client.name} · budget {formatMoney(task.budget)}
                      </p>
                    </div>
                    <p className="font-label-lg text-label-lg font-bold text-on-surface whitespace-nowrap">
                      {task._count.unlocks}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminShell>
  );
}
