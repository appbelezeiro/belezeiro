// ============================================================================
// AUTH SERVICE - API Integration Layer
// ============================================================================

import { publicClient, privateClient } from "./client";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  MeResponse,
  RefreshTokenResponse,
  User,
} from "@/types/auth.types";
import {
  validateData,
  loginRequestSchema,
  loginResponseSchema,
  logoutResponseSchema,
  meResponseSchema,
  refreshTokenResponseSchema,
} from "@/schemas/auth.schemas";
import { mapApiUserToUser } from "@/mappers/auth.mappers";

/**
 * Resultado do login com informações de onboarding
 */
export interface LoginResult {
  user: User;
  /** true se o onboarding precisa ser feito */
  needsOnboarding: boolean;
}

/**
 * Auth Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user with OAuth provider data
   * Endpoint: POST /api/auth/social-login
   * Client: Public (no credentials needed for login)
   *
   * O backend retorna apenas { onboarding: false } quando onboarding não foi feito,
   * e não retorna nada quando já foi completado. Após o login, buscamos
   * os dados do usuário via /me.
   */
  async login(request: LoginRequest): Promise<LoginResult> {
    // Validate request data
    const validatedRequest = validateData(loginRequestSchema, request);

    // Make API call - MUST use withCredentials to receive httpOnly cookies
    const loginResponse = await publicClient.post<LoginResponse>(
      "/api/auth/social-login",
      validatedRequest,
      {
        withCredentials: true, // ✅ Receive accessToken and refreshToken cookies
      }
    );

    // Validate login response
    const validatedLoginResponse = validateData(loginResponseSchema, loginResponse.data);

    // Determina se precisa de onboarding baseado na resposta
    // Se onboarding === false, precisa fazer onboarding
    // Se onboarding === undefined (não veio), já foi completado
    const needsOnboarding = validatedLoginResponse.onboarding === false;

    // Busca os dados do usuário via /me
    const user = await this.getCurrentUser();

    return {
      user,
      needsOnboarding,
    };
  }

  /**
   * Refresh access token using refresh token (from cookie)
   * Endpoint: POST /api/auth/refresh
   * Client: Public (refresh token is in httpOnly cookie)
   *
   * Note: Uses publicClient but WITH credentials
   */
  async refreshToken(): Promise<void> {
    const response = await publicClient.post<RefreshTokenResponse>(
      "/api/auth/refresh",
      {},
      {
        withCredentials: true, // Send refresh token cookie
      }
    );

    // Validate response
    validateData(refreshTokenResponseSchema, response.data);
  }

  /**
   * Logout current user
   * Endpoint: POST /api/auth/logout
   * Client: Private (requires access token)
   */
  async logout(): Promise<void> {
    const response = await privateClient.post<LogoutResponse>("/api/auth/logout");

    // Validate response
    validateData(logoutResponseSchema, response.data);
  }

  /**
   * Get current authenticated user
   * Endpoint: GET /api/auth/me
   * Client: Private (requires access token)
   */
  async getCurrentUser(): Promise<User> {
    const response = await privateClient.get<MeResponse>("/api/auth/me");

    // Validate and map response
    const validatedResponse = validateData(meResponseSchema, response.data);
    return mapApiUserToUser(validatedResponse.user);
  }

  /**
   * Check if user is authenticated by trying to get current user
   * Returns user if authenticated, null otherwise
   */
  async checkAuth(): Promise<User | null> {
    try {
      return await this.getCurrentUser();
    } catch (error) {
      // If any error occurs, user is not authenticated
      return null;
    }
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;
