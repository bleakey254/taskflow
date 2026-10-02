import { getCurrentUser } from '@/lib/middleware/auth';

export const metadata = {
  title: 'Available Tasks - TaskFlow',
  description: 'Browse and complete micro-tasks',
};

export default async function WorkerTasksPage() {
  'use server';

  // Get current user (layout already ensured auth and role)
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Available Tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Browse tasks available for completion
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-4">
              {/* Task cards will go here - placeholder for now */}
              <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                {/* This would be populated with actual task data from the database */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="font-medium text-gray-900">Sample Task Title</h3>
                  <p className="mt-2 text-sm text-gray-600">
                    This is a sample task description that would show in the preview.
                    Workers would need to pay $0.80 to unlock the full task details.
                  </p>
                  <div className="mt-4 flex items-center space-x-3">
                    <span className="text-xs text-gray-500">Budget:</span>
                    <span className="font-medium text-indigo-600">$5.00</span>
                  </div>
                  <div className="mt-3">
                    <button
                      className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                      disabled
                    >
                      Unlock Task ($0.80)
                    </button>
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