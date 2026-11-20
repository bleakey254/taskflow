"use client";

import { useState } from 'react';
import { initiateTaskUnlockPayment } from '@/actions/payment';
import { PageShell, HeaderUser } from '@/components/layout';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/layout';
import { Button } from '@/components/layout';
import { Badge } from '@/components/layout';
import Link from 'next/link';

interface TaskLockClientProps {
  user: { name?: string | null };
  taskPreview: {
    title: string;
    category: string;
    rating: number;
    previewDescription: string;
    budget: number;
    currency: string;
    slotsLeft: number;
    unlockedCount: number;
    clientVerified: boolean;
  };
}

export function TaskLockClient({ user, taskPreview }: TaskLockClientProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUnlock = async () => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('taskId', 'placeholder'); // This would come from the URL params
      formData.append('phoneNumber', '+254700000000'); // This would be from user input
      const result = await initiateTaskUnlockPayment(undefined, formData);
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to unlock task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <PageShell
        header={
          <>
            <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
              <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
              <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
            </Link>
            <HeaderUser name={user.name} balance="$245.50" />
          </>
        }
      >
        <div className="max-w-2xl text-center py-space-2xl">
          <div className="w-20 h-20 rounded-full bg-secondary/10 flex items-center justify-center mx-auto text-secondary mb-space-lg">
            <span className="material-symbols-outlined text-[40px]">lock_open</span>
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Task Unlocked!</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-sm">
            You've successfully unlocked "{taskPreview.title}". You can now view the full task details and submit your work.
          </p>
          <div className="mt-space-xl flex gap-space-sm justify-center">
            <Button variant="ghost" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to Tasks
            </Button>
            <Button leftIcon={<span className="material-symbols-outlined text-[18px]">visibility</span>}>
              View Task Details
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      header={
        <>
          <Link href="/" className="flex items-center gap-space-sm" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <HeaderUser name={user.name} balance="$245.50" />
        </>
      }
    >
      <div className="max-w-2xl">
        <div className="flex items-center gap-space-md mb-space-lg">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[24px]">lock</span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Unlock Task</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-0.5">Pay $0.80 to access full task details</p>
          </div>
        </div>

        <Card variant="elevated" padding="lg">
          <div className="flex flex-wrap items-center gap-space-sm mb-space-md">
            <Badge variant="primary" size="sm">{taskPreview.category}</Badge>
            <Badge variant="secondary" size="sm">
              <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {taskPreview.rating}
            </Badge>
            {taskPreview.clientVerified && (
              <Badge variant="secondary" size="sm" icon={<span className="material-symbols-outlined text-[13px]">verified_user</span>}>
                Verified Client
              </Badge>
            )}
          </div>

          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold mb-space-sm">{taskPreview.title}</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mb-space-lg">{taskPreview.previewDescription}</p>

          <div className="grid gap-gutter sm:grid-cols-3 mb-space-lg">
            <div className="text-center p-space-md bg-surface-container rounded-lg">
              <p className="font-currency-stat text-currency-stat text-on-surface font-bold">{taskPreview.slotsLeft}</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Slots Left</p>
            </div>
            <div className="text-center p-space-md bg-surface-container rounded-lg">
              <p className="font-currency-stat text-currency-stat text-secondary font-bold">{taskPreview.unlockedCount}</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Already Unlocked</p>
            </div>
            <div className="text-center p-space-md bg-surface-container rounded-lg">
              <p className="font-currency-stat text-currency-stat text-primary font-bold">${taskPreview.budget.toFixed(2)} {taskPreview.currency}</p>
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-0.5">Task Budget</p>
            </div>
          </div>

          {error && (
            <div className="p-space-sm bg-error/10 text-error rounded-lg font-body-sm text-body-sm flex items-center gap-2 mb-space-md" role="alert">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <CardFooter>
            <Button variant="ghost" onClick={() => window.history.back()}>
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Go Back
            </Button>
            <Button
              fullWidth
              variant="primary"
              leftIcon={<span className="material-symbols-outlined text-[18px]">lock_open</span>}
              loading={loading}
              onClick={handleUnlock}
            >
              Unlock Task ($0.80)
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageShell>
  );
}