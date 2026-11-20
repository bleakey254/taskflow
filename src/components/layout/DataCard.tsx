"use client";

import { ReactNode, HTMLAttributes, forwardRef } from 'react';
import { Card, CardContent } from './Card';
import { Badge } from './Badge';

interface DataCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  icon?: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'tertiary' | 'error';
  trend?: { value: string; positive: boolean };
  subtitle?: string;
  action?: ReactNode;
  variant?: 'default' | 'highlight';
}

export const DataCard = forwardRef<HTMLDivElement, DataCardProps>(
  ({ title, value, icon, iconColor = 'primary', trend, subtitle, action, variant = 'default', className = '', children, ...props }, ref) => {
    const iconBgClasses = {
      primary: 'bg-primary/10 text-primary',
      secondary: 'bg-secondary/10 text-secondary',
      tertiary: 'bg-tertiary/10 text-tertiary',
      error: 'bg-error/10 text-error',
    };

    return (
      <Card
        ref={ref}
        variant={variant === 'highlight' ? 'filled' : 'elevated'}
        padding="lg"
        className={`flex flex-col ${className}`}
        {...props}
      >
        <div className="flex items-start justify-between gap-space-md mb-space-sm">
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
            <p className="font-currency-stat text-currency-stat text-on-surface font-extrabold mt-1 truncate">{value}</p>
            {subtitle && (
              <p className="font-body-xs text-body-xs text-on-surface-variant mt-1">{subtitle}</p>
            )}
          </div>
          {icon && (
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClasses[iconColor]}`}>
              {icon}
            </div>
          )}
        </div>
        {(trend || action) && (
          <div className="mt-auto pt-space-sm flex items-center justify-between">
            {trend && (
              <Badge variant={trend.positive ? 'success' : 'error'} size="sm">
                <span className="material-symbols-outlined text-[12px]">{trend.positive ? 'trending_up' : 'trending_down'}</span>
                {trend.value}
              </Badge>
            )}
            {action && <div>{action}</div>}
          </div>
        )}
        {children && <CardContent className="mt-space-md">{children}</CardContent>}
      </Card>
    );
  }
);

DataCard.displayName = 'DataCard';

interface StatGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StatGrid({ children, columns = 4, gap = 'md', className = '' }: StatGridProps) {
  const gapClasses = { sm: 'gap-space-sm', md: 'gap-gutter', lg: 'gap-gutter-lg' };
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <div className={`grid ${columnClasses[columns]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface ProgressCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  value: number;
  max?: number;
  label?: string;
  icon?: ReactNode;
  iconColor?: 'primary' | 'secondary' | 'tertiary' | 'error';
  segments?: { value: number; color: string; label: string }[];
}

export function ProgressCard({ title, value, max = 100, label, icon, iconColor = 'primary', segments, className = '', ...props }: ProgressCardProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const iconBgClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    error: 'bg-error/10 text-error',
  };

  return (
    <Card variant="elevated" padding="lg" className={className} {...props}>
      <div className="flex items-start justify-between gap-space-md mb-space-md">
        <div>
          <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-space-xs mt-1">
            <span className="font-currency-stat text-currency-stat text-on-surface font-extrabold">{value}</span>
            {label && <span className="font-body-sm text-body-sm text-on-surface-variant self-end mb-1">/{max} {label}</span>}
          </div>
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgClasses[iconColor]}`}>
            {icon}
          </div>
        )}
      </div>
      <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
        {segments ? (
          <>
            {segments.map((segment, index) => (
              <div
                key={index}
                className="h-full"
                style={{
                  width: `${(segment.value / max) * 100}%`,
                  backgroundColor: segment.color,
                }}
              />
            ))}
          </>
        ) : (
          <div
            className="h-full bg-primary transition-all duration-500 ease-out-expo"
            style={{ width: `${percentage}%` }}
          />
        )}
      </div>
    </Card>
  );
}