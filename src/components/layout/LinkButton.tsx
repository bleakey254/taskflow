import { ReactNode } from 'react';
import Link from 'next/link';

interface LinkButtonProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

const baseClasses = `
  inline-flex items-center justify-center gap-1.5
  font-label-lg text-label-lg font-bold
  rounded-lg
  transition-all duration-fast ease-out-expo
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
  select-none
`;

const variantClasses = {
  primary: 'bg-primary-container text-on-primary hover:bg-primary/90 shadow-elevation-1 hover:shadow-elevation-2 active:bg-primary active:shadow-none',
  secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-elevation-1 hover:shadow-elevation-2',
  tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim shadow-elevation-1 hover:shadow-elevation-2',
  ghost: 'bg-transparent text-on-surface hover:bg-surface-container-high active:bg-surface-container',
  destructive: 'bg-error text-on-error hover:bg-error/90 shadow-elevation-1 hover:shadow-elevation-2',
  outlined: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10',
};

const sizeClasses = {
  sm: 'px-space-md py-space-xs gap-1 text-label-sm',
  md: 'px-space-xl py-space-md gap-1.5',
  lg: 'px-space-2xl py-space-lg gap-2 text-label-lg',
};

export function LinkButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  className = '',
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </Link>
  );
}
