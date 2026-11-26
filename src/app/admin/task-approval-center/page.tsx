import { redirect } from 'next/navigation';
import { publishSubmittedTask } from '@/actions/admin';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, TaskStatus } from '@/types/prisma';
import { AdminShell, AdminNotice, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Task Approval Center - TaskFlow Admin',
  description: 'Publish tasks submitted for approval',
};

export default async function TaskApprovalCenterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const admin = await requireRole([Role.ADMIN]);
  const { error, done } = await searchParams;

  const tasks = await prisma.task.findMany({
    where: { status: TaskStatus.SUBMITTED_FOR_APPROVAL },
    include: {
      client: { select: { name: true, email: true } },
      category: { select: { name: true } },
    },
    orderBy: { createdAt: 'asc' },
  });

  const publishAction = async (formData: FormData) => {
    'use server';

    try {
      await publishSubmittedTask(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not publish this task';
      redirect(`/admin/task-approval-center?error=${encodeURIComponent(message)}`);
    }

    redirect('/admin/task-approval-center?done=Task+published');
  };

  return (
    <AdminShell
      userName={admin.name}
      title="Task Approval Center"
      description="Clients publish their own drafts, so this queue only holds tasks explicitly submitted for review."
    >
      <AdminNotice error={error} done={done} />

      {tasks.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState
            icon="check_circle"
            title="Nothing to approve"
            hint="Tasks submitted for approval will queue up here."
          />
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
                      <Badge variant="tertiary" size="sm">{task.status}</Badge>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface font-bold truncate">{task.title}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      {task.client.name} · {task.client.email} · {formatMoney(task.budget)}
                    </p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-1 line-clamp-2">
                      {task.previewDescription}
                    </p>
                  </div>
                  <form action={publishAction} className="sm:ml-space-md">
                    <input type="hidden" name="taskId" value={task.id} />
                    <Button type="submit" size="sm" variant="secondary">Publish</Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
