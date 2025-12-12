// ============================================================================
// AUTH TYPES - Tipos da feature de autenticação
// ============================================================================

/**
 * Entidade do usuário
 */
export interface User {
  id: string;
  name: string;
  email: string;
  photo?: string;
  isActive: boolean;
  onboardingCompleted: boolean;
}

/**
 * Requisição de login
 */
export interface LoginRequest {
  name: string;
  email: string;
  providerId: string;
  photoUrl?: string;
}

/**
 * Resposta de login da API
 * Backend retorna apenas { onboarding: false } quando onboarding não foi feito,
 * e não retorna nada quando já foi completado
 */
export interface LoginResponse {
  /** Only present when onboarding is NOT completed (false means onboarding required) */
  onboarding?: boolean;
}

/**
 * Resultado do login com informações de onboarding
 */
export interface LoginResult {
  user: User;
  /** true se o onboarding precisa ser feito */
  needsOnboarding: boolean;
}

/**
 * Resposta de refresh token
 */
export interface RefreshTokenResponse {
  message: string;
}

/**
 * Resposta de logout
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Resposta do endpoint /me
 */
export interface MeResponse {
  user: User;
  /** Only present when onboarding is not completed (false means onboarding required) */
  onboarding?: boolean;
}

/**
 * Informações do usuário Google OAuth
 */
export interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  email_verified: boolean;
  picture?: string;
  given_name?: string;
  family_name?: string;
  locale?: string;
}

/**
 * Estado de autenticação
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Dados do usuário para exibição
 */
export interface UserDisplay {
  id: string;
  name: string;
  email: string;
  displayName: string;
  avatarUrl: string;
  initials: string;
  isVerified: boolean;
}
