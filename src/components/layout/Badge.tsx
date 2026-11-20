"use client";

import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'success' | 'warning' | 'error' | 'neutral' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  icon?: React.ReactNode;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'neutral', size = 'md', dot = false, icon, className = '', style, ...props }, ref) => {
    const baseClasses = `
      inline-flex items-center gap-1
      font-label-sm text-label-sm font-semibold
      rounded-full
      transition-colors duration-fast
      whitespace-nowrap
    `;

    const variantClasses = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      tertiary: 'bg-tertiary/10 text-tertiary',
      success: 'bg-secondary/10 text-secondary',
      warning: 'bg-tertiary/10 text-tertiary',
      error: 'bg-error/10 text-error',
      neutral: 'bg-surface-container-high text-on-surface-variant',
      outline: 'bg-transparent border border-outline-variant text-on-surface-variant',
    };

    const sizeClasses = {
      sm: 'px-2 py-0.5 text-[10px] gap-0.5',
      md: 'px-2.5 py-1 text-label-sm gap-1',
      lg: 'px-3 py-1.5 text-label-md gap-1',
    };

    return (
      <span
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        style={style}
        {...props}
      >
        {dot && <span className={`w-1.5 h-1.5 rounded-full ${variant === 'success' ? 'bg-secondary' : variant === 'warning' ? 'bg-tertiary' : variant === 'error' ? 'bg-error' : variant === 'primary' ? 'bg-primary' : 'bg-on-surface-variant'}`} aria-hidden="true" />}
        {icon && <span className="flex-shrink-0">{icon}</span>}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'in_progress' | 'cancelled' | 'open' | 'closed';
  size?: 'sm' | 'md' | 'lg';
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const statusConfig: Record<string, { label: string; variant: BadgeProps['variant']; dot: boolean; icon?: React.ReactNode }> = {
    pending: { label: 'Pending', variant: 'warning', dot: true },
    approved: { label: 'Approved', variant: 'success', dot: true },
    rejected: { label: 'Rejected', variant: 'error', dot: true },
    completed: { label: 'Completed', variant: 'success', dot: true },
    in_progress: { label: 'In Progress', variant: 'primary', dot: true },
    cancelled: { label: 'Cancelled', variant: 'neutral', dot: false },
    open: { label: 'Open', variant: 'success', dot: true },
    closed: { label: 'Closed', variant: 'neutral', dot: false },
  };

  const config = statusConfig[status] || { label: status, variant: 'neutral', dot: false };

  return (
    <Badge variant={config.variant} size={size} dot={config.dot}>
      {config.label}
    </Badge>
  );
}

interface CategoryBadgeProps {
  category: string;
  count?: number;
  highlight?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function CategoryBadge({ category, count, highlight = false, size = 'md' }: CategoryBadgeProps) {
  return (
    <Badge variant={highlight ? 'tertiary' : 'outline'} size={size}>
      {category}
      {count !== undefined && (
        <span className="ml-1 font-label-sm text-label-sm font-bold">{count}</span>
      )}
    </Badge>
  );
}