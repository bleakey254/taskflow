import { redirect } from 'next/navigation';
import { getTaskDetails, submitTask } from '@/actions/task';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { formatMoney } from '@/lib/constants';
import { Role, TaskStatus } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';
import { Textarea } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Task Details - TaskFlow',
  description: 'View full task details and submit work',
};

const unlockLabels: Record<string, string> = {
  [TaskStatus.UNLOCKED]: 'Unlocked',
  [TaskStatus.IN_PROGRESS]: 'Submitted — awaiting review',
  [TaskStatus.COMPLETED]: 'Completed',
  [TaskStatus.REJECTED]: 'Rejected — you can resubmit',
};

export default async function TaskDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ error?: string; submitted?: string }>;
}) {
  const user = await requireRole([Role.WORKER]);
  const { taskId } = await params;
  const { error, submitted } = await searchParams;

  const task = await getTaskDetails(taskId);

  if (!task) {
    redirect(`/worker/tasks/${taskId}/lock`);
  }

  const wallet = await prisma.wallet.findUnique({ where: { workerId: user.id } });
  const canSubmit = !task.pendingSubmission && task.unlockStatus === TaskStatus.UNLOCKED;

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
    >
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-space-md mt-space-sm">
              <Badge variant="primary" size="sm">{task.category.name}</Badge>
              <Badge variant="outline" size="sm">{unlockLabels[task.unlockStatus] ?? task.unlockStatus}</Badge>
              <Badge variant="secondary" size="sm">Client: {task.client.name}</Badge>
            </div>
          </div>
          <div className="text-right sm:ml-space-md">
            <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold">
              {formatMoney(task.budget)} {task.currency}
            </p>
            <p className="font-body-xs text-body-xs text-on-surface-variant">Task budget</p>
          </div>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Task Description" />
          <CardContent>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">{task.description}</p>
            {task.deadline && (
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-md">
                Deadline: {task.deadline.toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg" className="mt-space-lg">
          <CardHeader title="Submission" />
          <CardContent>
            {submitted && (
              <p className="mb-space-md font-body-sm text-body-sm text-primary flex items-center gap-1" role="status">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                Work submitted. The client will review it shortly.
              </p>
            )}
            {error && (
              <p className="mb-space-md font-body-sm text-body-sm text-error flex items-center gap-1" role="alert">
                <span className="material-symbols-outlined text-[16px]">error</span>
                {error}
              </p>
            )}

            {task.pendingSubmission ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                You submitted this task on {task.pendingSubmission.submittedAt.toLocaleString()}. You can submit
                again if the client rejects it.
              </p>
            ) : !canSubmit ? (
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                This task is {task.unlockStatus === TaskStatus.COMPLETED ? 'already completed' : 'closed for submissions'}.
              </p>
            ) : (
              <form
                className="space-y-space-lg"
                action={async (formData: FormData) => {
                  'use server';

                  try {
                    await submitTask(undefined, formData);
                  } catch (err) {
                    const message = err instanceof Error ? err.message : 'Could not submit your work';
                    redirect(`/worker/tasks/${taskId}?error=${encodeURIComponent(message)}`);
                  }

                  redirect(`/worker/tasks/${taskId}?submitted=1`);
                }}
              >
                <input type="hidden" name="taskId" value={taskId} />
                <Textarea
                  label="Your Work"
                  name="content"
                  required
                  rows={8}
                  placeholder="Describe your completed work, provide links, or paste your deliverable content here..."
                />

                <Textarea
                  label="Attachments (optional)"
                  name="attachments"
                  rows={3}
                  placeholder='JSON array of file URLs, e.g., ["https://example.com/file1.jpg"]'
                  helperText="Provide attachments as a JSON array of URLs"
                />

                <CardFooter>
                  <Link
                    href="/worker/tasks"
                    className="inline-flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-bold rounded-lg px-space-xl py-space-md text-on-surface hover:bg-surface-container-high transition-all duration-fast"
                  >
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Go Back
                  </Link>
                  <Button type="submit" leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}>
                    Submit Work
                  </Button>
                </CardFooter>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}
