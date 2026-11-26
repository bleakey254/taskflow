"use client";

import { useState } from 'react';
import Link from 'next/link';
import { registerUser } from '@/actions/auth';
import { PageShell } from '@/components/layout';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Input, Select } from '@/components/layout';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'WORKER' | 'CLIENT'>('WORKER');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role);

    try {
      await registerUser(undefined, formData);
      window.location.href = '/dashboard';
    } catch (err) {
      // Let Next.js handle its own redirect signal instead of showing it as an error.
      const digest = (err as { digest?: unknown })?.digest;
      if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
        throw err;
      }
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell
      fullWidth
      className="flex items-center justify-center min-h-screen py-space-2xl"
    >
      <Card variant="elevated" padding="lg" className="w-full max-w-md">
        <div className="text-center mb-space-lg animate-entrance">
          <Link href="/" className="inline-flex items-center gap-space-sm mb-space-md animate-entrance delay-1" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold animate-entrance delay-2">Create your TaskFlow account</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs animate-entrance delay-3">
            Get started with task management and collaboration
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-space-md animate-entrance delay-4">
          {error && (
            <div className="p-space-sm bg-error/10 text-error rounded-lg font-body-sm text-body-sm flex items-center gap-2 animate-shake" role="alert">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <Input
            label="First name"
            type="text"
            autoComplete="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="John"
            leftIcon={<span className="material-symbols-outlined text-[20px]">person</span>}
            className="animate-entrance delay-1 input-interactive"
          />

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<span className="material-symbols-outlined text-[20px]">email</span>}
            className="animate-entrance delay-2 input-interactive"
          />

          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            leftIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
            helperText="At least 8 characters"
            className="animate-entrance delay-3 input-interactive"
          />

          <Select
            label="Account type"
            required
            value={role}
            onChange={(e) => setRole(e.target.value as 'WORKER' | 'CLIENT')}
            placeholder="Select account type"
            options={[
              { value: 'WORKER', label: 'Worker - Complete tasks and earn' },
              { value: 'CLIENT', label: 'Client - Post tasks and manage workers' },
            ]}
            className="animate-entrance delay-4"
          />

          <Button type="submit" fullWidth size="lg" loading={loading} className="btn-interactive animate-entrance delay-5">
            Create account
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </form>

        <div className="mt-space-lg text-center animate-entrance delay-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Already have an account?
            <Link href="/login" className="font-medium text-primary hover:text-primary/80 ml-1 link-underline">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </PageShell>
  );
}