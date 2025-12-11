// ============================================================================
// AUTH HOOKS - Barrel exports
// ============================================================================

// Queries
export {
  useCurrentUser,
  useIsAuthenticated,
  useInvalidateCurrentUser,
  useSetCurrentUser,
  useClearAuthCache,
} from './queries';
export type { UseCurrentUserOptions } from './queries';

// Mutations
export { useLogin, isLoginSuccess, useLogout, useForceLogout } from './mutations';
export type { UseLoginOptions, UseLoginReturn, UseLogoutOptions } from './mutations';

// Custom hooks
export { useGoogleLogin } from './useGoogleLogin';
export type { UseGoogleLoginOptions, GoogleLoginState } from './useGoogleLogin';
