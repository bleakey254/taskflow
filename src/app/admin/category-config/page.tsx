import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, CategoryBadge } from '@/components/layout';
import { Input, Select } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Category Configuration - TaskFlow Admin',
  description: 'Configure task categories and settings',
};

export default async function CategoryConfigPage() {
  const user = await getCurrentUser();
  await requireRole([Role.ADMIN]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <PageShell
      header={
        <>
          <Link href="/admin/dashboard" className="flex items-center gap-space-sm" data-path="admin">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow Admin</span>
          </Link>
          <HeaderUser name={user.name} />
        </>
      }
      title="Category Configuration"
      description="Configure task categories, pricing, and settings"
    >
      <div className="grid gap-gutter lg:grid-cols-3">
        <Card variant="elevated" padding="lg" className="lg:col-span-2">
          <CardHeader
            title="Task Categories"
            action={<Button size="sm" leftIcon={<span className="material-symbols-outlined text-[16px]">add_circle</span>}>Add Category</Button>}
          />
          <CardContent>
            <div className="space-y-space-md">
              {[
                { name: 'AI & Machine Learning', slug: 'ai-ml', icon: 'smart_toy', color: 'primary', tasks: 420, minBudget: 0.80, active: true },
                { name: 'Data Entry & Analysis', slug: 'data-entry', icon: 'database', color: 'secondary', tasks: 180, minBudget: 0.80, active: true },
                { name: 'Writing & Translation', slug: 'writing', icon: 'translate', color: 'tertiary', tasks: 159, minBudget: 0.80, active: true },
                { name: 'Design & Creative', slug: 'design', icon: 'palette', color: 'primary', tasks: 110, minBudget: 1.00, active: true },
                { name: 'Development & Tech', slug: 'development', icon: 'terminal', color: 'secondary', tasks: 85, minBudget: 2.00, active: true },
                { name: 'QA & Testing', slug: 'qa', icon: 'bug_report', color: 'tertiary', tasks: 72, minBudget: 0.80, active: true },
                { name: 'Audio/Video Transcription', slug: 'transcription', icon: 'graphic_eq', color: 'primary', tasks: 88, minBudget: 0.80, active: true },
                { name: 'Market Research', slug: 'research', icon: 'insights', color: 'secondary', tasks: 54, minBudget: 1.50, active: true },
                { name: 'Virtual Assistance', slug: 'va', icon: 'support_agent', color: 'tertiary', tasks: 130, minBudget: 0.80, active: true },
              ].map((category) => (
                <Card key={category.slug} variant="outlined" padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
                    <div className="flex items-center gap-space-md">
                      <div className={`w-12 h-12 rounded-lg bg-${category.color}/10 flex items-center justify-center text-${category.color} flex-shrink-0`}>
                        <span className="material-symbols-outlined text-[24px]">{category.icon}</span>
                      </div>
                      <div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">{category.name}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant">{category.tasks} active tasks • Min budget: ${category.minBudget}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-sm">
                      <Badge variant={category.active ? 'secondary' : 'neutral'} size="sm">
                        {category.active ? 'Active' : 'Inactive'}
                      </Badge>
                      <IconButton variant="ghost" size="sm" ariaLabel="Edit category">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </IconButton>
                      <IconButton variant="ghost" size="sm" ariaLabel="Delete category">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </IconButton>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" padding="lg">
          <CardHeader title="Add New Category" />
          <CardContent>
            <form className="space-y-space-md">
              <Input
                label="Category Name"
                type="text"
                placeholder="e.g., Video Editing"
                required
              />

              <Input
                label="Slug"
                type="text"
                placeholder="video-editing"
                required
                helperText="URL-friendly identifier"
              />

              <Select
                label="Icon"
                placeholder="Select icon"
                options={[
                  { value: 'smart_toy', label: 'AI / ML (smart_toy)' },
                  { value: 'database', label: 'Data (database)' },
                  { value: 'translate', label: 'Writing (translate)' },
                  { value: 'palette', label: 'Design (palette)' },
                  { value: 'terminal', label: 'Development (terminal)' },
                  { value: 'bug_report', label: 'QA (bug_report)' },
                  { value: 'graphic_eq', label: 'Audio/Video (graphic_eq)' },
                  { value: 'insights', label: 'Research (insights)' },
                  { value: 'support_agent', label: 'Support (support_agent)' },
                ]}
              />

              <Select
                label="Theme Color"
                placeholder="Select color"
                options={[
                  { value: 'primary', label: 'Primary (Blue)' },
                  { value: 'secondary', label: 'Secondary (Green)' },
                  { value: 'tertiary', label: 'Tertiary (Amber)' },
                ]}
              />

              <Input
                label="Minimum Budget ($)"
                type="number"
                step="0.01"
                min="0.80"
                placeholder="0.80"
                required
              />

              <div className="flex items-center gap-space-sm">
                <input type="checkbox" id="active" className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary" defaultChecked />
                <label htmlFor="active" className="font-body-sm text-body-sm text-on-surface">Active</label>
              </div>

              <Button fullWidth leftIcon={<span className="material-symbols-outlined text-[18px]">add_circle</span>}>
                Create Category
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated" padding="lg" className="mt-space-lg">
        <CardHeader title="Category Settings" />
        <CardContent>
          <div className="grid gap-gutter sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-space-md bg-surface-container rounded-lg">
              <p className="font-label-md text-label-md text-on-surface font-medium">Default Unlock Fee</p>
              <p className="font-currency-stat text-currency-stat text-primary font-bold mt-1">$0.80</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">Applied to all tasks</p>
            </div>
            <div className="p-space-md bg-surface-container rounded-lg">
              <p className="font-label-md text-label-md text-on-surface font-medium">Platform Fee</p>
              <p className="font-currency-stat text-currency-stat text-secondary font-bold mt-1">10%</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">Deducted from task budget</p>
            </div>
            <div className="p-space-md bg-surface-container rounded-lg">
              <p className="font-label-md text-label-md text-on-surface font-medium">Min Task Budget</p>
              <p className="font-currency-stat text-currency-stat text-tertiary font-bold mt-1">$0.80</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">Excluding unlock fee</p>
            </div>
            <div className="p-space-md bg-surface-container rounded-lg">
              <p className="font-label-md text-label-md text-on-surface font-medium">Max Task Budget</p>
              <p className="font-currency-stat text-currency-stat text-on-surface font-bold mt-1">$10,000</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">Per task limit</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageShell>
  );
}