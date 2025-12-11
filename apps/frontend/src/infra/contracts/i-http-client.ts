// ============================================================================
// HTTP CLIENT CONTRACT - Interface agn�stica de framework
// ============================================================================

export interface HttpRequestConfig {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
  signal?: AbortSignal;
  withCredentials?: boolean;
}

/**
 * Resposta HTTP padronizada
 */
export interface HttpResponse<T = any> {
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
  response?: HttpResponse;
  isNetworkError?: boolean;
  isTimeoutError?: boolean;
}

/**
 * Contrato que todo cliente HTTP deve implementar
 * Permite trocar entre Fetch, Axios, Ky, etc facilmente
 */
export interface IHttpClient {
  /**
   * Requisi��o GET
   */
  get<T = any>(url: string, config?: HttpRequestConfig): Promise<HttpResponse<T>>;

  /**
   * Requisi��o POST
   */
  post<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisi��o PUT
   */
  put<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisi��o PATCH
   */
  patch<T = any>(
    url: string,
    data?: any,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Requisi��o DELETE
   */
  delete<T = any>(
    url: string,
    config?: HttpRequestConfig
  ): Promise<HttpResponse<T>>;

  /**
   * Define URL base para todas as requisi��es
   */
  setBaseURL(baseURL: string): void;

  /**
   * Adiciona header padr�o para todas as requisi��es
   */
  setDefaultHeader(key: string, value: string): void;

  /**
   * Remove header padr�o
   */
  removeDefaultHeader(key: string): void;

  /**
   * Adiciona interceptor de requisi��o
   */
  addRequestInterceptor(
    onFulfilled: (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>,
    onRejected?: (error: any) => any
  ): number;

  /**
   * Adiciona interceptor de resposta
   */
  addResponseInterceptor(
    onFulfilled: (response: HttpResponse) => HttpResponse | Promise<HttpResponse>,
    onRejected?: (error: HttpError) => any
  ): number;

  /**
   * Remove interceptor
   */
  removeInterceptor(id: number, type: 'request' | 'response'): void;
}


export enum HttpStatusCode {
  Continue = 100,
  SwitchingProtocols = 101,
  Processing = 102,
  EarlyHints = 103,
  Ok = 200,
  Created = 201,
  Accepted = 202,
  NonAuthoritativeInformation = 203,
  NoContent = 204,
  ResetContent = 205,
  PartialContent = 206,
  MultiStatus = 207,
  AlreadyReported = 208,
  ImUsed = 226,
  MultipleChoices = 300,
  MovedPermanently = 301,
  Found = 302,
  SeeOther = 303,
  NotModified = 304,
  UseProxy = 305,
  Unused = 306,
  TemporaryRedirect = 307,
  PermanentRedirect = 308,
  BadRequest = 400,
  Unauthorized = 401,
  PaymentRequired = 402,
  Forbidden = 403,
  NotFound = 404,
  MethodNotAllowed = 405,
  NotAcceptable = 406,
  ProxyAuthenticationRequired = 407,
  RequestTimeout = 408,
  Conflict = 409,
  Gone = 410,
  LengthRequired = 411,
  PreconditionFailed = 412,
  PayloadTooLarge = 413,
  UriTooLong = 414,
  UnsupportedMediaType = 415,
  RangeNotSatisfiable = 416,
  ExpectationFailed = 417,
  ImATeapot = 418,
  MisdirectedRequest = 421,
  UnprocessableEntity = 422,
  Locked = 423,
  FailedDependency = 424,
  TooEarly = 425,
  UpgradeRequired = 426,
  PreconditionRequired = 428,
  TooManyRequests = 429,
  RequestHeaderFieldsTooLarge = 431,
  UnavailableForLegalReasons = 451,
  InternalServerError = 500,
  NotImplemented = 501,
  BadGateway = 502,
  ServiceUnavailable = 503,
  GatewayTimeout = 504,
  HttpVersionNotSupported = 505,
  VariantAlsoNegotiates = 506,
  InsufficientStorage = 507,
  LoopDetected = 508,
  NotExtended = 510,
  NetworkAuthenticationRequired = 511,
}