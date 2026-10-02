import { getTaskPreview } from '@/actions/task';
import { initiateTaskUnlockPayment } from '@/actions/payment';
import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { redirect } from 'next/navigation';
import { Role } from '@/types/prisma';

export const generateStaticParams = async () => {
  return [];
};

export default async function TaskUnlockPage({
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

  // Get task preview (what everyone can see)
  const task = await getTaskPreview(taskId);

  // If task doesn't exist, show error
  if (!task) {
    redirect('/worker/tasks');
  }

  // Check if user already unlocked this task
  // In a real implementation, we'd check the database here
  // For now, we'll rely on the payment action to prevent duplicate unlocks

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Unlock Task
              </h2>
              <a href={`/worker/tasks/${taskId}`} className="text-sm text-indigo-600 hover:text-indigo-500">
                ← Back to Tasks
              </a>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Unlock this task for $0.80
              </h3>

              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p>
                    By unlocking this task, you'll get access to the full task
                    description and requirements. After completing the work,
                    you'll submit it for review and earn the task budget upon
                    approval.
                  </p>
                  <p className="mt-2">
                    The $0.80 unlock fee goes to TaskFlow to maintain the
                    platform and ensure quality task listings.
                  </p>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">Task Budget:</span>
                    <span className="font-medium text-indigo-600">
                      ${task.budget} {task.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">Unlock Fee:</span>
                    <span className="font-medium text-indigo-600">$0.80</span>
                  </div>
                </div>
              </div>

              {/* Payment initiation form */}
              <form className="mt-6 space-y-4" action={async (formData: FormData) => {
                'use server';
                const result = await initiateTaskUnlockPayment(undefined, formData);

                if (result.success && result.redirectUrl) {
                  return redirect(result.redirectUrl);
                }

                // If there was an error, we'd want to show it
                // For now, we'll just redirect back to show the form again
                // In a real implementation, we'd return the error to display
                return redirect(`/worker/tasks/${taskId}/lock`);
              }}>
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    M-Pesa Phone Number
                  </label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="e.g., +2547XXXXXXXX"
                    required
                    className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus-ring-inset focus-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => window.history.back()}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white w-auto hover:bg-indigo-700"
                  >
                    Pay $0.80 & Unlock Task
                  </button>
                </div>

                {/* In a real implementation, we'd display form errors here */}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}