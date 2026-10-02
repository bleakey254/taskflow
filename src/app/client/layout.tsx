import type { ReactNode } from 'react';
import { requireAuth, requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export default async function ClientLayout({ children }: { children: ReactNode }) {
  // Require authentication and CLIENT role
  await requireAuth();
  await requireRole([Role.CLIENT]);

  return <>{children}</>;
}