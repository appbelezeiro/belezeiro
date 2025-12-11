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
 * Auth Service
 * Handles all authentication-related API calls
 */
class AuthService {
  /**
   * Login user with OAuth provider data
   * Endpoint: POST /auth/login
   * Client: Public (no credentials needed for login)
   */
  async login(request: LoginRequest): Promise<User> {
    // Validate request data
    const validatedRequest = validateData(loginRequestSchema, request);

    // Make API call - MUST use withCredentials to receive httpOnly cookies
    const response = await publicClient.post<LoginResponse>(
      "/auth/login",
      validatedRequest,
      {
        withCredentials: true, // ✅ Receive accessToken and refreshToken cookies
      }
    );

    // Validate and map response
    const validatedResponse = validateData(loginResponseSchema, response.data);
    return mapApiUserToUser(validatedResponse.user);
  }

  /**
   * Refresh access token using refresh token (from cookie)
   * Endpoint: POST /auth/refresh
   * Client: Public (refresh token is in httpOnly cookie)
   *
   * Note: Uses publicClient but WITH credentials
   */
  async refreshToken(): Promise<void> {
    const response = await publicClient.post<RefreshTokenResponse>(
      "/auth/refresh",
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
   * Endpoint: POST /auth/logout
   * Client: Private (requires access token)
   */
  async logout(): Promise<void> {
    const response = await privateClient.post<LogoutResponse>("/auth/logout");

    // Validate response
    validateData(logoutResponseSchema, response.data);
  }

  /**
   * Get current authenticated user
   * Endpoint: GET /auth/me
   * Client: Private (requires access token)
   */
  async getCurrentUser(): Promise<User> {
    const response = await privateClient.get<MeResponse>("/auth/me");

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
