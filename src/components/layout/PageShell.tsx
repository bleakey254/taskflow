"use client";

import { ReactNode } from 'react';
import Link from 'next/link';
import { signOut } from '@/actions/auth';

interface PageShellProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  header?: ReactNode;
  fullWidth?: boolean;
  noPadding?: boolean;
}

export function PageShell({
  children,
  title,
  description,
  className = '',
  header,
  fullWidth = false,
  noPadding = false,
}: PageShellProps) {
  return (
    <div className={`min-h-screen bg-surface ${className}`}>
      {/* Optional Header */}
      {header && (
        <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-outline-variant/20">
          <div className="h-16 max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop flex items-center justify-between gap-space-md">
            {header}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`w-full ${header ? 'pt-16' : ''}`}>
        <div className={`max-w-[1280px] mx-auto ${fullWidth ? '' : 'px-margin-mobile md:px-margin lg:px-margin-desktop'} ${noPadding ? '' : 'py-space-xl'}`}>
          {(title || description) && (
            <div className="mb-space-xl">
              {title && (
                <h1 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                  {title}
                </h1>
              )}
              {description && (
                <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-2xl">
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </main>
    </div>
  );
}

interface HeaderNavProps {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
}

export function HeaderNav({ href, label, active = false, className = '' }: HeaderNavProps) {
  return (
    <Link
      href={href}
      className={`font-label-lg text-label-lg transition-colors ${
        active
          ? 'text-primary font-bold'
          : 'text-on-surface-variant hover:text-on-surface'
      } ${className}`}
    >
      {label}
    </Link>
  );
}

interface HeaderUserProps {
  name?: string | null;
  avatar?: string | null;
  balance?: string;
  notifications?: number;
  onSignOut?: () => void;
}

export function HeaderUser({ name, avatar, balance, notifications = 0 }: HeaderUserProps) {
  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/login';
  };

  return (
    <div className="flex items-center gap-space-md">
      {balance && (
        <div className="hidden sm:flex items-center gap-space-xs bg-surface-container-high px-space-md py-space-xs rounded-full">
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Wallet</span>
          <span className="font-label-lg text-label-lg text-secondary font-bold">{balance}</span>
        </div>
      )}
      <button
        aria-label="Notifications"
        className="p-space-xs rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors relative flex items-center justify-center"
        type="button"
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {notifications > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
        )}
      </button>
      <div className="flex items-center gap-space-sm pl-space-xs">
        {avatar ? (
          <img alt={name || 'User'} className="w-8 h-8 rounded-full object-cover" src={avatar} />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        )}
        <form action={handleSignOut} className="flex items-center text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors">
          <button type="submit" className="p-2 rounded-lg hover:bg-surface-container-high transition-colors">
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
        </form>
      </div>
    </div>
  );
}