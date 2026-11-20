import { getCurrentUser } from '@/lib/middleware/auth';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Notifications - TaskFlow',
  description: 'View your notifications',
};

export default async function NotificationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance="$245.50" />
        </>
      }
      title="Notifications"
      description="Stay up to date with your account activity"
    >
      <div className="space-y-space-md">
        <Card variant="elevated" padding="md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-space-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Submission Approved</h3>
                <span className="font-body-xs text-body-xs text-on-surface-variant">2 hours ago</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Your submission for "AI Data Annotation: Bounding Box Vehicle Tags" has been approved. $5.00 has been added to your wallet.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">lock_open</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-space-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Task Unlocked</h3>
                <span className="font-body-xs text-body-xs text-on-surface-variant">5 hours ago</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                You unlocked "E-commerce Product Tagging & Attribute Validation". $0.80 was deducted from your balance.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-tertiary/10 flex items-center justify-center text-tertiary flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">payment</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-space-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Withdrawal Processed</h3>
                <span className="font-body-xs text-body-xs text-on-surface-variant">1 day ago</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Your withdrawal of $100.00 via M-Pesa has been processed successfully.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="md">
          <div className="flex items-start gap-space-md">
            <div className="w-10 h-10 rounded-lg bg-error/10 flex items-center justify-center text-error flex-shrink-0">
              <span className="material-symbols-outlined text-[20px]">cancel</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-space-sm">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Submission Rejected</h3>
                <span className="font-body-xs text-body-xs text-on-surface-variant">2 days ago</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Your submission for "Survey Data Entry" was rejected. Reason: Incomplete responses for questions 15-20.
              </p>
            </div>
          </div>
        </Card>

        <Card variant="outlined" padding="lg" className="text-center">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">notifications</span>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more notifications</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">You're all caught up!</p>
        </Card>
      </div>
    </PageShell>
  );
}