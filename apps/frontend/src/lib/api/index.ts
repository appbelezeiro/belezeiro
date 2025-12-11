// ============================================================================
// LIB API - Barrel exports
// ============================================================================

// Contracts
export type {
  IHttpClient,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  InterceptorType,
} from './contracts/http-client.types';
export { HttpStatusCode } from './contracts/http-client.types';

// Client
export { AxiosHttpClient } from './client/axios-http-client';
export type { AxiosHttpClientOptions } from './client/axios-http-client';

// Interceptors
export {
  setupAuthInterceptor,
  setupErrorInterceptor,
  setupLoggingInterceptor,
  transformError,
  getApiError,
} from './interceptors';
export type { AuthInterceptorCallbacks, ApiError, ApiErrorType } from './interceptors';

// Factories
export {
  createApiClient,
  getPublicClient,
  getPrivateClient,
  setGlobalAuthCallbacks,
  resetApiClients,
} from './factories/create-api-client';
export type { CreateApiClientOptions } from './factories/create-api-client';

// Config
export {
  API_BASE_URL,
  API_TIMEOUT,
  API_WITH_CREDENTIALS,
  API_ENDPOINTS,
  API_RETRY_CONFIG,
} from './config';
