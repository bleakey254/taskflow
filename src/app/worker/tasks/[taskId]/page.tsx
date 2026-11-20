import { getTaskDetails } from '@/actions/task';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { redirect } from 'next/navigation';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import { Input, Textarea } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Task Details - TaskFlow',
  description: 'View full task details and submit work',
};

export default async function TaskDetailsPage({
  params,
}: {
  params: { taskId: string };
}) {
  const user = await getCurrentUser();
  await requireRole([Role.WORKER]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const taskId = params.taskId;

  const task = await getTaskDetails(taskId, user.id);

  if (!task) {
    redirect(`/worker/tasks/${taskId}/lock`);
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
    >
      <div className="max-w-4xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">{task.title}</h1>
            <div className="flex flex-wrap items-center gap-space-md mt-space-sm">
              <Badge variant="primary" size="sm">AI & Machine Learning</Badge>
              <Badge variant="secondary" size="sm">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> 4.9
              </Badge>
              <StatusBadge status="in_progress" size="sm" />
            </div>
          </div>
          <div className="flex items-center gap-space-md sm:ml-space-md">
            <div className="text-right">
              <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold">${Number(task.budget).toFixed(2)} {task.currency}</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant">Budget</p>
            </div>
          </div>
        </div>

        <Card variant="elevated" padding="lg">
          <CardHeader
            title="Task Description"
            action={
              <IconButton variant="ghost" size="sm" ariaLabel="Share task">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </IconButton>
            }
          />
          <CardContent>
            <p className="font-body-md text-body-md text-on-surface-variant whitespace-pre-wrap">{task.description}</p>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg" className="mt-space-lg">
          <CardHeader title="Requirements" />
          <CardContent>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Detailed requirements would go here. This is where the client
              specifies exactly what they need delivered.
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg" className="mt-space-lg">
          <CardHeader title="Submission" />
          <CardContent>
            <form className="space-y-space-lg" action={async (formData: FormData) => {
              'use server';
            }}>
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
                <Button variant="ghost" onClick={() => window.history.back()}>
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Go Back
                </Button>
                <Button type="submit" leftIcon={<span className="material-symbols-outlined text-[18px]">send</span>}>
                  Submit Work
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
}