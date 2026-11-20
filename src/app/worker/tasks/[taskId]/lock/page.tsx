import { getCurrentUser } from '@/lib/middleware/auth';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';
import { TaskLockClient } from './TaskLockClient';

export default async function TaskLockPage({
  params,
}: {
  params: { taskId: string };
}) {
  const user = await getCurrentUser();
  await requireRole([Role.WORKER]);

  if (!user) {
    return <div>Loading...</div>;
  }

  const taskId = params.taskId;

  // In a real app, you'd fetch task preview data here
  const taskPreview = {
    title: 'AI Data Annotation: Bounding Box Vehicle Tags',
    category: 'AI & Machine Learning',
    rating: 4.9,
    previewDescription: 'Label 40 street photography scenes with multi-class vehicle segmentation polygons according to standard taxonomy.',
    budget: 5.00,
    currency: 'USD',
    slotsLeft: 42,
    unlockedCount: 73,
    clientVerified: true,
  };

  return <TaskLockClient user={user} taskPreview={taskPreview} />;
}