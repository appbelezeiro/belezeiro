// ============================================================================
// AUTH FEATURE - Barrel exports
// ============================================================================

// Components
export { LoginPage } from './components';

// Hooks
export {
  useCurrentUser,
  useIsAuthenticated,
  useInvalidateCurrentUser,
  useSetCurrentUser,
  useClearAuthCache,
  useLogin,
  useLogout,
  useForceLogout,
  useGoogleLogin,
} from './hooks';

export type {
  UseCurrentUserOptions,
  UseLoginOptions,
  UseLogoutOptions,
  UseGoogleLoginOptions,
} from './hooks';

// UI Components
export { GoogleLoginButton } from './ui';
export type { GoogleLoginButtonProps } from './ui';

// Types
export type {
  User,
  LoginRequest,
  LoginResponse,
  GoogleUserInfo,
  AuthState,
  UserDisplay,
} from './types';

// API Services
export { getAuthService, createAuthService, AuthService } from './api';
export { getGoogleOAuthService, createGoogleOAuthService } from './api';

// Schemas
export {
  userSchema,
  loginRequestSchema,
  loginResponseSchema,
  googleUserInfoSchema,
} from './schemas';
