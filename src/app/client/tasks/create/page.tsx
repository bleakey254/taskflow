import { createTask } from '@/actions/task';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export const metadata = {
  title: 'Create Task - TaskFlow',
  description: 'Create a new micro-task',
};

export default async function CreateTaskPage() {
  'use server';

  // Require authentication and CLIENT role
  const user = await getCurrentUser();
  await requireRole([Role.CLIENT]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Task
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Create a task that workers can complete for ${formattedBudget}
            </p>
          </div>

          <form className="px-6 py-6 space-y-6" action={async (formData: FormData) => {
            'use server';
            await createTask(undefined, formData);
            // Redirect to task list or show success message
            // For now, we'll just return void as per Next.js form action convention
          }}>
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  maxLength={100}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Task Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
              </div>

              <div>
                <label htmlFor="previewDescription" className="block text-sm font-medium text-gray-700 mb-2">
                  Preview Description (what workers see before paying)
                </label>
                <textarea
                  id="previewDescription"
                  name="previewDescription"
                  rows={3}
                  required
                  maxLength={200}
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                ></textarea>
              </div>

              <div className="space-y-3">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  id="categoryId"
                  name="categoryId"
                  required
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a category</option>
                  {/* Categories will be populated dynamically or hardcoded for now */}
                  <option value="design">Design</option>
                  <option value="development">Development</option>
                  <option value="writing">Writing & Translation</option>
                  <option value="marketing">Marketing & Social Media</option>
                  <option value="data">Data Entry & Analysis</option>
                  <option value="video">Video & Animation</option>
                  <option value="music">Music & Audio</option>
                  <option value="business">Business & Consulting</option>
                </select>
              </div>

              <div className="space-y-3">
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <div className="flex items-center">
                  <span className="mr-2 text-gray-900">$</span>
                  <input
                    id="budget"
                    name="budget"
                    type="number"
                    step="0.01"
                    min="0.80"
                    required
                    className="w-32 rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Minimum budget is $0.80 (the unlock fee)
                </p>
              </div>

              <div className="space-y-3">
                <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline (optional)
                </label>
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
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
                Create Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Helper function to format budget (placeholder)
const formattedBudget = "0.80";