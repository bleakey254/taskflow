import { getCurrentUser } from '@/lib/middleware/auth';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'My Tasks - TaskFlow',
  description: 'View and manage your posted tasks',
};

export default async function ClientTasksPage() {
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
      title="My Tasks"
      description="View and manage your posted tasks"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">My Tasks</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">View and manage your posted tasks</p>
        </div>
        <Link href="/client/tasks/create">
          <Button leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}>
            Create New Task
          </Button>
        </Link>
      </div>

      <Card variant="filled" padding="none">
        <div className="space-y-0">
          {/* Task Card */}
          <div className="p-space-md border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-space-md">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                  <Badge variant="primary" size="sm">Design</Badge>
                  <StatusBadge status="completed" size="sm" />
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">Sample Task Title</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 line-clamp-2">
                  Sample task description that was posted by a client.
                </p>
              </div>
              <div className="flex items-center gap-space-lg sm:ml-space-md">
                <div className="text-right">
                  <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold">$5.00</p>
                  <p className="font-body-xs text-body-xs text-on-surface-variant">Budget</p>
                </div>
                <div className="flex items-center gap-space-sm">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                  <IconButton variant="ghost" size="sm" ariaLabel="View submissions">
                    <span className="material-symbols-outlined text-[20px]">assignment</span>
                  </IconButton>
                </div>
              </div>
            </div>
          </div>

          {/* Empty State */}
          <div className="p-space-xl text-center">
            <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">task_alt</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No tasks yet</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">Create your first task to get started</p>
            <Link href="/client/tasks/create" className="mt-space-md inline-block">
              <Button size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">add_circle</span>}>
                Create Task
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}