// ============================================================================
// TOAST FEEDBACK MODULE - Componente que escuta eventos e exibe toasts
// ============================================================================

import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toastEmitter, ToastEvent, ToastType } from './toast.emitter';

// Mapeamento de tipos para variantes do toast
const typeToVariant: Record<ToastType, 'default' | 'destructive'> = {
  success: 'default',
  info: 'default',
  warning: 'default',
  error: 'destructive',
};

// Ícones por tipo (usando emoji para simplicidade)
const typeToIcon: Record<ToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

export function ToastFeedbackModule() {
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = toastEmitter.subscribe((event: ToastEvent) => {
      toast({
        variant: typeToVariant[event.type],
        title: `${typeToIcon[event.type]} ${event.title}`,
        description: event.description,
        duration: event.duration ?? 5000,
      });
    });

    return unsubscribe;
  }, [toast]);

  // Este componente não renderiza nada, apenas escuta eventos
  return null;
}
