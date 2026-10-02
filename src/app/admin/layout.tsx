import type { ReactNode } from 'react';
import { requireRole } from '@/lib/middleware/auth';
import { Role } from '@/types/prisma';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Require ADMIN role for all admin routes
  await requireRole([Role.ADMIN]);

  return <>{children}</>;
}