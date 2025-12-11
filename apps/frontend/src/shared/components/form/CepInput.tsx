// ============================================================================
// CEP INPUT - Input de CEP com busca automática de endereço
// ============================================================================

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  formatCep,
  extractCepDigits,
  fetchAddressByCep,
  type Address,
  type CepServiceError,
} from '@/services/api/cep.service';
import { Loader2 } from 'lucide-react';

export interface CepInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type'> {
  error?: string;
  label?: string;
  onValueChange?: (value: string) => void;
  onAddressFound?: (address: Address) => void;
  onAddressError?: (error: CepServiceError) => void;
}

const CepInput = React.forwardRef<HTMLInputElement, CepInputProps>(
  (
    {
      className,
      error,
      label,
      id,
      value,
      onValueChange,
      onAddressFound,
      onAddressError,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();
    const [isLoading, setIsLoading] = React.useState(false);
    const [localError, setLocalError] = React.useState<string | null>(null);

    const displayError = error || localError;

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value;
      const digits = extractCepDigits(rawValue);
      // Limita a 8 dígitos
      const limitedDigits = digits.slice(0, 8);
      const formatted = formatCep(limitedDigits);

      setLocalError(null);
      onValueChange?.(formatted);

      // Busca endereço quando tiver 8 dígitos
      if (limitedDigits.length === 8 && onAddressFound) {
        setIsLoading(true);
        try {
          const address = await fetchAddressByCep(limitedDigits);
          onAddressFound(address);
        } catch (err) {
          const cepError = err as CepServiceError;
          setLocalError(cepError.message);
          onAddressError?.(cepError);
        } finally {
          setIsLoading(false);
        }
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'mb-1.5 block text-sm font-medium',
              displayError ? 'text-destructive' : 'text-foreground'
            )}
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            id={inputId}
            value={value}
            onChange={handleChange}
            placeholder="00000-000"
            className={cn(
              'flex h-10 w-full rounded-md border bg-background px-3 py-2 text-base ring-offset-background',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
              isLoading && 'pr-10',
              displayError
                ? 'border-destructive focus-visible:ring-destructive'
                : 'border-input focus-visible:ring-ring',
              className
            )}
            ref={ref}
            aria-invalid={!!displayError}
            aria-describedby={displayError ? `${inputId}-error` : undefined}
            {...props}
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {displayError && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-xs text-destructive"
          >
            {displayError}
          </p>
        )}
      </div>
    );
  }
);

CepInput.displayName = 'CepInput';

export { CepInput };
