// ============================================================================
// PHONE INPUT - Input de telefone com formatação automática
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatPhone, extractDigits, getPhonePlaceholder } from '@/lib/utils/phone';

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  error?: string;
  label?: string;
  onValueChange?: (value: string) => void;
}

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, error, label, id, value, onValueChange, ...props }, ref) => {
    const inputId = id || React.useId();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const digits = extractDigits(rawValue);
      // Limita a 11 dígitos (celular)
      const limitedDigits = digits.slice(0, 11);
      const formatted = formatPhone(limitedDigits);
      onValueChange?.(formatted);
    };

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
        <input
          type="tel"
          inputMode="numeric"
          id={inputId}
          value={value}
          onChange={handleChange}
          placeholder={getPhonePlaceholder()}
          className={cn(
            'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
            error
              ? 'border-destructive focus-visible:ring-destructive'
              : 'border-input focus-visible:ring-ring',
            className
          )}
          ref={ref}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
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

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput };
