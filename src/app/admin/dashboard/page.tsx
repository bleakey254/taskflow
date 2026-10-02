import { getAdminStats } from '@/actions/admin';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export const metadata = {
  title: 'Admin Dashboard - TaskFlow',
  description: 'Overview of platform statistics',
};

export default async function AdminDashboardPage() {
  'use server';

  // Require authentication and ADMIN role
  const user = await getCurrentUser();
  await requireRole([Role.ADMIN]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get admin statistics
  const stats = await getAdminStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Dashboard
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Platform overview and statistics
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Users Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Users
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Users</span>
                    <span className="font-medium text-gray-900">{stats.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Active Users</span>
                    <span className="font-medium text-indigo-600">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Workers</span>
                    <span className="font-medium text-gray-900">{stats.totalWorkers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Clients</span>
                    <span className="font-medium text-gray-900">{stats.totalClients}</span>
                  </div>
                </div>
              </div>

              {/* Tasks Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Tasks
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Tasks</span>
                    <span className="font-medium text-gray-900">{stats.totalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending Approval</span>
                    <span className="font-medium text-indigo-600">{stats.pendingApprovalTasks}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed Tasks</span>
                    <span className="font-medium text-gray-900">{stats.completedTasks}</span>
                  </div>
                </div>
              </div>

              {/* Submissions Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Submissions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Submissions</span>
                    <span className="font-medium text-gray-900">{stats.totalSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending Review</span>
                    <span className="font-medium text-indigo-600">{stats.pendingSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Approved</span>
                    <span className="font-medium text-gray-900">{stats.approvedSubmissions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Rejected</span>
                    <span className="font-medium text-gray-900">{stats.rejectedSubmissions}</span>
                  </div>
                </div>
              </div>

              {/* Withdrawals Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Withdrawals
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Withdrawals</span>
                    <span className="font-medium text-gray-900">{stats.totalWithdrawals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending</span>
                    <span className="font-medium text-indigo-600">{stats.pendingWithdrawals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Completed</span>
                    <span className="font-medium text-gray-900">{stats.completedWithdrawals}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Failed</span>
                    <span className="font-medium text-gray-900">{stats.failedWithdrawals}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Second row of statistics */}
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Disputes Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Disputes
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Disputes</span>
                    <span className="font-medium text-gray-900">{stats.totalDisputes}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Open Disputes</span>
                    <span className="font-medium text-indigo-600">{stats.openDisputes}</span>
                  </div>
                </div>
              </div>

              {/* Placeholder for additional metrics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Platform Health
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Uptime</span>
                    <span className="font-medium text-gray-900">99.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Avg. Response Time</span>
                    <span className="font-medium text-gray-900">120ms</span>
                  </div>
                </div>
              </div>

              {/* Financial Statistics */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Financials
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Volume</span>
                    <span className="font-medium text-gray-900">$0.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Pending Payouts</span>
                    <span className="font-medium text-indigo-600">$0.00</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity Placeholder */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  <div className="text-center py-4">
                    <p className="text-sm text-gray-500">
                      Recent activity would be displayed here in a production environment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}