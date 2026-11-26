import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types/prisma';
import { AdminShell, EmptyState } from '@/components/admin/AdminShell';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Audit Logs - TaskFlow Admin',
  description: 'Administrative actions and audit trail',
};

export default async function AuditLogsPage() {
  const admin = await requireRole([Role.ADMIN]);

  const [actions, logs] = await Promise.all([
    prisma.adminAction.findMany({
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.auditLog.findMany({
      include: { actor: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
  ]);

  return (
    <AdminShell userName={admin.name} title="Audit Logs" description="Every administrative action recorded on the platform">
      <div className="grid gap-gutter">
        <Card variant="elevated" padding="lg">
          <CardHeader title="Admin actions" subtitle="Withdrawals settled, accounts changed, tasks published" />
          <CardContent>
            {actions.length === 0 ? (
              <EmptyState icon="history" title="No admin actions yet" hint="Settling a withdrawal or changing an account is recorded here." />
            ) : (
              <div className="space-y-0">
                {actions.map((action) => (
                  <div
                    key={action.id}
                    className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">
                        {action.actor.name} · {action.action}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {action.entityType} {action.entityId} · {action.createdAt.toLocaleString()}
                        {action.metadata ? ` · ${JSON.stringify(action.metadata)}` : ''}
                      </p>
                    </div>
                    <Badge variant="outline" size="sm">{action.entityType}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Audit trail" subtitle="Lower-level records written by platform code" />
          <CardContent>
            {logs.length === 0 ? (
              <EmptyState icon="policy" title="No audit entries" hint="Audit records appear here as the platform writes them." />
            ) : (
              <div className="space-y-0">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="flex flex-wrap items-center justify-between gap-space-sm p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">
                        {log.actor?.name ?? 'System'} · {log.action}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">
                        {log.entityType} {log.entityId} · {log.createdAt.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant="outline" size="sm">{log.entityType}</Badge>
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
