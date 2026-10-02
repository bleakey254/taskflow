import { getCurrentUser } from '@/lib/middleware/auth';
import { logoutUser } from '@/actions/auth';
import { Role } from '@/types/prisma';

export default async function DashboardPage() {
  'use server';

  const user = await getCurrentUser();

  if (!user) {
    // This shouldn't happen due to middleware, but just in case
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center border-b pb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-indigo-600">
                  <span className="text-sm font-medium text-white">
                    {user.name?.charAt(0) ?? 'U'}
                  </span>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.role}</div>
                </div>
              </div>

              <form action={async (formData: FormData) => {
                'use server';
                return await logoutUser(undefined, formData);
              }} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-500">
                Sign out
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Worker stats */}
            {user.role === Role.WORKER && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Your Earnings
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">
                    $0.00
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    Total completed tasks
                  </p>
                </div>
              </div>
            )}

            {/* Client stats */}
            {user.role === Role.CLIENT && (
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Active Tasks
                  </h3>
                  <p className="mt-2 text-3xl font-bold text-indigo-600">
                    0
                  </p>
                  <p className="mt-4 text-sm text-gray-500">
                    Tasks currently in progress
                  </p>
                </div>
              </div>
            )}

            {/* Common stats */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  Account Status
                </h3>
                <p className="mt-2 text-3xl font-bold text-indigo-600">
                  Active
                </p>
                <p className="mt-4 text-sm text-gray-500">
                  Your account is in good standing
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="bg-white rounded-lg shadow">
              <div className="p-6">
                <p className="text-sm text-gray-500">
                  No recent activity to display.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}