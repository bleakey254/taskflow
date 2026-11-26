import { redirect } from 'next/navigation';
import { setUserStatus } from '@/actions/admin';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, UserStatus } from '@/types/prisma';
import { AdminShell, AdminNotice, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Clients - TaskFlow Admin',
  description: 'Manage client accounts',
};

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const admin = await requireRole([Role.ADMIN]);
  const { error, done } = await searchParams;

  const clients = await prisma.user.findMany({
    where: { role: Role.CLIENT },
    include: {
      createdTasks: {
        select: { budget: true, status: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusAction = async (formData: FormData) => {
    'use server';

    try {
      await setUserStatus(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update this account';
      redirect(`/admin/clients?error=${encodeURIComponent(message)}`);
    }

    redirect('/admin/clients?done=Account+updated');
  };

  return (
    <AdminShell userName={admin.name} title="Clients" description="Manage client accounts and posting activity">
      <AdminNotice error={error} done={done} />

      {clients.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState icon="business" title="No clients yet" hint="Client accounts appear here after signup." />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {clients.map((client) => {
              const completed = client.createdTasks.filter((task) => task.status === 'COMPLETED');
              const spend = completed.reduce((total, task) => total + Number(task.budget.toString()), 0);

              return (
                <div
                  key={client.id}
                  className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                        <Badge variant={client.status === UserStatus.ACTIVE ? 'success' : 'error'} size="sm">
                          {client.status}
                        </Badge>
                        <Badge variant="outline" size="sm">Joined {client.createdAt.toLocaleDateString()}</Badge>
                      </div>
                      <p className="font-label-md text-label-md text-on-surface font-bold">{client.name}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{client.email}</p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                        {client.createdTasks.length} posted · {completed.length} completed · {formatMoney(spend)} settled
                      </p>
                    </div>

                    {client.id !== admin.id && (
                      <form action={statusAction} className="sm:ml-space-md">
                        <input type="hidden" name="userId" value={client.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={client.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant={client.status === UserStatus.ACTIVE ? 'destructive' : 'secondary'}
                        >
                          {client.status === UserStatus.ACTIVE ? 'Suspend' : 'Activate'}
                        </Button>
                      </form>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </AdminShell>
  );
}
