import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, SubmissionStatus } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import { LinkButton } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'My Submissions - TaskFlow',
  description: 'View and manage your task submissions',
};

const statusBadge: Record<string, 'pending' | 'approved' | 'rejected'> = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export default async function WorkerSubmissionsPage() {
  const user = await requireRole([Role.WORKER]);

  const [submissions, wallet] = await Promise.all([
    prisma.submission.findMany({
      where: { workerId: user.id },
      include: {
        task: {
          include: { category: { select: { name: true } } },
        },
      },
      orderBy: { submittedAt: 'desc' },
    }),
    prisma.wallet.findUnique({ where: { workerId: user.id } }),
  ]);

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={wallet ? formatMoney(wallet.balance) : undefined} />
        </>
      }
      title="My Submissions"
      description="View and manage your task submissions"
    >
      {submissions.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">assignment</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No submissions yet</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">
            Unlock a task and submit your work to see it here.
          </p>
          <div className="mt-space-md">
            <LinkButton href="/worker/tasks" size="sm">Browse tasks</LinkButton>
          </div>
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {submissions.map((submission) => {
              const approved = submission.status === SubmissionStatus.APPROVED;

              return (
                <div
                  key={submission.id}
                  className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                        <Badge variant="primary" size="sm">{submission.task.category.name}</Badge>
                        <StatusBadge status={statusBadge[submission.status]} size="sm" />
                      </div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">
                        {submission.task.title}
                      </h3>
                      <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                        {submission.content}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant mt-space-xs">
                        Submitted {submission.submittedAt.toLocaleString()}
                        {submission.feedback ? ` — feedback: ${submission.feedback}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-space-lg sm:ml-space-md">
                      <div className="text-right">
                        <p className={`font-currency-stat text-currency-stat font-extrabold ${approved ? 'text-secondary' : 'text-on-surface-variant'}`}>
                          {approved ? formatMoney(submission.task.budget) : formatMoney(0)}
                        </p>
                        <p className="font-body-xs text-body-xs text-on-surface-variant">
                          {approved ? 'Earned' : submission.status === SubmissionStatus.PENDING ? 'Pending' : 'Rejected'}
                        </p>
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
