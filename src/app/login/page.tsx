"use client";

import { useState } from 'react';
import Link from 'next/link';
import { loginUser } from '@/actions/auth';
import { PageShell, HeaderNav } from '@/components/layout';
import { Card } from '@/components/layout';
import { Button } from '@/components/layout';
import { Input } from '@/components/layout';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('remember', remember.toString());

    try {
      await loginUser(undefined, formData);
      window.location.href = '/dashboard';
    } catch (err) {
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
        <div className="text-center mb-space-lg">
          <Link href="/" className="inline-flex items-center gap-space-sm mb-space-md" data-path="find-tasks">
            <img alt="TaskFlow Logo" className="h-8 w-auto object-contain" src="/taskflow-logo.svg"/>
            <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight font-bold">TaskFlow</span>
          </Link>
          <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold">Sign in to TaskFlow</h1>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Access your dashboard and manage your tasks
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-space-md">
          {error && (
            <div className="p-space-sm bg-error/10 text-error rounded-lg font-body-sm text-body-sm flex items-center gap-2" role="alert">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            leftIcon={<span className="material-symbols-outlined text-[20px]">email</span>}
          />

          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            leftIcon={<span className="material-symbols-outlined text-[20px]">lock</span>}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-outline-variant text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
              />
              <span className="font-body-sm text-body-sm text-on-surface-variant">Remember me</span>
            </label>
            <Link href="/forgot-password" className="font-body-sm text-body-sm text-primary hover:text-primary/80 font-medium">
              Forgot password?
            </Link>
          </div>

          <Button type="submit" fullWidth size="lg" loading={loading}>
            Sign in
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </Button>
        </form>

        <div className="mt-space-lg text-center">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Don&apos;t have an account?
            <Link href="/register" className="font-medium text-primary hover:text-primary/80 ml-1">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </PageShell>
  );
}