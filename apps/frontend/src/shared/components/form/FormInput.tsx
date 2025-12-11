// ============================================================================
// FORM INPUT - Input com suporte a erro visual
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, type, error, label, id, rightElement, ...props }, ref) => {
    const inputId = id || React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              error ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type={type}
            id={inputId}
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background',
              'file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              error
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:ring-ring',
              rightElement && 'pr-10',
              className
            )}
            ref={ref}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-destructive"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export { FormInput };
