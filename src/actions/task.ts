'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';
import { Role, TaskStatus, SubmissionStatus } from '@/types/prisma';

// Task creation action
export async function createTask(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  try {
    // Require authentication and CLIENT role
    const user = await requireAuth();
    await requireRole([Role.CLIENT]);

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const previewDescription = formData.get('previewDescription') as string;
    const categoryId = formData.get('categoryId') as string;
    const budget = formData.get('budget') as string;
    const deadlineStr = formData.get('deadline') as string | null;

    // Basic validation
    if (!title || !description || !previewDescription || !categoryId || !budget) {
      // In a real app, we'd return field errors somehow
      // For now, we'll just throw an error or handle it client-side
      throw new Error('All fields are required');
    }

    const budgetDecimal = parseFloat(budget);
    if (isNaN(budgetDecimal) || budgetDecimal <= 0) {
      throw new Error('Budget must be a positive number');
    }

    let deadline: Date | undefined;
    if (deadlineStr) {
      deadline = new Date(deadlineStr);
      if (isNaN(deadline.getTime())) {
        throw new Error('Invalid deadline date');
      }
    }

    // Create task
    const task = await prisma.task.create({
      data: {
        title,
        description,
        previewDescription,
        categoryId,
        budget: budgetDecimal,
        currency: 'USD',
        clientId: user.id,
        status: TaskStatus.DRAFT, // Start in draft status
        deadline,
      },
    });

    // Redirect to task list or show success message
    // For now, we'll just return void as the action completed successfully
    return;
  } catch (error) {
    console.error('Task creation error:', error);
    // In a real app, we'd handle form errors properly
    // For now, we'll just throw the error
    throw error;
  }
}

// Task submission action
export async function submitTask(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  try {
    // Require authentication and WORKER role
    const user = await requireAuth();
    await requireRole([Role.WORKER]);

    const taskId = formData.get('taskId') as string;
    const content = formData.get('content') as string;
    const attachmentsStr = formData.get('attachments') as string | null;

    // Basic validation
    if (!taskId || !content) {
      throw new Error('Task ID and content are required');
    }

    // Check if task exists and is unlocked by this worker
    const taskUnlock = await prisma.taskUnlock.findFirst({
      where: {
        taskId,
        workerId: user.id,
      },
      include: {
        task: true,
      },
    });

    if (!taskUnlock) {
      throw new Error('You must unlock this task before submitting work');
    }

    // Check if task is in a state that allows submission
    const allowedStatuses = [TaskStatus.UNLOCKED, TaskStatus.IN_PROGRESS];
    if (!allowedStatuses.includes(taskUnlock.task.status)) {
      throw new Error('This task is not available for submission');
    }

    // Parse attachments if provided
    let attachments: unknown = undefined;
    if (attachmentsStr) {
      try {
        attachments = JSON.parse(attachmentsStr);
      } catch (e) {
        // If parsing fails, treat as no attachments
        attachments = undefined;
      }
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        taskId,
        workerId: user.id,
        content,
        attachments,
        status: SubmissionStatus.PENDING,
      },
    });

    // Update task status to IN_PROGRESS if it was UNLOCKED
    if (taskUnlock.task.status === TaskStatus.UNLOCKED) {
      await prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.IN_PROGRESS },
      });
    }

    return;
  } catch (error) {
    console.error('Task submission error:', error);
    throw error;
  }
}

// Task approval action (for clients/reviewers)
export async function approveTaskSubmission(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  try {
    // Require authentication
    const user = await requireAuth();
    // Allow CLIENT (task owner) or ADMIN to approve
    const userRole = user.role;

    const submissionId = formData.get('submissionId') as string;
    const feedback = formData.get('feedback') as string | null;
    const ratingStr = formData.get('rating') as string | null;

    // Basic validation
    if (!submissionId) {
      throw new Error('Submission ID is required');
    }

    // Get submission with task and worker info
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: {
            client: true,
          },
        },
        worker: true,
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Check authorization: client must own the task, or user must be admin
    const isTaskOwner = submission.task.clientId === user.id;
    const isAdmin = userRole === 'ADMIN';

    if (!isTaskOwner && !isAdmin) {
      throw new Error('Unauthorized to approve this submission');
    }

    // Check if submission is pending
    if (submission.status !== SubmissionStatus.PENDING) {
      throw new Error('Only pending submissions can be approved');
    }

    // Parse rating if provided
    let rating: number | undefined;
    if (ratingStr) {
      const ratingNum = parseInt(ratingStr, 10);
      if (!isNaN(ratingNum) && ratingNum >= 1 && ratingNum <= 5) {
        rating = ratingNum;
      }
    }

    // Create submission review
    await prisma.submissionReview.create({
      data: {
        submissionId,
        reviewerId: user.id,
        feedback,
        rating,
      },
    });

    // Update submission status
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.APPROVED,
        reviewedAt: new Date(),
        reviewerId: user.id,
        feedback,
      },
    });

    // Update task status to COMPLETED
    await prisma.task.update({
      where: { id: submission.taskId },
      data: { status: TaskStatus.COMPLETED, completedAt: new Date() },
    });

    // TODO: Create wallet transaction for worker earnings
    // This would typically be handled by a separate process or webhook
    // For now, we'll note that earnings should be added to wallet

    return;
  } catch (error) {
    console.error('Task approval error:', error);
    throw error;
  }
}

// Task rejection action (for clients/reviewers)
export async function rejectTaskSubmission(
  prevState: unknown | undefined,
  formData: FormData
): Promise<void> {
  'use server';

  try {
    // Require authentication
    const user = await requireAuth();
    // Allow CLIENT (task owner) or ADMIN to reject
    const userRole = user.role;

    const submissionId = formData.get('submissionId') as string;
    const feedback = formData.get('feedback') as string | null;

    // Basic validation
    if (!submissionId) {
      throw new Error('Submission ID is required');
    }

    // Get submission with task and worker info
    const submission = await prisma.submission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: {
            client: true,
          },
        },
        worker: true,
      },
    });

    if (!submission) {
      throw new Error('Submission not found');
    }

    // Check authorization: client must own the task, or user must be admin
    const isTaskOwner = submission.task.clientId === user.id;
    const isAdmin = userRole === 'ADMIN';

    if (!isTaskOwner && !isAdmin) {
      throw new Error('Unauthorized to reject this submission');
    }

    // Check if submission is pending
    if (submission.status !== SubmissionStatus.PENDING) {
      throw new Error('Only pending submissions can be rejected');
    }

    // Update submission status
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.REJECTED,
        reviewedAt: new Date(),
        reviewerId: user.id,
        feedback,
      },
    });

    // Update task status back to UNLOCKED so worker can try again
    await prisma.task.update({
      where: { id: submission.taskId },
      data: { status: TaskStatus.UNLOCKED },
    });

    return;
  } catch (error) {
    console.error('Task rejection error:', error);
    throw error;
  }
}

// Get task for preview (publicly available)
export async function getTaskPreview(taskId: string) {
  'use server';

  try {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        id: true,
        title: true,
        previewDescription: true,
        budget: true,
        currency: true,
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

    if (!task) {
      return null;
    }

    return task;
  } catch (error) {
    console.error('Get task preview error:', error);
    return null;
  }
}

// Get full task details (requires unlock)
export async function getTaskDetails(taskId: string, workerId: string) {
  'use server';

  try {
    // Check if worker has unlocked this task
    const taskUnlock = await prisma.taskUnlock.findFirst({
      where: {
        taskId,
        workerId,
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

    return taskUnlock.task;
  } catch (error) {
    console.error('Get task details error:', error);
    return null;
  }
}