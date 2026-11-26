'use server';

import { revalidatePath } from 'next/cache';
import { requireAuth } from '@/lib/middleware/auth';
import { prisma } from '@/lib/prisma';

// Get notifications for the current user
export async function getNotifications() {
  'use server';

  const user = await requireAuth();

  return prisma.notification.findMany({
    where: { recipientId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}

// Mark notification as read
export async function markNotificationAsRead(notificationId: string) {
  'use server';

  const user = await requireAuth();

  const updated = await prisma.notification.updateMany({
    where: { id: notificationId, recipientId: user.id },
    data: { read: true },
  });

  revalidatePath('/worker/notifications');

  return { success: updated.count > 0 };
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  'use server';

  const user = await requireAuth();

  await prisma.notification.updateMany({
    where: { recipientId: user.id, read: false },
    data: { read: true },
  });

  revalidatePath('/worker/notifications');
}
