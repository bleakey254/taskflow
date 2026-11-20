"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    className = '',
    style,
    ...props
  }, ref) => {
    const baseClasses = `
      inline-flex items-center justify-center gap-1.5
      font-label-lg text-label-lg font-bold
      rounded-lg
      transition-all duration-fast ease-out-expo
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
      disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none
      select-none
    `;

    const variantClasses = {
      primary: 'bg-primary-container text-on-primary hover:bg-primary/90 shadow-elevation-1 hover:shadow-elevation-2 active:bg-primary active:shadow-none',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90 shadow-elevation-1 hover:shadow-elevation-2 active:bg-secondary active:shadow-none',
      tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim shadow-elevation-1 hover:shadow-elevation-2 active:bg-tertiary-fixed-dim active:shadow-none',
      ghost: 'bg-transparent text-on-surface hover:bg-surface-container-high active:bg-surface-container',
      destructive: 'bg-error text-on-error hover:bg-error/90 shadow-elevation-1 hover:shadow-elevation-2 active:bg-error active:shadow-none',
      outlined: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5 active:bg-primary/10',
    };

    const sizeClasses = {
      sm: 'px-space-md py-space-xs gap-1 text-label-sm',
      md: 'px-space-xl py-space-md gap-1.5',
      lg: 'px-space-2xl py-space-lg gap-2 text-label-lg',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
        style={style}
        disabled={disabled || loading}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'destructive' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  ariaLabel: string;
  children: ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, variant = 'ghost', size = 'md', ariaLabel, className = '', style, ...props }, ref) => {
    const sizeClasses = {
      sm: 'p-1.5',
      md: 'p-2',
      lg: 'p-2.5',
    };

    const variantClasses = {
      primary: 'bg-primary-container text-on-primary hover:bg-primary/90',
      secondary: 'bg-secondary text-on-secondary hover:bg-secondary/90',
      tertiary: 'bg-tertiary-fixed text-on-tertiary-fixed hover:bg-tertiary-fixed-dim',
      ghost: 'bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface',
      destructive: 'bg-error text-on-error hover:bg-error/90',
      outlined: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/5',
    };

    return (
      <button
        ref={ref}
        className={`
          inline-flex items-center justify-center
          rounded-lg
          transition-all duration-fast ease-out-expo
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${variantClasses[variant]} ${sizeClasses[size]} ${className}
        `}
        style={style}
        aria-label={ariaLabel}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = 'IconButton';