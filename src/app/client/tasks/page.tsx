import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { publishTask, submitTaskForApproval } from '@/actions/task';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card } from '@/components/layout';
import { Badge } from '@/components/layout';
import { Button } from '@/components/layout';
import { LinkButton } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'My Tasks - TaskFlow',
  description: 'View and manage your posted tasks',
};

const taskStatus: Record<string, { label: string; classes: string }> = {
  DRAFT: { label: 'Draft', classes: 'bg-surface-container-high text-on-surface-variant' },
  SUBMITTED_FOR_APPROVAL: { label: 'Pending review', classes: 'bg-tertiary/10 text-tertiary' },
  PUBLISHED: { label: 'Live', classes: 'bg-secondary/10 text-secondary' },
  VIEWED: { label: 'Live', classes: 'bg-secondary/10 text-secondary' },
  UNLOCKED: { label: 'Live', classes: 'bg-secondary/10 text-secondary' },
  IN_PROGRESS: { label: 'In progress', classes: 'bg-primary/10 text-primary' },
  COMPLETED: { label: 'Completed', classes: 'bg-secondary/10 text-secondary' },
  REJECTED: { label: 'Rejected', classes: 'bg-error/10 text-error' },
  CANCELLED: { label: 'Cancelled', classes: 'bg-surface-container-high text-on-surface-variant' },
  DISPUTED: { label: 'Disputed', classes: 'bg-tertiary/10 text-tertiary' },
};

export default async function ClientTasksPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string; error?: string }>;
}) {
  const user = await requireRole([Role.CLIENT]);
  const { created, error } = await searchParams;

  // Failures come back as a query message so the page can show them instead of
  // the action's error reaching the client as an unhandled rejection.
  const submitForApprovalAction = async (formData: FormData) => {
    'use server';

    try {
      await submitTaskForApproval(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not submit this task for approval';
      redirect(`/client/tasks?error=${encodeURIComponent(message)}`);
    }
  };

  const publishAction = async (formData: FormData) => {
    'use server';

    try {
      await publishTask(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not publish this task';
      redirect(`/client/tasks?error=${encodeURIComponent(message)}`);
    }
  };

  const tasks = await prisma.task.findMany({
    where: { clientId: user.id },
    include: {
      category: { select: { name: true } },
      _count: { select: { submissions: true, unlocks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} />
        </>
      }
      title="My Tasks"
      description="View and manage your posted tasks"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">My Tasks</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">
            Drafts stay hidden from workers until you publish them.
          </p>
        </div>
        <LinkButton href="/client/tasks/create" leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}>
          Create New Task
        </LinkButton>
      </div>

      {created && (
        <p className="mb-space-md font-body-sm text-body-sm text-secondary" role="status">
          Task saved as a draft. Publish it when you are ready for workers to see it.
        </p>
      )}
      {error && (
        <p className="mb-space-md font-body-sm text-body-sm text-error" role="alert">{error}</p>
      )}

      {tasks.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No tasks yet</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Create your first task to get started</p>
          <div className="mt-space-md">
            <LinkButton href="/client/tasks/create" size="sm">Create Task</LinkButton>
          </div>
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {tasks.map((task) => {
              const status = taskStatus[task.status] ?? taskStatus.DRAFT;
              const isDraft = task.status === 'DRAFT';

              return (
                <div
                  key={task.id}
                  className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                        <Badge variant="primary" size="sm">{task.category.name}</Badge>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-label-sm text-label-sm font-semibold ${status.classes}`}>
                          {status.label}
                        </span>
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{task.title}</h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                        {task.previewDescription}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant mt-space-xs">
                        {task._count.unlocks} unlocked · {task._count.submissions} submission{task._count.submissions === 1 ? '' : 's'}
                        {task.deadline ? ` · due ${task.deadline.toLocaleDateString()}` : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-space-md sm:ml-space-md">
                      <div className="text-right">
                        <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold">
                          {formatMoney(task.budget)}
                        </p>
                        <p className="font-body-xs text-body-xs text-on-surface-variant">Budget</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-space-sm">
                        {isDraft && (
                          <>
                            <form action={publishAction}>
                              <input type="hidden" name="taskId" value={task.id} />
                              <Button type="submit" size="sm" variant="secondary">Publish</Button>
                            </form>
                            <form action={submitForApprovalAction}>
                              <input type="hidden" name="taskId" value={task.id} />
                              <Button type="submit" size="sm" variant="outlined">Submit for review</Button>
                            </form>
                          </>
                        )}
                        <LinkButton href={`/client/tasks/${task.id}/submissions`} size="sm" variant="outlined">
                          {task._count.submissions > 0 ? `Review (${task._count.submissions})` : 'Submissions'}
                        </LinkButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </PageShell>
  );
}
