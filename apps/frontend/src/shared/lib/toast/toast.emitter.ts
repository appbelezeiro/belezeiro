// ============================================================================
// TOAST EVENT EMITTER - Sistema global de eventos para toasts
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastEvent {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

type ToastListener = (event: ToastEvent) => void;

class ToastEmitter {
  private listeners: Set<ToastListener> = new Set();

  subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  emit(event: Omit<ToastEvent, 'id'>): void {
    const fullEvent: ToastEvent = {
      ...event,
      id: `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    };
    this.listeners.forEach((listener) => listener(fullEvent));
  }
}

// Singleton instance
export const toastEmitter = new ToastEmitter();
