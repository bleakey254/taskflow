import { requireRole } from '@/lib/middleware/auth';
import { approveTaskSubmission, rejectTaskSubmission } from '@/actions/task';
import { prisma } from '@/lib/prisma';
import { Role, SubmissionStatus } from '@/types/prisma';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = {
  title: 'Task Submissions - TaskFlow',
  description: 'Review, approve or reject work submitted for your task',
};

const statusStyles: Record<string, string> = {
  PENDING: 'bg-blue-100 text-blue-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

export default async function TaskSubmissionsPage({
  params,
  searchParams,
}: {
  params: Promise<{ taskId: string }>;
  searchParams: Promise<{ error?: string; reviewed?: string }>;
}) {
  const { taskId } = await params;
  const { error, reviewed } = await searchParams;

  // Require authentication and CLIENT role
  const user = await requireRole([Role.CLIENT]);

  // Only the client who owns the task may review its submissions.
  const task = await prisma.task.findFirst({
    where: { id: taskId, clientId: user.id },
    select: {
      id: true,
      title: true,
      budget: true,
      currency: true,
      submissions: {
        orderBy: { submittedAt: 'desc' },
        select: {
          id: true,
          content: true,
          status: true,
          submittedAt: true,
          feedback: true,
          worker: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    notFound();
  }

  const approveAction = async (formData: FormData) => {
    'use server';

    try {
      await approveTaskSubmission(undefined, formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not approve this submission';
      redirect(`/client/tasks/${taskId}/submissions?error=${encodeURIComponent(message)}`);
    }

    redirect(`/client/tasks/${taskId}/submissions?reviewed=approved`);
  };

  const rejectAction = async (formData: FormData) => {
    'use server';

    try {
      await rejectTaskSubmission(undefined, formData);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not reject this submission';
      redirect(`/client/tasks/${taskId}/submissions?error=${encodeURIComponent(message)}`);
    }

    redirect(`/client/tasks/${taskId}/submissions?reviewed=rejected`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Task Submissions
                </h2>
                <p className="text-sm text-gray-500 mt-1">{task.title}</p>
              </div>
              <div className="flex items-center space-x-3">
                <Link href="/client/tasks" className="text-sm text-indigo-600 hover:text-indigo-500">
                  ← All Tasks
                </Link>
                <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded">
                  Task ID: {task.id}
                </span>
              </div>
            </div>
          </div>

          <div className="px-6 py-6">
            {reviewed && (
              <p className="mb-4 text-sm text-green-700" role="status">
                Submission {reviewed}. The worker has been notified.
              </p>
            )}
            {error && (
              <p className="mb-4 text-sm text-red-600" role="alert">
                {error}
              </p>
            )}

            {task.submissions.length === 0 ? (
              <p className="text-sm text-gray-500">
                No submissions yet. Workers who unlock this task can submit their work here.
              </p>
            ) : (
              <div className="space-y-4">
                {task.submissions.map((submission) => {
                  const isPending = submission.status === SubmissionStatus.PENDING;

                  return (
                    <div key={submission.id} className="bg-gray-50 p-4 rounded-lg border">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-indigo-700">
                              {submission.worker.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900 mb-1">{submission.worker.name}</h3>
                            <p className="text-sm text-gray-500">
                              Submitted {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 text-xs rounded ${statusStyles[submission.status] ?? 'bg-gray-200 text-gray-800'}`}
                        >
                          {submission.status}
                        </span>
                      </div>

                      <div className="mt-3 p-3 bg-white rounded border">
                        <h4 className="font-medium text-gray-900 mb-2">Submitted Work</h4>
                        <p className="text-gray-700 whitespace-pre-wrap">{submission.content}</p>
                      </div>

                      {isPending ? (
                        <form className="mt-4 space-y-3" action={approveAction}>
                          <input type="hidden" name="submissionId" value={submission.id} />
                          <div>
                            <label
                              htmlFor={`feedback-${submission.id}`}
                              className="block text-sm font-medium text-gray-700 mb-2"
                            >
                              Feedback to Worker
                            </label>
                            <textarea
                              id={`feedback-${submission.id}`}
                              name="feedback"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            ></textarea>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex items-center space-x-2">
                              <label
                                htmlFor={`rating-${submission.id}`}
                                className="text-sm font-medium text-gray-700"
                              >
                                Rating (1-5)
                              </label>
                              <select
                                id={`rating-${submission.id}`}
                                name="rating"
                                className="w-20 rounded-md border-0 py-1 pl-2 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
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
                            <Link
                              href="/client/tasks"
                              className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded hover:bg-gray-300"
                            >
                              Skip
                            </Link>
                            <button
                              type="submit"
                              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                              Approve Submission
                            </button>
                            <button
                              type="submit"
                              formAction={rejectAction}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 ml-2"
                            >
                              Reject Submission
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="mt-3 text-sm text-gray-600">
                          Reviewed
                          {submission.feedback ? `: ${submission.feedback}` : ' — no feedback left.'}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
