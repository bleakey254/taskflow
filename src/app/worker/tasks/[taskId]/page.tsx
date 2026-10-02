import { getTaskDetails } from '@/actions/task';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { redirect } from 'next/navigation';
import { Role } from '@/types/prisma';

export const generateStaticParams = async () => {
  return [];
};

export default async function TaskDetailsPage({
  params,
}: {
  params: { taskId: string };
}) {
  'use server';

  // Require authentication and WORKER role
  const user = await getCurrentUser();
  await requireRole([Role.WORKER]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const taskId = params.taskId;

  // Get task details (requires unlock)
  const task = await getTaskDetails(taskId, user.id);

  // If task is null, user hasn't unlocked it or doesn't have access
  if (!task) {
    redirect(`/worker/tasks/${taskId}/lock`);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                {task.title}
              </h2>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-gray-500">Budget:</span>
                <span className="font-medium text-indigo-600">
                  ${task.budget} {task.currency}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Task Description
                </h3>
                <p className="text-gray-700">{task.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Requirements
                </h3>
                {/* In a real app, this would be parsed from JSON or rich text */}
                <p className="text-gray-700">
                  Detailed requirements would go here. This is where the client
                  specifies exactly what they need delivered.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Submission
                </h3>
                <form className="space-y-4" action={async (formData: FormData) => {
                  'use server';
                  // This would call a submit action
                  // For now, we'll just return void as per Next.js form action convention
                }}>
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Your Work
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      rows={8}
                      required
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                    ></textarea>
                  </div>

                  <div>
                    <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-2">
                      Attachments (optional)
                    </label>
                    <input
                      id="attachments"
                      name="attachments"
                      type="text"
                      placeholder='JSON array of file URLs, e.g., ["https://example.com/file1.jpg"]'
                      className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Provide attachments as a JSON array of URLs
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => window.history.back()}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                    >
                      Go Back
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Submit Work
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading page for this route
export async function generateMetadata() {
  return {
    title: 'Task Details - TaskFlow',
    description: 'View full task details and submit work',
  };
}