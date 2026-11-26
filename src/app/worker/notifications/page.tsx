import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { markAllNotificationsAsRead } from '@/actions/notifications';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Notifications - TaskFlow',
  description: 'View your notifications',
};

const presentation: Record<string, { icon: string; classes: string }> = {
  TASK_APPROVED: { icon: 'check_circle', classes: 'bg-secondary/10 text-secondary' },
  TASK_REJECTED: { icon: 'cancel', classes: 'bg-error/10 text-error' },
  TASK_PUBLISHED: { icon: 'campaign', classes: 'bg-primary/10 text-primary' },
  NEW_MESSAGE: { icon: 'mail', classes: 'bg-primary/10 text-primary' },
  WITHDRAWAL_SUCCESS: { icon: 'payments', classes: 'bg-secondary/10 text-secondary' },
  WITHDRAWAL_FAILURE: { icon: 'error', classes: 'bg-error/10 text-error' },
  DISPUTE_OPENED: { icon: 'gavel', classes: 'bg-tertiary/10 text-tertiary' },
  DISPUTE_RESOLVED: { icon: 'gavel', classes: 'bg-secondary/10 text-secondary' },
  SYSTEM_UPDATE: { icon: 'info', classes: 'bg-primary/10 text-primary' },
};

const defaultPresentation = { icon: 'info', classes: 'bg-primary/10 text-primary' };

export default async function NotificationsPage() {
  const user = await requireRole([Role.WORKER]);

  const [notifications, wallet, unread] = await Promise.all([
    prisma.notification.findMany({
      where: { recipientId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.wallet.findUnique({ where: { workerId: user.id } }),
    prisma.notification.count({ where: { recipientId: user.id, read: false } }),
  ]);

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser
            name={user.name}
            balance={wallet ? formatMoney(wallet.balance) : undefined}
            notifications={unread}
          />
        </>
      }
      title="Notifications"
      description="Stay up to date with your account activity"
    >
      <div className="flex items-center justify-between gap-space-md mb-space-md">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          {unread > 0 ? `${unread} unread` : 'Everything is read'}
        </p>
        {unread > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button type="submit" variant="ghost" size="sm">Mark all as read</Button>
          </form>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card variant="outlined" padding="lg" className="text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">notifications</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No notifications yet</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">
            Activity on your tasks and wallet will appear here.
          </p>
        </Card>
      ) : (
        <div className="space-y-space-md">
          {notifications.map((notification) => {
            const style = presentation[notification.type] ?? defaultPresentation;

            return (
              <Card key={notification.id} variant={notification.read ? 'outlined' : 'elevated'} padding="md">
                <div className="flex items-start gap-space-md">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${style.classes}`}>
                    <span className="material-symbols-outlined text-[20px]">{style.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-space-sm">
                      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{notification.title}</h3>
                      <span className="font-body-xs text-body-xs text-on-surface-variant">
                        {notification.createdAt.toLocaleString()}
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{notification.message}</p>
                    {!notification.read && (
                      <Badge variant="primary" size="sm" className="mt-space-xs">New</Badge>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
