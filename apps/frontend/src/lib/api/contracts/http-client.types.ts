// ============================================================================
// HTTP CLIENT CONTRACT - Interface agnóstica de framework
// ============================================================================

/**
 * Configuração de requisição HTTP
 */
export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

/**
 * Resposta HTTP padronizada
 */
export interface HttpResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
}

/**
 * Erro HTTP padronizado
 */
export interface HttpError extends Error {
  status?: number;
  statusText?: string;
  response?: HttpResponse<unknown>;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
}

/**
 * Tipo de interceptor
 */
export type InterceptorType = 'request' | 'response';

/**
 * Função de interceptor de requisição
 */
export type RequestInterceptor = (
  config: HttpRequestConfig
) => HttpRequestConfig | Promise<HttpRequestConfig>;

/**
 * Função de interceptor de resposta
 */
export type ResponseInterceptor<T = unknown> = (
  response: HttpResponse<T>
) => HttpResponse<T> | Promise<HttpResponse<T>>;

/**
 * Função de tratamento de erro
 */
export type ErrorInterceptor = (error: HttpError) => Promise<never> | never;

/**
 * Contrato que todo cliente HTTP deve implementar
 * Permite trocar entre Fetch, Axios, Ky, etc facilmente
 */
export interface IHttpClient {
  /**
   * Requisição GET
   */
  get<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Requisição POST
   */
  post<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisição PUT
   */
  put<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisição PATCH
   */
  patch<T = unknown>(
    url: string,
    data?: unknown,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisição DELETE
   */
  delete<T = unknown>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Define URL base para todas as requisições
   */
  setBaseURL(baseURL: string): void;

  /**
   * Adiciona header padrão para todas as requisições
   */
  setDefaultHeader(key: string, value: string): void;

  /**
   * Remove header padrão
   */
  removeDefaultHeader(key: string): void;

  /**
   * Adiciona interceptor de requisição
   */
  addRequestInterceptor(
    onFulfilled: RequestInterceptor,
    onRejected?: ErrorInterceptor
  ): number;

  /**
   * Adiciona interceptor de resposta
   */
  addResponseInterceptor(
    onFulfilled: ResponseInterceptor,
    onRejected?: ErrorInterceptor
  ): number;

  /**
   * Remove interceptor
   */
  removeInterceptor(id: number, type: InterceptorType): void;
}

/**
 * Enum de códigos de status HTTP
 */
export enum HttpStatusCode {
  // 2xx Success
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NoContent = 204,

  // 3xx Redirection
  MovedPermanently = 301,
  Found = 302,
  NotModified = 304,

  // 4xx Client Errors
  BadRequest = 400,
  Unauthorized = 401,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  Conflict = 409,
  UnprocessableEntity = 422,
  TooManyRequests = 429,

  // 5xx Server Errors
  InternalServerError = 500,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
}
