import { getCurrentUser } from '@/lib/middleware/auth';

export const metadata = {
  title: 'My Tasks - TaskFlow',
  description: 'View and manage your posted tasks',
};

export default async function ClientTasksPage() {
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
              My Tasks
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your posted tasks
            </p>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => window.location.href = '/client/tasks/create'}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  + Create New Task
                </button>
              </div>

              {/* Task list would go here */}
              <div className="space-y-4">
                {/* Placeholder task cards */}
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">Sample Task Title</h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Sample task description that was posted by a client.
                      </p>
                    </div>
                    <div className="text-center space-y-2">
                      <div className="text-sm font-medium text-gray-900">
                        $5.00
                      </div>
                      <div className="text-xs text-gray-500">
                        Budget
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">Status:</span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        COMPLETED
                      </span>
                    </div>

                    <div className="mt-2 flex justify-end space-x-3">
                      <button
                        className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                      >
                        View Details
                      </button>
                      <button
                        className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                      >
                        View Submissions
                      </button>
                    </div>
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