import type { ReactNode } from 'react';
import { requireAuth } from '@/lib/middleware/auth';

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  // Require authentication for dashboard
  await requireAuth();

  return <>{children}</>;
}