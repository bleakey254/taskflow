"use client";

import { ReactNode, HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'elevated' | 'filled' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'elevated', padding = 'md', hover = false, interactive = false, className = '', style, ...props }, ref) => {
    const baseClasses = 'rounded-xl transition-all duration-normal';

    const variantClasses = {
      elevated: 'bg-surface-container-lowest shadow-elevation-1',
      filled: 'bg-surface-container',
      outlined: 'bg-surface-container-lowest border border-outline-variant',
    };

    const paddingClasses = {
      none: '',
      sm: 'p-space-sm',
      md: 'p-space-md',
      lg: 'p-space-lg',
    };

    const hoverClasses = hover ? 'hover:shadow-elevation-2 hover:-translate-y-0.5' : '';
    const interactiveClasses = interactive ? 'cursor-pointer active:scale-[0.99] active:shadow-elevation-1' : '';

    return (
      <div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${interactiveClasses} ${className}`}
        style={style}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function CardHeader({ title, subtitle, action, className = '', ...props }: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-space-md mb-space-md ${className}`} {...props}>
      <div className="flex-1 min-w-0">
        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold truncate">{title}</h3>
        {subtitle && (
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

type CardContentProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ children, className = '', ...props }: CardContentProps) {
  return <div className={className} {...props}>{children}</div>;
}

type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardFooter({ children, className = '', ...props }: CardFooterProps) {
  return (
    <div className={`mt-space-md pt-space-md border-t border-outline-variant flex items-center gap-space-sm ${className}`} {...props}>
      {children}
    </div>
  );
}