import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, UNLOCK_FEE } from '@/lib/constants';
import { Role, TaskStatus } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card } from '@/components/layout';
import { Badge } from '@/components/layout';
import { LinkButton } from '@/components/layout/LinkButton';
import Link from 'next/link';

export const metadata = {
  title: 'Available Tasks - TaskFlow',
  description: 'Browse and complete micro-tasks',
};

export default async function WorkerTasksPage() {
  const user = await requireRole([Role.WORKER]);

  const [available, unlocked] = await Promise.all([
    prisma.task.findMany({
      where: { status: { in: [TaskStatus.PUBLISHED, TaskStatus.VIEWED] } },
      include: {
        category: { select: { name: true } },
        client: { select: { name: true } },
        _count: { select: { unlocks: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.taskUnlock.findMany({
      where: {
        workerId: user.id,
        status: { in: [TaskStatus.UNLOCKED, TaskStatus.IN_PROGRESS] },
      },
      include: {
        task: {
          include: { category: { select: { name: true } } },
        },
      },
      orderBy: { unlockedAt: 'desc' },
    }),
  ]);

  const wallet = await prisma.wallet.findUnique({ where: { workerId: user.id } });
  const balance = wallet ? formatMoney(wallet.balance) : undefined;

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={balance} />
        </>
      }
      title="Available Tasks"
      description="Browse tasks available for completion"
    >
      {unlocked.length > 0 && (
        <section className="mb-space-xl">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-md">
            Your unlocked tasks
          </h2>
          <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
            {unlocked.map((unlock) => (
              <Card key={unlock.id} variant="filled" padding="md">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="primary" size="sm">{unlock.task.category.name}</Badge>
                  <Badge variant="outline" size="sm">{unlock.status.replaceAll('_', ' ')}</Badge>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">
                  {unlock.task.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                  {unlock.task.previewDescription}
                </p>
                <div className="flex items-center justify-between gap-space-sm">
                  <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold">
                    {formatMoney(unlock.task.budget)}
                  </span>
                  <LinkButton href={`/worker/tasks/${unlock.taskId}`} size="sm">
                    Open task
                  </LinkButton>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-md">
        Open tasks
      </h2>

      {available.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center flex flex-col items-center justify-center min-h-[240px]">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No tasks available right now</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Check back later for new opportunities</p>
        </Card>
      ) : (
        <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {available.map((task) => (
            <Card key={task.id} variant="elevated" padding="md" hover>
              <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                <Badge variant="primary" size="sm">{task.category.name}</Badge>
                <Badge variant="outline" size="sm">Posted {task.createdAt.toLocaleDateString()}</Badge>
              </div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-xs">{task.title}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2 mb-space-md">
                {task.previewDescription}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                <div className="flex items-center gap-space-md text-on-surface-variant">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span className="font-label-sm text-label-sm">{task.client.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">group</span>
                    <span className="font-label-sm text-label-sm">{task._count.unlocks} Unlocked</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">
                    {formatMoney(task.budget)}
                  </p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Task budget</p>
                </div>
              </div>
              <LinkButton
                href={`/worker/tasks/${task.id}/lock`}
                fullWidth
                variant="tertiary"
                leftIcon={<span className="material-symbols-outlined text-[15px]">lock</span>}
              >
                Unlock Task ({formatMoney(UNLOCK_FEE)})
              </LinkButton>
            </Card>
          ))}
        </div>
      )}
    </PageShell>
  );
}
