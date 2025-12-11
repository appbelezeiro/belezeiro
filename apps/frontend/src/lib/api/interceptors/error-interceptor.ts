// ============================================================================
// ERROR INTERCEPTOR - Padronização de erros
// ============================================================================

import type { IHttpClient, HttpError, HttpStatusCode } from '../contracts/http-client.types';

/**
 * Tipos de erro da aplicação
 */
export type ApiErrorType =
  | 'NETWORK_ERROR'
  | 'TIMEOUT_ERROR'
  | 'VALIDATION_ERROR'
  | 'AUTH_ERROR'
  | 'NOT_FOUND_ERROR'
  | 'CONFLICT_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'SERVER_ERROR'
  | 'UNKNOWN_ERROR';

/**
 * Erro padronizado da API
 */
export interface ApiError {
  type: ApiErrorType;
  message: string;
  status?: number;
  originalError: HttpError;
  validationErrors?: Record<string, string[]>;
}

/**
 * Mensagens de erro em português
 */
const ERROR_MESSAGES: Record<ApiErrorType, string> = {
  NETWORK_ERROR: 'Erro de conexão. Verifique sua internet e tente novamente.',
  TIMEOUT_ERROR: 'A requisição demorou muito. Tente novamente.',
  VALIDATION_ERROR: 'Dados inválidos. Verifique os campos e tente novamente.',
  AUTH_ERROR: 'Você não tem permissão para acessar este recurso.',
  NOT_FOUND_ERROR: 'O recurso solicitado não foi encontrado.',
  CONFLICT_ERROR: 'Conflito ao processar a requisição. O recurso pode já existir.',
  RATE_LIMIT_ERROR: 'Muitas requisições. Aguarde alguns segundos e tente novamente.',
  SERVER_ERROR: 'Erro interno do servidor. Tente novamente mais tarde.',
  UNKNOWN_ERROR: 'Ocorreu um erro inesperado. Tente novamente.',
};

/**
 * Determina o tipo de erro baseado no status HTTP
 */
function getErrorType(error: HttpError): ApiErrorType {
  if (error.isNetworkError) {
    return 'NETWORK_ERROR';
  }

  if (error.isTimeoutError) {
    return 'TIMEOUT_ERROR';
  }

  const status = error.status as HttpStatusCode;

  switch (status) {
    case 400:
    case 422:
      return 'VALIDATION_ERROR';
    case 401:
    case 403:
      return 'AUTH_ERROR';
    case 404:
      return 'NOT_FOUND_ERROR';
    case 409:
      return 'CONFLICT_ERROR';
    case 429:
      return 'RATE_LIMIT_ERROR';
    case 500:
    case 502:
    case 503:
    case 504:
      return 'SERVER_ERROR';
    default:
      return 'UNKNOWN_ERROR';
  }
}

/**
 * Extrai mensagem de erro da resposta da API
 */
function extractErrorMessage(error: HttpError): string | undefined {
  const data = error.response?.data as Record<string, unknown> | undefined;

  if (data && typeof data === 'object') {
    // Tenta diferentes formatos comuns de erro
    if (typeof data.message === 'string') {
      return data.message;
    }
    if (typeof data.error === 'string') {
      return data.error;
    }
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const firstError = data.errors[0];
      if (typeof firstError === 'string') {
        return firstError;
      }
      if (typeof firstError === 'object' && firstError !== null) {
        const errorObj = firstError as Record<string, unknown>;
        return (errorObj.message as string) ?? (errorObj.msg as string);
      }
    }
  }

  return undefined;
}

/**
 * Extrai erros de validação da resposta
 */
function extractValidationErrors(
  error: HttpError
): Record<string, string[]> | undefined {
  const data = error.response?.data as Record<string, unknown> | undefined;

  if (data && typeof data === 'object') {
    // Formato Zod/class-validator
    if (data.errors && typeof data.errors === 'object' && !Array.isArray(data.errors)) {
      return data.errors as Record<string, string[]>;
    }

    // Formato array de erros
    if (Array.isArray(data.errors)) {
      const errors: Record<string, string[]> = {};
      data.errors.forEach((err: unknown) => {
        if (typeof err === 'object' && err !== null) {
          const errorObj = err as Record<string, unknown>;
          const field = (errorObj.field as string) ?? (errorObj.path as string) ?? 'general';
          const message = (errorObj.message as string) ?? (errorObj.msg as string) ?? 'Erro de validação';

          if (!errors[field]) {
            errors[field] = [];
          }
          errors[field].push(message);
        }
      });
      return Object.keys(errors).length > 0 ? errors : undefined;
    }
  }

  return undefined;
}

/**
 * Transforma HttpError em ApiError padronizado
 */
export function transformError(error: HttpError): ApiError {
  const type = getErrorType(error);
  const customMessage = extractErrorMessage(error);
  const validationErrors =
    type === 'VALIDATION_ERROR' ? extractValidationErrors(error) : undefined;

  return {
    type,
    message: customMessage ?? ERROR_MESSAGES[type],
    status: error.status,
    originalError: error,
    validationErrors,
  };
}

/**
 * Setup do interceptor de erro
 * Padroniza todos os erros da API
 */
export function setupErrorInterceptor(client: IHttpClient): number {
  return client.addResponseInterceptor(
    // Passa resposta sem modificação
    (response) => response,

    // Transforma erros
    async (error: HttpError): Promise<never> => {
      const apiError = transformError(error);

      // Log em desenvolvimento
      if (import.meta.env.DEV) {
        console.error('[API Error]', {
          type: apiError.type,
          message: apiError.message,
          status: apiError.status,
          validationErrors: apiError.validationErrors,
        });
      }

      // Anexa informações extras ao erro original
      const enhancedError = error;
      (enhancedError as unknown as Record<string, unknown>).apiError = apiError;

      throw enhancedError;
    }
  );
}

/**
 * Helper para extrair ApiError de um erro capturado
 */
export function getApiError(error: unknown): ApiError | null {
  if (error && typeof error === 'object' && 'apiError' in error) {
    return (error as { apiError: ApiError }).apiError;
  }
  return null;
}
