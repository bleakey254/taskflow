import { getCurrentUser } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Submission, SubmissionStatus } from '@/types/prisma';

export const metadata = {
  title: 'My Submissions - TaskFlow',
  description: 'View your submitted work and their status',
};

export default async function WorkerSubmissionsPage() {
  'use server';

  // Get current user
  const user = await getCurrentUser();

  if (!user) {
    return <div>Loading...</div>;
  }

  // Get user's submissions
  const submissions = await prisma.submission.findMany({
    where: {
      workerId: user.id,
    },
    include: {
      task: {
        select: {
          id: true,
          title: true,
          budget: true,
          currency: true,
          status: true,
        },
      },
    },
    orderBy: {
      submittedAt: 'desc',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">
              My Submissions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              View your submitted work and their current status
            </p>
          </div>

          <div className="px-6 py-6">
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission: Submission) => (
                  <div key={submission.id} className="border-b py-3 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">W</span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">
                              {submission.task.title}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Submitted {new Date(submission.submittedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <div className={[
                          'px-3 py-1 rounded',
                          submission.status === SubmissionStatus.PENDING ? 'bg-yellow-100' :
                          submission.status === SubmissionStatus.APPROVED ? 'bg-green-100' :
                          submission.status === SubmissionStatus.REJECTED ? 'bg-red-100' :
                          'bg-gray-100'
                        ].join(' ')}>
                          <span className={[
                            'font-medium text-xs',
                            submission.status === SubmissionStatus.PENDING ? 'text-yellow-800' :
                            submission.status === SubmissionStatus.APPROVED ? 'text-green-800' :
                            submission.status === SubmissionStatus.REJECTED ? 'text-red-800' :
                            'text-gray-800'
                          ].join(' ')}>
                            {submission.status === SubmissionStatus.PENDING ? 'PENDING' :
                             submission.status === SubmissionStatus.APPROVED ? 'APPROVED' :
                             submission.status === SubmissionStatus.REJECTED ? 'REJECTED' :
                             'UNKNOWN'}
                          </span>
                        </div>
                        {submission.status === SubmissionStatus.APPROVED && (
                          <div className="mt-2">
                            <span className="text-sm font-medium text-indigo-600">
                              Earned: ${submission.task.budget} {submission.task.currency}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-gray-50 rounded">
                      <h4 className="font-medium text-gray-900 mb-2">Submission Preview</h4>
                      <p className="text-gray-700">
                        {/* Show first 100 characters of content */}
                        {submission.content.length > 100 ?
                          `${submission.content.substring(0, 100)}...` :
                          submission.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  You haven't submitted any work yet. Complete tasks to start earning!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}