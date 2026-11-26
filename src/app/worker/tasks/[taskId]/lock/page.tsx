import { redirect } from 'next/navigation';
import { getTaskPreview, getTaskDetails } from '@/actions/task';
import { initiateTaskUnlockPayment } from '@/actions/payment';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney, UNLOCK_FEE } from '@/lib/constants';
import { isPaymentSimulationEnabled } from '@/lib/payments';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';
import { Input } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Unlock Task - TaskFlow',
  description: 'Unlock the full task details for $0.80',
};

export default async function TaskLockPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const { taskId } = await params;
  const { error } = await searchParams;

  // Derive the worker from the session; anything else is rejected here.
  const user = await requireRole([Role.WORKER]);

  // Already unlocked? Send them straight to the task instead of charging twice.
  const existing = await getTaskDetails(taskId);
  if (existing) {
    redirect(`/worker/tasks/${taskId}`);
  }

  const task = await getTaskPreview(taskId);
  if (!task) {
    redirect('/worker/tasks');
  }

  const wallet = await prisma.wallet.findUnique({ where: { workerId: user.id } });
  const balance = wallet ? formatMoney(wallet.balance) : undefined;
  const simulated = isPaymentSimulationEnabled();

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance={balance} />
        </>
      }
      title="Unlock This Task"
      description={`Pay ${formatMoney(UNLOCK_FEE)} to see the full description and submit work`}
    >
      <div className="max-w-2xl">
        <Card variant="elevated" padding="lg">
          <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
            <Badge variant="primary" size="sm">{task.category.name}</Badge>
            <Badge variant="secondary" size="sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              Locked
            </Badge>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface font-extrabold mb-space-sm">{task.title}</h1>
          <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">{task.previewDescription}</p>

          <div className="mt-space-lg flex flex-wrap items-center justify-between gap-space-md border-t border-outline-variant pt-space-md">
            <div className="flex items-center gap-space-md text-on-surface-variant">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">person</span>
                <span className="font-label-sm text-label-sm">{task.client.name}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">group</span>
                <span className="font-label-sm text-label-sm">{task._count.unlocks} Unlocked</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold leading-none">
                {formatMoney(task.budget)} {task.currency}
              </p>
              <p className="font-body-xs text-body-xs text-on-surface-variant">Task Budget</p>
            </div>
          </div>
        </Card>

        <Card variant="elevated" padding="lg" className="mt-space-lg">
          <CardHeader
            title={`Unlock for ${formatMoney(UNLOCK_FEE)}`}
            subtitle="One-time fee per task. Charge is made via M-Pesa."
          />
          <CardContent>
            {simulated && (
              <p className="mb-space-md font-body-sm text-body-sm text-tertiary">
                Development mode: this unlock is simulated and no money is moved.
              </p>
            )}
            {error && (
              <p className="mb-space-md font-body-sm text-body-sm text-error flex items-center gap-1" role="alert">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </p>
            )}
            <form
              className="space-y-space-lg"
              action={async (formData: FormData) => {
                'use server';

                const result = await initiateTaskUnlockPayment(undefined, formData);

                if (result.success && result.redirectUrl) {
                  redirect(result.redirectUrl);
                }

                redirect(
                  `/worker/tasks/${taskId}/lock?error=${encodeURIComponent(result.error ?? 'Unable to unlock this task')}`
                );
              }}
            >
              <input type="hidden" name="taskId" value={taskId} />
              <Input
                label="M-Pesa Phone Number"
                name="phoneNumber"
                type="tel"
                required
                placeholder="+254712345678"
                leftIcon={<span className="material-symbols-outlined text-[20px]">smartphone</span>}
                helperText="You will receive an STK push prompt on this number"
              />

              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Unlocking gives you the full task description and lets you submit work. The{' '}
                {formatMoney(UNLOCK_FEE)} fee is non-refundable.
              </p>

              <CardFooter>
                <Link
                  href="/worker/tasks"
                  className="inline-flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-bold rounded-lg px-space-xl py-space-md text-on-surface hover:bg-surface-container-high transition-all duration-fast"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back to Tasks
                </Link>
                <Button type="submit" leftIcon={<span className="material-symbols-outlined text-[18px]">lock_open</span>}>
                  Pay {formatMoney(UNLOCK_FEE)} &amp; Unlock
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
