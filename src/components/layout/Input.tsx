"use client";

import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, fullWidth = true, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
            {label}
            {props.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              w-full
              bg-surface-container-lowest
              border
              rounded-lg
              text-on-surface
              placeholder:text-on-surface-variant/60
              transition-all duration-fast
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60
              ${leftIcon ? 'pl-10' : 'pl-4'}
              ${rightIcon ? 'pr-10' : 'pr-4'}
              py-2.5
              ${error ? 'border-error focus:ring-error' : 'border-outline-variant hover:border-outline'}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 font-body-xs text-body-xs text-error flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[12px]">error</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 font-body-xs text-body-xs text-on-surface-variant">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

interface TextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, fullWidth = true, rows = 4, className = '', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={inputId} className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
            {label}
            {props.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`
            w-full
            bg-surface-container-lowest
            border
            rounded-lg
            text-on-surface
            placeholder:text-on-surface-variant/60
            transition-all duration-fast
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60
            px-4 py-3
            resize-y min-h-[100px]
            ${error ? 'border-error focus:ring-error' : 'border-outline-variant hover:border-outline'}
          `}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={errorId || helperId}
          {...props}
        />
        {error && (
          <p id={errorId} className="mt-1.5 font-body-xs text-body-xs text-error flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[12px]">error</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 font-body-xs text-body-xs text-on-surface-variant">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, fullWidth = true, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const errorId = error ? `${selectId}-error` : undefined;
    const helperId = helperText && !error ? `${selectId}-helper` : undefined;

    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="block font-label-sm text-label-sm text-on-surface font-medium mb-1.5">
            {label}
            {props.required && <span className="text-error ml-0.5" aria-hidden="true">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`
              w-full
              bg-surface-container-lowest
              border
              rounded-lg
              text-on-surface
              transition-all duration-fast
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              disabled:bg-surface-container disabled:cursor-not-allowed disabled:opacity-60
              appearance-none
              px-4 py-2.5 pr-10
              ${error ? 'border-error focus:ring-error' : 'border-outline-variant hover:border-outline'}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={errorId || helperId}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
            <span className="material-symbols-outlined text-[20px]">keyboard_arrow_down</span>
          </div>
        </div>
        {error && (
          <p id={errorId} className="mt-1.5 font-body-xs text-body-xs text-error flex items-center gap-1" role="alert">
            <span className="material-symbols-outlined text-[12px]">error</span>
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 font-body-xs text-body-xs text-on-surface-variant">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';