import { createTask } from '@/actions/task';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Input, Textarea, Select } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Create Task - TaskFlow',
  description: 'Create a new micro-task',
};

export default async function CreateTaskPage() {
  const user = await getCurrentUser();
  await requireRole([Role.CLIENT]);

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
      title="Create New Task"
      description="Create a task that workers can complete for $0.80+"
    >
      <Card variant="elevated" padding="lg" className="max-w-2xl">
        <form className="space-y-space-lg" action={async (formData: FormData) => {
          'use server';
          await createTask(undefined, formData);
        }}>
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
            options={[
              { value: 'design', label: 'Design' },
              { value: 'development', label: 'Development' },
              { value: 'writing', label: 'Writing & Translation' },
              { value: 'marketing', label: 'Marketing & Social Media' },
              { value: 'data', label: 'Data Entry & Analysis' },
              { value: 'video', label: 'Video & Animation' },
              { value: 'music', label: 'Music & Audio' },
              { value: 'business', label: 'Business & Consulting' },
            ]}
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
                min="0.80"
                required
                className="w-32"
                placeholder="0.80"
                helperText="Minimum budget is $0.80 (the unlock fee)"
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
            <Button variant="ghost" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Go Back
            </Button>
            <Button type="submit" leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}>
              Create Task
            </Button>
          </CardFooter>
        </form>
      </Card>
    </PageShell>
  );
}