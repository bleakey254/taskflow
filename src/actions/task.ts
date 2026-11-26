'use server';

import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { MIN_TASK_BUDGET, CURRENCY } from '@/lib/constants';
import { Role, TaskStatus, SubmissionStatus, NotificationType } from '@/types/prisma';

// Task creation action (creates a DRAFT: the client publishes it afterwards)
export async function createTask(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const user = await requireRole([Role.CLIENT]);

  const title = (formData.get('title') as string | null)?.trim();
  const description = (formData.get('description') as string | null)?.trim();
  const previewDescription = (formData.get('previewDescription') as string | null)?.trim();
  const categoryId = formData.get('categoryId') as string | null;
  const budget = formData.get('budget') as string | null;
  const deadlineStr = formData.get('deadline') as string | null;

  if (!title || !description || !previewDescription || !categoryId || !budget) {
    throw new Error('All fields are required');
  }

  if (previewDescription.length > 200) {
    throw new Error('Preview description must be 200 characters or fewer');
  }

  const budgetValue = Number(budget);
  if (!Number.isFinite(budgetValue) || budgetValue < MIN_TASK_BUDGET) {
    throw new Error(`Budget must be at least $${MIN_TASK_BUDGET.toFixed(2)}`);
  }

  // The category id comes from the database, so a stale or tampered value must
  // fail here with a readable message instead of a foreign-key error.
  const category = await prisma.taskCategory.findUnique({ where: { id: categoryId } });
  if (!category) {
    throw new Error('Choose a valid category');
  }

  let deadline: Date | undefined;
  if (deadlineStr) {
    deadline = new Date(deadlineStr);
    if (Number.isNaN(deadline.getTime())) {
      throw new Error('Invalid deadline date');
    }
  }

  try {
    await prisma.task.create({
      data: {
        title,
        description,
        previewDescription,
        categoryId: category.id,
        budget: budgetValue,
        currency: CURRENCY,
        clientId: user.id,
        status: TaskStatus.DRAFT,
        deadline,
      },
    });
  } catch (error) {
    console.error('Task creation error:', error);
    throw new Error('Could not create the task');
  }
}

// Publish a draft so workers can see and unlock it
export async function publishTask(formData: FormData): Promise<void> {
  'use server';

  const user = await requireRole([Role.CLIENT]);
  const taskId = formData.get('taskId') as string | null;

  if (!taskId) {
    throw new Error('Task id is required');
  }

  const task = await prisma.task.findFirst({ where: { id: taskId, clientId: user.id } });
  if (!task) {
    throw new Error('Task not found');
  }

  if (task.status !== TaskStatus.DRAFT) {
    throw new Error('Only draft tasks can be published');
  }

  await prisma.task.update({
    where: { id: task.id },
    data: { status: TaskStatus.PUBLISHED, publishedAt: new Date() },
  });
}

// Task submission action
export async function submitTask(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const user = await requireRole([Role.WORKER]);

  const taskId = formData.get('taskId') as string | null;
  const content = (formData.get('content') as string | null)?.trim();
  const attachmentsStr = formData.get('attachments') as string | null;

  if (!taskId || !content) {
    throw new Error('Task ID and content are required');
  }

  const taskUnlock = await prisma.taskUnlock.findFirst({
    where: { taskId, workerId: user.id },
    include: { task: true },
  });

  if (!taskUnlock) {
    throw new Error('You must unlock this task before submitting work');
  }

  // Progress is tracked on the unlock, not on the shared task row.
  const unlockStatus = taskUnlock.status as TaskStatus;
  if (![TaskStatus.UNLOCKED, TaskStatus.IN_PROGRESS].includes(unlockStatus)) {
    throw new Error('Your submission for this task is already waiting for review');
  }

  const closedTaskStatuses = [TaskStatus.COMPLETED, TaskStatus.CANCELLED, TaskStatus.DISPUTED];
  if (closedTaskStatuses.includes(taskUnlock.task.status as TaskStatus)) {
    throw new Error('This task is no longer accepting work');
  }

  const pendingSubmission = await prisma.submission.findFirst({
    where: { taskId, workerId: user.id, status: SubmissionStatus.PENDING },
  });

  if (pendingSubmission) {
    throw new Error('You already have a submission waiting for review');
  }

  let attachments: unknown = undefined;
  if (attachmentsStr) {
    try {
      attachments = JSON.parse(attachmentsStr);
    } catch {
      throw new Error('Attachments must be a JSON array of URLs');
    }
  }

  try {
    await prisma.$transaction([
      prisma.submission.create({
        data: {
          taskId,
          workerId: user.id,
          content,
          attachments: attachments as never,
          status: SubmissionStatus.PENDING,
        },
      }),
      prisma.taskUnlock.update({
        where: { id: taskUnlock.id },
        data: { status: TaskStatus.IN_PROGRESS },
      }),
      prisma.task.updateMany({
        where: {
          id: taskId,
          status: { in: [TaskStatus.PUBLISHED, TaskStatus.VIEWED, TaskStatus.UNLOCKED] },
        },
        data: { status: TaskStatus.IN_PROGRESS },
      }),
    ]);
  } catch (error) {
    console.error('Task submission error:', error);
    throw new Error('Could not submit your work');
  }
}

// Task approval action (for clients/reviewers)
export async function approveTaskSubmission(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const user = await requireAuth();

  const submissionId = formData.get('submissionId') as string | null;
  const feedback = (formData.get('feedback') as string | null) ?? '';
  const ratingStr = formData.get('rating') as string | null;

  if (!submissionId) {
    throw new Error('Submission ID is required');
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  const isTaskOwner = submission.task.clientId === user.id;
  const isAdmin = user.role === Role.ADMIN;

  if (!isTaskOwner && !isAdmin) {
    throw new Error('Unauthorized to approve this submission');
  }

  if (submission.status !== SubmissionStatus.PENDING) {
    throw new Error('Only pending submissions can be approved');
  }

  let rating: number | undefined;
  if (ratingStr) {
    const ratingNum = parseInt(ratingStr, 10);
    if (!Number.isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
      rating = ratingNum;
    }
  }

  const payout = submission.task.budget;
  const reviewerId = user.id;

  try {
    await prisma.$transaction(async (tx) => {
      // Atomically claim the submission: a second concurrent approval finds
      // nothing pending and must not credit the wallet twice.
      const claimed = await tx.submission.updateMany({
        where: { id: submissionId, status: SubmissionStatus.PENDING },
        data: {
          status: SubmissionStatus.APPROVED,
          reviewedAt: new Date(),
          reviewerId,
          feedback,
        },
      });

      if (claimed.count === 0) {
        throw new Error('Only pending submissions can be approved');
      }

      await tx.submissionReview.create({
        data: {
          submissionId,
          reviewerId,
          feedback,
          rating,
        },
      });

      // Mark the worker's own progress and complete the task.
      await tx.taskUnlock.updateMany({
        where: { taskId: submission.taskId, workerId: submission.workerId },
        data: { status: TaskStatus.COMPLETED },
      });

      await tx.task.update({
        where: { id: submission.taskId },
        data: { status: TaskStatus.COMPLETED, completedAt: new Date() },
      });

      // Pay the worker: balance and ledger move together, or not at all.
      const wallet = await tx.wallet.upsert({
        where: { workerId: submission.workerId },
        update: {},
        create: { workerId: submission.workerId },
      });

      await tx.wallet.update({
        where: { id: wallet.id },
        data: { balance: { increment: payout } },
      });

      await tx.walletTransaction.create({
        data: {
          walletId: wallet.id,
          type: 'TASK_EARNING',
          amount: payout,
          referenceId: submission.id,
          referenceType: 'Submission',
          metadata: { taskId: submission.taskId, title: submission.task.title },
        },
      });

      // The task is finished, so other workers cannot be paid for it too.
      const otherPending = await tx.submission.findMany({
        where: {
          taskId: submission.taskId,
          status: SubmissionStatus.PENDING,
          id: { not: submissionId },
        },
        select: { id: true, workerId: true },
      });

      if (otherPending.length > 0) {
        await tx.submission.updateMany({
          where: { id: { in: otherPending.map((item) => item.id) } },
          data: {
            status: SubmissionStatus.REJECTED,
            reviewedAt: new Date(),
            reviewerId,
            feedback: 'Another submission for this task was accepted.',
          },
        });

        await tx.taskUnlock.updateMany({
          where: {
            taskId: submission.taskId,
            workerId: { in: otherPending.map((item) => item.workerId) },
          },
          data: { status: TaskStatus.REJECTED },
        });

        await tx.notification.createMany({
          data: otherPending.map((item) => ({
            recipientId: item.workerId,
            type: NotificationType.TASK_REJECTED,
            title: 'Task already completed',
            message: `Another submission for "${submission.task.title}" was accepted, so your submission was closed.`,
            relatedEntityType: 'Submission',
            relatedEntityId: item.id,
          })),
        });
      }

      await tx.notification.create({
        data: {
          recipientId: submission.workerId,
          type: NotificationType.TASK_APPROVED,
          title: 'Submission approved',
          message: `Your work on "${submission.task.title}" was approved and $${Number(payout.toString()).toFixed(2)} was added to your wallet.`,
          relatedEntityType: 'Task',
          relatedEntityId: submission.taskId,
        },
      });
    });
  } catch (error) {
    console.error('Task approval error:', error);
    if (error instanceof Error && error.message.startsWith('Only pending')) {
      throw error;
    }
    throw new Error('Could not approve this submission');
  }
}

// Task rejection action (for clients/reviewers)
export async function rejectTaskSubmission(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  const user = await requireAuth();

  const submissionId = formData.get('submissionId') as string | null;
  const feedback = (formData.get('feedback') as string | null) || '';

  if (!submissionId) {
    throw new Error('Submission ID is required');
  }

  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
    include: { task: true },
  });

  if (!submission) {
    throw new Error('Submission not found');
  }

  const isTaskOwner = submission.task.clientId === user.id;
  const isAdmin = user.role === Role.ADMIN;

  if (!isTaskOwner && !isAdmin) {
    throw new Error('Unauthorized to reject this submission');
  }

  if (submission.status !== SubmissionStatus.PENDING) {
    throw new Error('Only pending submissions can be rejected');
  }

  try {
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.submission.updateMany({
        where: { id: submissionId, status: SubmissionStatus.PENDING },
        data: {
          status: SubmissionStatus.REJECTED,
          reviewedAt: new Date(),
          reviewerId: user.id,
          feedback,
        },
      });

      if (claimed.count === 0) {
        throw new Error('Only pending submissions can be rejected');
      }

      // Let this worker try again on the same unlock.
      await tx.taskUnlock.updateMany({
        where: { taskId: submission.taskId, workerId: submission.workerId },
        data: { status: TaskStatus.UNLOCKED },
      });

      await tx.task.updateMany({
        where: { id: submission.taskId, status: TaskStatus.IN_PROGRESS },
        data: { status: TaskStatus.UNLOCKED },
      });

      await tx.notification.create({
        data: {
          recipientId: submission.workerId,
          type: NotificationType.TASK_REJECTED,
          title: 'Submission rejected',
          message: feedback
            ? `Your work on "${submission.task.title}" was rejected: ${feedback}`
            : `Your work on "${submission.task.title}" was rejected. You can submit again.`,
          relatedEntityType: 'Submission',
          relatedEntityId: submission.id,
        },
      });
    });
  } catch (error) {
    console.error('Task rejection error:', error);
    if (error instanceof Error && error.message.startsWith('Only pending')) {
      throw error;
    }
    throw new Error('Could not reject this submission');
  }
}

// Unlockable statuses are the ones a worker may pay to open
const UNLOCKABLE_STATUSES = [
  TaskStatus.PUBLISHED,
  TaskStatus.VIEWED,
  TaskStatus.UNLOCKED,
  TaskStatus.IN_PROGRESS,
];

// Get task for preview (visible to any signed-in worker, no full description)
export async function getTaskPreview(taskId: string) {
  'use server';

  try {
    const task = await prisma.task.findFirst({
      where: { id: taskId, status: { in: UNLOCKABLE_STATUSES } },
      select: {
        id: true,
        title: true,
        previewDescription: true,
        budget: true,
        currency: true,
        status: true,
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        _count: {
          select: {
            unlocks: true,
          },
        },
      },
    });

    return task ?? null;
  } catch (error) {
    console.error('Get task preview error:', error);
    return null;
  }
}

// Get full task details for the current session user (requires unlock)
export async function getTaskDetails(taskId: string) {
  'use server';

  // Derive the worker from the session. Never trust a caller-supplied id.
  const user = await requireAuth();

  try {
    const taskUnlock = await prisma.taskUnlock.findFirst({
      where: {
        taskId,
        workerId: user.id,
      },
      include: {
        task: {
          include: {
            client: {
              select: {
                id: true,
                name: true,
              },
            },
            category: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!taskUnlock) {
      return null; // Not authorized
    }

    const pendingSubmission = await prisma.submission.findFirst({
      where: { taskId, workerId: user.id, status: SubmissionStatus.PENDING },
      select: { id: true, submittedAt: true },
    });

    return {
      ...taskUnlock.task,
      unlockStatus: taskUnlock.status as TaskStatus,
      pendingSubmission,
    };
  } catch (error) {
    console.error('Get task details error:', error);
    return null;
  }
}
