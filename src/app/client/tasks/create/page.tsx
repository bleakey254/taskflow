import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { createTask } from '@/actions/task';
import { MIN_TASK_BUDGET } from '@/lib/constants';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardFooter } from '@/components/layout';
import { Button } from '@/components/layout';
import { Input, Textarea, Select } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Create Task - TaskFlow',
  description: 'Create a new micro-task',
};

export default async function CreateTaskPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const user = await requireRole([Role.CLIENT]);
  const { error } = await searchParams;

  const categories = await prisma.taskCategory.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  // The id sent with the form must be the category's database id, not its name.
  const createAction = async (formData: FormData) => {
    'use server';

    try {
      await createTask(undefined, formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not create the task';
      redirect(`/client/tasks/create?error=${encodeURIComponent(message)}`);
    }

    redirect('/client/tasks?created=1');
  };

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} />
        </>
      }
      title="Create New Task"
      description={`Create a task that workers can complete for $${MIN_TASK_BUDGET.toFixed(2)}+`}
    >
      <Card variant="elevated" padding="lg" className="max-w-2xl">
        {error && (
          <p className="mb-space-md font-body-sm text-body-sm text-error flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </p>
        )}

        <form className="space-y-space-lg" action={createAction}>
          <Input
            label="Task Title"
            name="title"
            type="text"
            required
            maxLength={100}
            placeholder="Enter a clear, descriptive title"
            leftIcon={<span className="material-symbols-outlined text-[20px]">title</span>}
            helperText="Maximum 100 characters"
          />

          <Textarea
            label="Task Description"
            name="description"
            required
            rows={4}
            placeholder="Describe the task in detail. What needs to be done? What are the requirements?"
          />

          <Textarea
            label="Preview Description (what workers see before paying)"
            name="previewDescription"
            required
            rows={3}
            maxLength={200}
            placeholder="Brief preview shown to workers before they unlock the task"
            helperText="Maximum 200 characters"
          />

          <Select
            label="Category"
            name="categoryId"
            required
            placeholder="Select a category"
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
          />

          <div className="space-y-space-sm">
            <label htmlFor="budget" className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
              Budget ($)
            </label>
            <div className="flex items-center gap-space-sm">
              <span className="text-on-surface font-body-lg text-body-lg font-bold">$</span>
              <Input
                id="budget"
                name="budget"
                type="number"
                step="0.01"
                min={MIN_TASK_BUDGET}
                required
                className="w-32"
                placeholder={MIN_TASK_BUDGET.toFixed(2)}
                helperText={`Minimum budget is $${MIN_TASK_BUDGET.toFixed(2)} (the unlock fee)`}
              />
            </div>
          </div>

          <div className="space-y-space-sm">
            <label htmlFor="deadline" className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
              Deadline (optional)
            </label>
            <Input
              id="deadline"
              name="deadline"
              type="date"
              leftIcon={<span className="material-symbols-outlined text-[20px]">event</span>}
            />
          </div>

          <CardFooter>
            <Link
              href="/client/tasks"
              className="inline-flex items-center justify-center gap-1.5 font-label-lg text-label-lg font-bold rounded-lg px-space-xl py-space-md text-on-surface hover:bg-surface-container-high transition-all duration-fast"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Go Back
            </Link>
            <Button type="submit" leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}>
              Save draft
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}
