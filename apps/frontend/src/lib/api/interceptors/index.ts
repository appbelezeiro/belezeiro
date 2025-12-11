// ============================================================================
// INTERCEPTORS - Barrel exports
// ============================================================================

export { setupAuthInterceptor } from './auth-interceptor';
export type { AuthInterceptorCallbacks } from './auth-interceptor';

export { setupErrorInterceptor, transformError, getApiError } from './error-interceptor';
export type { ApiError, ApiErrorType } from './error-interceptor';

export { setupLoggingInterceptor } from './logging-interceptor';
