// ============================================================================
// AUTH INTERCEPTOR - Refresh automático de token
// ============================================================================

import type { IHttpClient, HttpError, HttpStatusCode } from '../contracts/http-client.types';

/**
 * Callbacks para eventos de autenticação
 */
export interface AuthInterceptorCallbacks {
  onRefreshSuccess?: () => void;
  onRefreshFailure?: () => void;
  onLogout?: () => void;
}

/**
 * Estado do refresh de token
 */
interface RefreshState {
  isRefreshing: boolean;
  refreshPromise: Promise<void> | null;
  failedQueue: Array<{
    resolve: () => void;
    reject: (error: Error) => void;
  }>;
}

/**
 * Cria estado inicial do refresh
 */
function createRefreshState(): RefreshState {
  return {
    isRefreshing: false,
    refreshPromise: null,
    failedQueue: [],
  };
}

/**
 * Processa a fila de requisições pendentes
 */
function processQueue(
  state: RefreshState,
  error: Error | null = null
): void {
  state.failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  state.failedQueue = [];
}

/**
 * Setup do interceptor de autenticação
 * Detecta erros 401 e tenta refresh automático do token
 */
export function setupAuthInterceptor(
  client: IHttpClient,
  refreshEndpoint: string = '/api/auth/refresh',
  callbacks: AuthInterceptorCallbacks = {}
): number {
  const state = createRefreshState();

  return client.addResponseInterceptor(
    // Passa resposta sem modificação
    (response) => response,

    // Trata erros de autenticação
    async (error: HttpError): Promise<never> => {
      const status = error.status as HttpStatusCode;

      // Se não for 401, repassa o erro
      if (status !== 401) {
        throw error;
      }

      // Se já estiver fazendo refresh, adiciona à fila
      if (state.isRefreshing) {
        return new Promise<void>((resolve, reject) => {
          state.failedQueue.push({ resolve, reject });
        }).then(() => {
          // Após refresh bem-sucedido, a requisição original deve ser refeita
          // pelo componente/hook que a chamou
          throw error;
        });
      }

      // Inicia o refresh
      state.isRefreshing = true;

      try {
        // Tenta refresh do token
        await client.post(refreshEndpoint, {}, { withCredentials: true });

        // Sucesso - processa fila
        state.isRefreshing = false;
        processQueue(state, null);
        callbacks.onRefreshSuccess?.();

        // Repassa o erro para que o React Query faça retry
        throw error;
      } catch (refreshError) {
        // Falha no refresh - logout
        state.isRefreshing = false;
        processQueue(state, refreshError as Error);
        callbacks.onRefreshFailure?.();
        callbacks.onLogout?.();

        throw error;
      }
    }
  );
}
