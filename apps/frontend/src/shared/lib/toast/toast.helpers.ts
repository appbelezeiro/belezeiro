// ============================================================================
// TOAST HELPERS - Funções utilitárias para emitir toasts
// ============================================================================

import { toastEmitter, ToastType } from './toast.emitter';

interface ToastOptions {
  title: string;
  description?: string;
  duration?: number;
}

function emitToast(type: ToastType, options: ToastOptions): void {
  toastEmitter.emit({
    type,
    title: options.title,
    description: options.description,
    duration: options.duration,
  });
}

export const toast = {
  success: (options: ToastOptions) => emitToast('success', options),
  error: (options: ToastOptions) => emitToast('error', options),
  warning: (options: ToastOptions) => emitToast('warning', options),
  info: (options: ToastOptions) => emitToast('info', options),

  // Atalhos para mensagens simples (apenas título)
  successMessage: (title: string, description?: string) =>
    emitToast('success', { title, description }),
  errorMessage: (title: string, description?: string) =>
    emitToast('error', { title, description }),
  warningMessage: (title: string, description?: string) =>
    emitToast('warning', { title, description }),
  infoMessage: (title: string, description?: string) =>
    emitToast('info', { title, description }),
};
