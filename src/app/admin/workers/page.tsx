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
  title: 'Workers - TaskFlow Admin',
  description: 'Manage worker accounts',
};

export default async function WorkersPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const admin = await requireRole([Role.ADMIN]);
  const { error, done } = await searchParams;

  const workers = await prisma.user.findMany({
    where: { role: Role.WORKER },
    include: {
      wallet: { select: { balance: true } },
      _count: { select: { submissions: true, taskUnlocks: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const statusAction = async (formData: FormData) => {
    'use server';

    try {
      await setUserStatus(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update this account';
      redirect(`/admin/workers?error=${encodeURIComponent(message)}`);
    }

    redirect('/admin/workers?done=Account+updated');
  };

  return (
    <AdminShell userName={admin.name} title="Workers" description="Manage worker accounts and verification">
      <AdminNotice error={error} done={done} />

      {workers.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState icon="engineering" title="No workers yet" hint="Worker accounts appear here after signup." />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {workers.map((worker) => (
              <div
                key={worker.id}
                className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant={worker.status === UserStatus.ACTIVE ? 'success' : 'error'} size="sm">
                        {worker.status}
                      </Badge>
                      <Badge variant="outline" size="sm">
                        Joined {worker.createdAt.toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">{worker.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{worker.email}</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                      {worker._count.taskUnlocks} unlocked · {worker._count.submissions} submissions
                    </p>
                  </div>

                  <div className="flex items-center gap-space-md sm:ml-space-md">
                    <div className="text-right">
                      <p className="font-currency-stat text-currency-stat text-on-surface font-bold">
                        {worker.wallet ? formatMoney(worker.wallet.balance) : formatMoney(0)}
                      </p>
                      <p className="font-body-xs text-body-xs text-on-surface-variant">Wallet</p>
                    </div>

                    {worker.id !== admin.id && (
                      <form action={statusAction}>
                        <input type="hidden" name="userId" value={worker.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={worker.status === UserStatus.ACTIVE ? UserStatus.SUSPENDED : UserStatus.ACTIVE}
                        />
                        <Button
                          type="submit"
                          size="sm"
                          variant={worker.status === UserStatus.ACTIVE ? 'destructive' : 'secondary'}
                        >
                          {worker.status === UserStatus.ACTIVE ? 'Suspend' : 'Activate'}
                        </Button>
                      </form>
                    )}
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
