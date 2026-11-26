import { redirect } from 'next/navigation';
import { setUserStatus } from '@/actions/admin';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role, UserStatus } from '@/types/prisma';
import { AdminShell, AdminNotice, EmptyState } from '@/components/admin/AdminShell';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';

export const metadata = {
  title: 'Account Review - TaskFlow Admin',
  description: 'Review accounts that are not active',
};

export default async function VerificationQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; done?: string }>;
}) {
  const admin = await requireRole([Role.ADMIN]);
  const { error, done } = await searchParams;

  const accounts = await prisma.user.findMany({
    where: { status: { not: UserStatus.ACTIVE } },
    select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  const activateAction = async (formData: FormData) => {
    'use server';

    try {
      await setUserStatus(formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not update this account';
      redirect(`/admin/verification-queue?error=${encodeURIComponent(message)}`);
    }

    redirect('/admin/verification-queue?done=Account+activated');
  };

  return (
    <AdminShell
      userName={admin.name}
      title="Account Review"
      description="Accounts that are suspended or inactive cannot sign in until they are reactivated here."
    >
      <AdminNotice error={error} done={done} />

      {accounts.length === 0 ? (
        <Card variant="outlined" padding="lg">
          <EmptyState
            icon="verified_user"
            title="No accounts need review"
            hint="Suspended or deactivated accounts will be listed here."
          />
        </Card>
      ) : (
        <Card variant="filled" padding="none">
          <div className="space-y-0">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="p-space-md border-b border-outline-variant/50 last:border-0 hover:bg-surface-container transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                      <Badge variant="error" size="sm">{account.status}</Badge>
                      <Badge variant="outline" size="sm">{account.role}</Badge>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface font-bold">{account.name}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">{account.email}</p>
                    <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">
                      Registered {account.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <form action={activateAction} className="sm:ml-space-md">
                    <input type="hidden" name="userId" value={account.id} />
                    <input type="hidden" name="status" value={UserStatus.ACTIVE} />
                    <Button type="submit" size="sm" variant="secondary">Activate</Button>
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
