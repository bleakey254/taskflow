import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export const generateStaticParams = async () => {
  return [];
};

export default async function TaskSubmissionsPage({
  params,
}: {
  params: { taskId: string };
}) {
  'use server';

  // Require authentication and CLIENT role
  const user = await getCurrentUser();
  await requireRole([Role.CLIENT]);

  if (!user) {
    return <div>Loading...</div>;
  }

  // In a real implementation, we would verify that the client owns this task
  // and fetch the submissions for this task

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Task Submissions
              </h2>
              <div className="flex items-center space-x-3">
                <a href="/client/tasks" className="text-sm text-indigo-600 hover:text-indigo-500">
                  ← All Tasks
                </a>
                <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                  Task ID: {params.taskId}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {/* Submission list would go here */}
            <div className="space-y-4">
              {/* Placeholder submission cards */}
              <div className="bg-gray-50 p-4 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-white">W</span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">Worker Name</h3>
                        <p className="text-sm text-gray-500">Submitted 2 hours ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        PENDING
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <h4 className="font-medium text-gray-900 mb-2">Submitted Work</h4>
                    <p className="text-gray-700">
                      This is where the worker's submitted work would be displayed.
                      It could include text, links to files, or other media.
                    </p>
                  </div>

                  <div className="mt-4">
                    <form className="space-y-3" action={async (formData: FormData) => {
                      'use server';
                      // This would call approve or reject actions
                      // For now, just return void as per Next.js form action convention
                      return;
                    }}>
                      <div>
                        <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
                          Feedback to Worker
                        </label>
                        <textarea
                          id="feedback"
                          name="feedback"
                          rows={3}
                          className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                        ></textarea>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center space-x-2">
                          <label htmlFor="rating" className="text-sm font-medium text-gray-700">
                            Rating (1-5)
                          </label>
                          <select
                            id="rating"
                            name="rating"
                            className="w-20 rounded-md border-0 py-1 pl-2 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600"
                          >
                            <option value="">Select rating</option>
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 star</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => window.history.back()}
                          className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                        >
                          Skip
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 text-white w-auto hover:bg-indigo-700"
                        >
                          Approve Submission
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-red-600 text-white w-auto hover:bg-red-700 ml-2"
                        >
                          Reject Submission
                        </button>
                      </div>
                    </form>
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