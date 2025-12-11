// ============================================================================
// AUTH TYPES - Belezeiro Authentication System
// ============================================================================

/**
 * User entity returned from API
 */
export interface LoginAPIResponse {
  created: boolean;
  pending_actions?: Record<string, string>;
}

/**
 * User entity returned from API
 */
export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isActive: boolean;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  name: string;
  email: string;
  providerId: string;
  photoUrl?: string;
}

/**
 * Login response from API
 */
export interface LoginResponse {
  user: User;
}

/**
 * Refresh token response
 */
export interface RefreshTokenResponse {
  message: string;
}

/**
 * Logout response
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Get current user response
 */
export interface MeResponse {
  user: User;
}

/**
 * Google OAuth user info
 */
export interface GoogleUserInfo {
  sub: string;          // Google user ID
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

/**
 * API Error structure
 */
export interface ApiError {
  success: false;
  error: {
    type: string;
    message: string;
    code?: string;
    timestamp: string;
    issues?: Array<{
      path: string[];
      message: string;
    }>;
  };
}

/**
 * Error codes from API
 */
export enum ErrorCode {
  // Unauthorized (401)
  ACCESS_TOKEN_REQUIRED = "ACCESS_TOKEN_REQUIRED",
  INVALID_ACCESS_TOKEN = "INVALID_ACCESS_TOKEN",
  REFRESH_TOKEN_REQUIRED = "REFRESH_TOKEN_REQUIRED",

  // Business Rule Violation (422)
  INVALID_REFRESH_TOKEN = "INVALID_REFRESH_TOKEN",
  REFRESH_TOKEN_EXPIRED = "REFRESH_TOKEN_EXPIRED",
  USER_NOT_FOUND = "USER_NOT_FOUND",

  // Validation (400)
  VALIDATION_ERROR = "VALIDATION_ERROR",
}

/**
 * Auth context state
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Auth context actions
 */
export interface AuthActions {
  login: (request: LoginRequest) => Promise<User>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

/**
 * Complete auth context type
 */
export type AuthContextType = AuthState & AuthActions;

/**
 * Callback URL configuration
 * This will be used to redirect users after login based on their state
 */
export interface CallbackConfig {
  // TODO: Implementar lógica de redirecionamento conforme critérios do usuário
  // Exemplos de critérios possíveis:
  // - firstLogin: boolean (primeiro login do usuário)
  // - hasCompletedOnboarding: boolean
  // - userRole: string
  // - returnUrl: string (URL anterior antes do login)
  getRedirectUrl: (user: User) => string;
}
