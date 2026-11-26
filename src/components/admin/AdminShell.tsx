import { ReactNode } from 'react';
import Link from 'next/link';
import { PageShell, HeaderUser } from '@/components/layout';

interface AdminShellProps {
  userName: string;
  title: string;
  description?: string;
  children: ReactNode;
}

export function AdminShell({ userName, title, description, children }: AdminShellProps) {
  return (
    <PageShell
      header={
        <>
          <Link href="/admin/dashboard" className="flex items-center gap-space-sm" data-path="admin">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg" />
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">
              TaskFlow Admin
            </span>
          </Link>
          <HeaderUser name={userName} />
        </>
      }
      title={title}
      description={description}
    >
      {children}
    </PageShell>
  );
}

export function AdminNotice({ error, done }: { error?: string; done?: string }) {
  if (!error && !done) return null;

  return (
    <div className="mb-space-md space-y-1">
      {done && (
        <p className="font-body-sm text-body-sm text-secondary" role="status">{done}</p>
      )}
      {error && (
        <p className="font-body-sm text-body-sm text-error" role="alert">{error}</p>
      )}
    </div>
  );
}

export function EmptyState({ icon, title, hint }: { icon: string; title: string; hint: string }) {
  return (
    <div className="text-center py-space-xl">
      <span className="material-symbols-outlined text-[48px] text-on-surface-variant/30">{icon}</span>
      <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">{title}</p>
      <p className="font-body-sm text-body-sm text-on-surface-variant/60 mt-1">{hint}</p>
    </div>
  );
}
