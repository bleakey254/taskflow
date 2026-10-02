'use server';

import { getCurrentUser } from '@/lib/middleware/auth';
import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';

// Get notifications for the current user
export async function getNotifications() {
  'use server';

  try {
    const user = await requireAuth();

    const notifications = await prisma.notification.findMany({
      where: {
        recipientId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Get recent notifications
    });

    return notifications;
  } catch (error) {
    console.error('Get notifications error:', error);
    return [];
  }
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  'use server';

  try {
    const user = await requireAuth();

    await prisma.notification.update({
      where: {
        id: notificationId,
        recipientId: user.id, // Ensure user can only mark their own notifications
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Mark notification as read error:', error);
    return { success: false, error: 'Failed to mark notification as read' };
  }
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  'use server';

  try {
    const user = await requireAuth();

    await prisma.notification.updateMany({
      where: {
        recipientId: user.id,
        read: false,
      },
      data: {
        read: true,
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    return { success: false, error: 'Failed to mark notifications as read' };
  }
}