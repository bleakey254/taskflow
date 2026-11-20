import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent } from '@/components/layout';
import { Button, IconButton } from '@/components/layout';
import { Badge, StatusBadge } from '@/components/layout';
import Link from 'next/link';

export const metadata = {
  title: 'Audit Logs - TaskFlow Admin',
  description: 'View system audit logs',
};

export default async function AuditLogsPage() {
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
      title="Audit Logs"
      description="View system audit logs and security events"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-lg">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Audit Logs</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">View system audit logs and security events</p>
        </div>
        <div className="flex items-center gap-space-sm">
          <Button variant="outlined" leftIcon={<span className="material-symbols-outlined text-[18px]">filter_list</span>}>
            Filters
          </Button>
          <Button variant="ghost" leftIcon={<span className="material-symbols-outlined text-[18px]">download</span>}>
            Export
          </Button>
        </div>
      </div>

      <Card variant="filled" padding="none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-container">
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Timestamp</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Event Type</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Actor</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Target</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Action</th>
                <th className="p-space-md text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">IP Address</th>
                <th className="p-space-md text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 14:30:22</td>
                <td className="p-space-md">
                  <Badge variant="primary" size="sm">Authentication</Badge>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">admin@taskflow.com</td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">System</td>
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Login</Badge>
                </td>
                <td className="p-space-md font-body-sm text-body-sm font-mono text-on-surface-variant">192.168.1.100</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 14:25:10</td>
                <td className="p-space-md">
                  <Badge variant="tertiary" size="sm">Task Management</Badge>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">admin@taskflow.com</td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface">Task #1245</td>
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Approved</Badge>
                </td>
                <td className="p-space-md font-body-sm text-body-sm font-mono text-on-surface-variant">192.168.1.100</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 14:10:45</td>
                <td className="p-space-md">
                  <Badge variant="error" size="sm">Security</Badge>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">john@example.com</td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface">Account Settings</td>
                <td className="p-space-md">
                  <Badge variant="error" size="sm">Failed Login</Badge>
                </td>
                <td className="p-space-md font-body-sm text-body-sm font-mono text-on-surface-variant">203.0.113.45</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 13:55:30</td>
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Financial</Badge>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">admin@taskflow.com</td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface">Withdrawal #789</td>
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Processed</Badge>
                </td>
                <td className="p-space-md font-body-sm text-body-sm font-mono text-on-surface-variant">192.168.1.100</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="border-b border-outline-variant/50 hover:bg-surface-container transition-colors">
                <td className="p-space-md font-body-sm text-body-sm text-on-surface-variant">2024-01-15 13:40:15</td>
                <td className="p-space-md">
                  <Badge variant="primary" size="sm">User Management</Badge>
                </td>
                <td className="p-space-md font-body-md text-body-md text-on-surface">admin@taskflow.com</td>
                <td className="p-space-md font-body-sm text-body-sm text-on-surface">User #456</td>
                <td className="p-space-md">
                  <Badge variant="secondary" size="sm">Verified</Badge>
                </td>
                <td className="p-space-md font-body-sm text-body-sm font-mono text-on-surface-variant">192.168.1.100</td>
                <td className="p-space-md text-right">
                  <IconButton variant="ghost" size="sm" ariaLabel="View details">
                    <span className="material-symbols-outlined text-[20px]">visibility</span>
                  </IconButton>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors">
                <td className="p-space-md text-center text-on-surface-variant" colSpan={7}>
                  <div className="py-space-xl">
                    <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">history</span>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">No more audit logs</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="p-space-md border-t border-outline-variant flex items-center justify-between">
          <p className="font-body-sm text-body-sm text-on-surface-variant">Showing 1 to 5 of 5 results</p>
          <div className="flex items-center gap-space-sm">
            <Button variant="ghost" size="sm" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </Button>
            <Button variant="ghost" size="sm" disabled>
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Button>
          </div>
        </div>
      </Card>
    </PageShell>
  );
}