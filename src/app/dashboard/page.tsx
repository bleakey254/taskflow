import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, TaskStatus, SubmissionStatus } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { DataCard, StatGrid } from '@/components/layout';
import { Badge } from '@/components/layout';
import { LinkButton } from '@/components/layout';
import Link from 'next/link';

export default async function DashboardPage() {
  const user = await requireAuth();

  const isWorker = user.role === Role.WORKER;
  const isClient = user.role === Role.CLIENT;
  const isAdmin = user.role === Role.ADMIN;

  const [notifications, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.notification.count({ where: { recipientId: user.id, read: false } }),
  ]);

  let balance: string | undefined;
  let earnings = 0;
  let completedAsWorker = 0;
  let pendingAsWorker = 0;
  let activeAsClient = 0;
  let awaitingReview = 0;
  let postedAsClient = 0;

  if (isWorker) {
    const [wallet, completed, pending] = await Promise.all([
      prisma.wallet.findUnique({ where: { workerId: user.id } }),
      prisma.taskUnlock.count({ where: { workerId: user.id, status: TaskStatus.COMPLETED } }),
      prisma.submission.count({ where: { workerId: user.id, status: SubmissionStatus.PENDING } }),
    ]);

    balance = wallet ? formatMoney(wallet.balance) : undefined;
    earnings = wallet ? Number(wallet.balance.toString()) : 0;
    completedAsWorker = completed;
    pendingAsWorker = pending;
  }

  if (isClient) {
    const [active, review, posted] = await Promise.all([
      prisma.task.count({
        where: {
          clientId: user.id,
          status: { in: [TaskStatus.PUBLISHED, TaskStatus.VIEWED, TaskStatus.UNLOCKED, TaskStatus.IN_PROGRESS] },
        },
      }),
      prisma.submission.count({
        where: { status: SubmissionStatus.PENDING, task: { clientId: user.id } },
      }),
      prisma.task.count({ where: { clientId: user.id } }),
    ]);

    activeAsClient = active;
    awaitingReview = review;
    postedAsClient = posted;
  }

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={balance} notifications={unread} />
        </>
      }
      title="Dashboard"
      description={`Welcome back, ${user.name}.`}
    >
      <StatGrid columns={3} gap="md">
        {isWorker && (
          <DataCard
            title="Wallet balance"
            value={formatMoney(earnings)}
            icon={<span className="material-symbols-outlined text-[24px]">savings</span>}
            iconColor="secondary"
            subtitle={`${completedAsWorker} task${completedAsWorker === 1 ? '' : 's'} completed`}
          />
        )}
        {isWorker && (
          <DataCard
            title="Awaiting review"
            value={pendingAsWorker}
            icon={<span className="material-symbols-outlined text-[24px]">hourglass_top</span>}
            iconColor="primary"
            subtitle="Submissions waiting on a client"
          />
        )}
        {isClient && (
          <DataCard
            title="Active tasks"
            value={activeAsClient}
            icon={<span className="material-symbols-outlined text-[24px]">task_alt</span>}
            iconColor="primary"
            subtitle={`${postedAsClient} posted in total`}
          />
        )}
        {isClient && (
          <DataCard
            title="Awaiting your review"
            value={awaitingReview}
            icon={<span className="material-symbols-outlined text-[24px]">rate_review</span>}
            iconColor="tertiary"
            subtitle="Submissions to approve or reject"
          />
        )}
        <DataCard
          title="Account status"
          value={user.status === 'ACTIVE' ? 'Active' : user.status}
          icon={<span className="material-symbols-outlined text-[24px]">verified</span>}
          iconColor="secondary"
          subtitle="Your account is in good standing"
          variant="highlight"
        />
      </StatGrid>

      <div className="mt-space-xl">
        <Card padding="lg">
          <CardHeader title="Recent activity" />
          <CardContent>
            {notifications.length === 0 ? (
              <div className="text-center py-space-xl">
                <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">history</span>
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No recent activity to display.</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">
                  Start completing or posting tasks to see activity here.
                </p>
              </div>
            ) : (
              <div className="space-y-0">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start justify-between gap-space-md p-space-sm border-b border-outline-variant/50 last:border-0"
                  >
                    <div className="min-w-0">
                      <p className="font-label-md text-label-md text-on-surface font-medium">{notification.title}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">{notification.message}</p>
                    </div>
                    <span className="font-body-xs text-body-xs text-on-surface-variant whitespace-nowrap">
                      {notification.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-space-xl grid gap-gutter sm:grid-cols-2">
        {isWorker && (
          <Card padding="lg" hover>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">travel_explore</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Find Tasks</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Browse available tasks and start earning
                </p>
              </div>
            </div>
            <div className="mt-space-md">
              <LinkButton href="/worker/tasks" size="sm">Browse tasks</LinkButton>
            </div>
          </Card>
        )}

        {isClient && (
          <Card padding="lg" hover>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[24px]">add_circle</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Create Task</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Post a new task for workers to complete
                </p>
              </div>
            </div>
            <div className="mt-space-md">
              <LinkButton href="/client/tasks/create" size="sm">Create a task</LinkButton>
            </div>
          </Card>
        )}

        {isWorker && (
          <Card padding="lg" hover>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">account_balance_wallet</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Wallet</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  View earnings and manage withdrawals
                </p>
              </div>
            </div>
            <div className="mt-space-md">
              <LinkButton href="/worker/wallet" size="sm" variant="secondary">Open wallet</LinkButton>
            </div>
          </Card>
        )}

        {isClient && (
          <Card padding="lg" hover>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[24px]">assignment</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">My Tasks</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Publish drafts and review submissions
                </p>
              </div>
            </div>
            <div className="mt-space-md">
              <LinkButton href="/client/tasks" size="sm" variant="secondary">Manage tasks</LinkButton>
            </div>
          </Card>
        )}

        {isAdmin && (
          <Card padding="lg" hover>
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary">
                <span className="material-symbols-outlined text-[24px]">admin_panel_settings</span>
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Admin</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Withdrawals, accounts and platform stats
                </p>
              </div>
            </div>
            <div className="mt-space-md">
              <LinkButton href="/admin/dashboard" size="sm" variant="tertiary">Admin dashboard</LinkButton>
            </div>
          </Card>
        )}
      </div>
    </PageShell>
  );
}
