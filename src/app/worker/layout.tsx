import type { ReactNode } from 'react';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export default async function WorkerLayout({ children }: { children: ReactNode }) {
  // Require authentication and WORKER role
  await requireAuth();
  await requireRole([Role.WORKER]);

  return <>{children}</>;
}