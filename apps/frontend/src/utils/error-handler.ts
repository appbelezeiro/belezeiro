// ============================================================================
// ERROR HANDLER - Centralized API Error Management
// ============================================================================

import type { AxiosError } from "axios";
import type { ApiError } from "@/types/auth.types";
import { ErrorCode } from "@/types/auth.types";

/**
 * Processed error information for UI display
 */
export interface ProcessedError {
  title: string;
  message: string;
  code?: string;
  status?: number;
  issues?: Array<{
    path: string[];
    message: string;
  }>;
}

/**
 * Check if error is an API error from backend
 */
export function isApiError(error: unknown): error is AxiosError<ApiError> {
  if (typeof error !== "object" || error === null) return false;
  if (!("response" in error)) return false;

  const axiosError = error as AxiosError;
  if (typeof axiosError.response !== "object" || axiosError.response === null) return false;
  if (!("data" in axiosError.response)) return false;

  const data = axiosError.response.data;
  if (typeof data !== "object" || data === null) return false;

  return "error" in (data as object);
}

/**
 * Main error handler - processes API errors and returns user-friendly messages
 */
export function handleApiError(error: unknown): ProcessedError {
  // Network/Connection errors
  if (!isApiError(error)) {
    return {
      title: "Erro de Conexão",
      message: "Não foi possível conectar ao servidor. Verifique sua conexão com a internet.",
    };
  }

  const { response } = error;

  if (!response) {
    return {
      title: "Erro de Conexão",
      message: "Não foi possível conectar ao servidor. Tente novamente.",
    };
  }

  const { status, data } = response;
  const errorCode = data?.error?.code;
  const errorMessage = data?.error?.message;

  // 400 - Validation Error
  if (status === 400) {
    return {
      title: "Dados Inválidos",
      message: errorMessage || "Por favor, verifique os dados informados.",
      code: errorCode,
      status,
      issues: data?.error?.issues,
    };
  }

  // 401 - Unauthorized
  if (status === 401) {
    switch (errorCode) {
      case ErrorCode.ACCESS_TOKEN_REQUIRED:
        return {
          title: "Não Autenticado",
          message: "Por favor, faça login para continuar.",
          code: errorCode,
          status,
        };

      case ErrorCode.INVALID_ACCESS_TOKEN:
        return {
          title: "Sessão Expirada",
          message: "Sua sessão expirou. Tentando renovar...",
          code: errorCode,
          status,
        };

      case ErrorCode.REFRESH_TOKEN_REQUIRED:
        return {
          title: "Sessão Encerrada",
          message: "Por favor, faça login novamente.",
          code: errorCode,
          status,
        };

      default:
        return {
          title: "Não Autorizado",
          message: errorMessage || "Você não tem permissão para acessar este recurso.",
          code: errorCode,
          status,
        };
    }
  }

  // 404 - Not Found
  if (status === 404) {
    return {
      title: "Não Encontrado",
      message: errorMessage || "O recurso solicitado não foi encontrado.",
      code: errorCode,
      status,
    };
  }

  // 422 - Business Rule Violation
  if (status === 422) {
    switch (errorCode) {
      case ErrorCode.REFRESH_TOKEN_EXPIRED:
        return {
          title: "Sessão Expirada",
          message: "Sua sessão expirou. Por favor, faça login novamente.",
          code: errorCode,
          status,
        };

      case ErrorCode.INVALID_REFRESH_TOKEN:
        return {
          title: "Sessão Inválida",
          message: "Sua sessão é inválida. Por favor, faça login novamente.",
          code: errorCode,
          status,
        };

      case ErrorCode.USER_NOT_FOUND:
        return {
          title: "Usuário Não Encontrado",
          message: "Sua conta não foi encontrada. Entre em contato com o suporte.",
          code: errorCode,
          status,
        };

      default:
        return {
          title: "Erro de Validação",
          message: errorMessage || "Não foi possível processar sua solicitação.",
          code: errorCode,
          status,
        };
    }
  }

  // 500 - Internal Server Error
  if (status === 500) {
    return {
      title: "Erro no Servidor",
      message: "Ocorreu um erro inesperado. Tente novamente mais tarde.",
      code: errorCode,
      status,
    };
  }

  // Default error
  return {
    title: "Erro",
    message: errorMessage || "Ocorreu um erro inesperado. Tente novamente.",
    code: errorCode,
    status,
  };
}

/**
 * Check if error requires logout/redirect to login
 */
export function shouldRedirectToLogin(error: ProcessedError): boolean {
  if (!error.code) return false;

  return [
    ErrorCode.REFRESH_TOKEN_EXPIRED,
    ErrorCode.INVALID_REFRESH_TOKEN,
    ErrorCode.USER_NOT_FOUND,
    ErrorCode.REFRESH_TOKEN_REQUIRED,
  ].includes(error.code as ErrorCode);
}

/**
 * Check if error is a token expiration that should trigger refresh
 */
export function shouldAttemptTokenRefresh(error: ProcessedError): boolean {
  return (
    error.status === 401 && error.code === ErrorCode.INVALID_ACCESS_TOKEN
  );
}

/**
 * Format validation errors for form display
 */
export function formatValidationErrors(
  issues?: Array<{ path: string[]; message: string }>
): Record<string, string> {
  if (!issues) return {};

  return issues.reduce((acc, issue) => {
    const field = issue.path.join(".");
    acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);
}
