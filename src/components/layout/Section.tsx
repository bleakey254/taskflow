"use client";

import { ReactNode, HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
  titleAlign?: 'left' | 'center';
  className?: string;
  children: ReactNode;
  action?: ReactNode;
}

export function Section({ title, description, titleAlign = 'left', className = '', children, action, ...props }: SectionProps) {
  return (
    <section className={`py-space-xl ${className}`} {...props}>
      {(title || description || action) && (
        <div className={`max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop mb-space-xl flex flex-col sm:flex-row sm:items-end justify-between gap-space-md ${titleAlign === 'center' ? 'text-center' : ''}`}>
          <div>
            {title && (
              <h2 className="font-headline-xl text-headline-xl text-on-surface font-extrabold tracking-tight">
                {title}
              </h2>
            )}
            {description && (
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs max-w-xl">
                {description}
              </p>
            )}
          </div>
          {action && <div className="flex-shrink-0 mt-2 sm:mt-0">{action}</div>}
        </div>
      )}
      <div className="max-w-[1280px] mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop">
        {children}
      </div>
    </section>
  );
}

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  children: ReactNode;
}

export function Container({ size = 'lg', className = '', children, ...props }: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-[1280px]',
    xl: 'max-w-[1440px]',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-margin-mobile md:px-margin lg:px-margin-desktop ${sizeClasses[size]} ${className}`} {...props}>
      {children}
    </div>
  );
}

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  className?: string;
  label?: string;
}

export function Divider({ className = '', label, ...props }: DividerProps) {
  if (label) {
    return (
      <div className={`flex items-center gap-space-md ${className}`} {...props}>
        <hr className="flex-1 border-none border-t border-outline-variant" />
        <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider px-space-sm bg-surface">{label}</span>
        <hr className="flex-1 border-none border-t border-outline-variant" />
      </div>
    );
  }
  return <hr className={`border-none border-t border-outline-variant ${className}`} {...props} />;
}

interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

export function Spacer({ size = 'md', className = '' }: SpacerProps) {
  const sizeClasses = {
    xs: 'h-space-xs',
    sm: 'h-space-sm',
    md: 'h-space-md',
    lg: 'h-space-lg',
    xl: 'h-space-xl',
    '2xl': 'h-space-2xl',
  };
  return <div className={`${sizeClasses[size]} ${className}`} aria-hidden="true" />;
}