// ============================================================================
// LOGGING INTERCEPTOR - Logs de desenvolvimento
// ============================================================================

import type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
} from '../contracts/http-client.types';

/**
 * Cores para console
 */
const COLORS = {
  request: '#4CAF50',
  response: '#2196F3',
  error: '#F44336',
  time: '#9E9E9E',
} as const;

/**
 * Formata tempo em ms
 */
function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Log de requisição
 */
function logRequest(config: HttpRequestConfig): void {
  console.groupCollapsed(
    `%c[HTTP Request]%c ${new Date().toISOString()}`,
    `color: ${COLORS.request}; font-weight: bold`,
    `color: ${COLORS.time}`
  );
  console.log('Config:', config);
  console.groupEnd();
}

/**
 * Log de resposta
 */
function logResponse(response: HttpResponse, duration: number): void {
  const statusColor = response.status >= 400 ? COLORS.error : COLORS.response;

  console.groupCollapsed(
    `%c[HTTP Response]%c ${response.status} %c${formatTime(duration)}`,
    `color: ${statusColor}; font-weight: bold`,
    `color: ${statusColor}`,
    `color: ${COLORS.time}`
  );
  console.log('Status:', response.status, response.statusText);
  console.log('Data:', response.data);
  console.log('Headers:', response.headers);
  console.groupEnd();
}

/**
 * Log de erro
 */
function logError(error: HttpError, duration: number): void {
  console.groupCollapsed(
    `%c[HTTP Error]%c ${error.status ?? 'Network'} %c${formatTime(duration)}`,
    `color: ${COLORS.error}; font-weight: bold`,
    `color: ${COLORS.error}`,
    `color: ${COLORS.time}`
  );
  console.log('Message:', error.message);
  console.log('Status:', error.status);
  console.log('Response:', error.response);
  console.log('Is Network Error:', error.isNetworkError);
  console.log('Is Timeout Error:', error.isTimeoutError);
  console.groupEnd();
}

/**
 * Setup do interceptor de logging
 * Apenas ativo em desenvolvimento
 */
export function setupLoggingInterceptor(client: IHttpClient): number[] {
  if (!import.meta.env.DEV) {
    return [];
  }

  const requestTimes = new Map<number, number>();
  let requestCounter = 0;

  // Interceptor de requisição
  const requestId = client.addRequestInterceptor((config) => {
    const id = requestCounter++;
    requestTimes.set(id, Date.now());
    (config as Record<string, unknown>).__requestId = id;

    logRequest(config);

    return config;
  });

  // Interceptor de resposta
  const responseId = client.addResponseInterceptor(
    (response) => {
      const id = (response as unknown as Record<string, unknown>).__requestId as number;
      const startTime = requestTimes.get(id) ?? Date.now();
      const duration = Date.now() - startTime;
      requestTimes.delete(id);

      logResponse(response, duration);

      return response;
    },
    async (error: HttpError): Promise<never> => {
      const config = error as unknown as Record<string, unknown>;
      const id = config.__requestId as number | undefined;
      const startTime = id !== undefined ? requestTimes.get(id) : undefined;
      const duration = startTime ? Date.now() - startTime : 0;

      if (id !== undefined) {
        requestTimes.delete(id);
      }

      logError(error, duration);

      throw error;
    }
  );

  return [requestId, responseId];
}
