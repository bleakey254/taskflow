import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Disputes - TaskFlow Admin',
  description: 'Disputes raised on tasks and submissions',
};

export default async function DisputeCenterPage() {
  const admin = await requireRole([Role.ADMIN]);

  const disputes = await prisma.dispute.findMany({
    include: {
      task: { select: { title: true } },
      claimant: { select: { name: true, email: true } },
      respondent: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  return (
    <AdminShell
      userName={admin.name}
      title="Disputes"
      description="Disputes filed against tasks. Resolution is not automated yet, so this view is read-only."
    >
      {disputes.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState
            icon="gavel"
            title="No disputes"
            hint="Disputes appear here when a worker or client files one against a task."
          />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {disputes.map((dispute) => (
              <div
                key={dispute.id}
                className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
              >
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant={dispute.status === 'OPEN' ? 'error' : 'neutral'} size="sm">{dispute.status}</Badge>
                  <Badge variant="outline" size="sm">{dispute.createdAt.toLocaleDateString()}</Badge>
                </div>
                <p className="font-label-md text-label-md text-on-surface font-bold">{dispute.task.title}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Claimant: {dispute.claimant.name} ({dispute.claimant.email})
                  {dispute.respondent ? ` · Respondent: ${dispute.respondent.name}` : ''}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 whitespace-pre-wrap">{dispute.reason}</p>
                {dispute.resolution && (
                  <p className="font-body-xs text-body-xs text-secondary mt-1">Resolution: {dispute.resolution}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
