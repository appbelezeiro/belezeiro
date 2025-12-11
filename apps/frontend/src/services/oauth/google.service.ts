// ============================================================================
// GOOGLE OAUTH SERVICE - Google Authentication Integration
// ============================================================================

import type { GoogleUserInfo, LoginRequest } from "@/types/auth.types";
import { mapGoogleUserToLoginRequest } from "@/mappers/auth.mappers";
import { validateData, googleUserInfoSchema } from "@/schemas/auth.schemas";

/**
 * Google OAuth Configuration
 */
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GOOGLE_USER_INFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

/**
 * Google OAuth Service
 * Handles Google authentication flow
 */
class GoogleOAuthService {
  /**
   * Get Google Client ID from environment
   */
  getClientId(): string {
    if (!GOOGLE_CLIENT_ID) {
      throw new Error(
        "VITE_GOOGLE_CLIENT_ID is not defined in environment variables"
      );
    }
    return GOOGLE_CLIENT_ID;
  }

  /**
   * Fetch user info from Google using access token
   */
  async fetchUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    try {
      const response = await fetch(GOOGLE_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user info from Google: ${response.statusText}`
        );
      }

      const data = await response.json();

      // Validate response data
      return validateData(googleUserInfoSchema, data);
    } catch (error) {
      console.error("[GoogleOAuth] Error fetching user info:", error);
      throw new Error("Failed to fetch user information from Google");
    }
  }

  /**
   * Convert Google user info to login request format
   */
  prepareLoginRequest(googleUser: GoogleUserInfo): LoginRequest {
    return mapGoogleUserToLoginRequest(googleUser);
  }

  /**
   * Complete OAuth flow: fetch user info and prepare login request
   */
  async handleOAuthCallback(accessToken: string): Promise<LoginRequest> {
    const googleUser = await this.fetchUserInfo(accessToken);
    return this.prepareLoginRequest(googleUser);
  }

  /**
   * Validate Google Client ID is configured
   */
  isConfigured(): boolean {
    return !!GOOGLE_CLIENT_ID;
  }

  /**
   * Get error message for unconfigured Google OAuth
   */
  getConfigurationError(): string {
    return "Google OAuth não está configurado. Por favor, adicione VITE_GOOGLE_CLIENT_ID nas variáveis de ambiente.";
  }
}

// Export singleton instance
export const googleOAuthService = new GoogleOAuthService();
export default googleOAuthService;

/**
 * Callback URL Handler
 * TODO: Implement your custom callback URL logic here
 *
 * This function will be used to determine where to redirect users after login
 * based on their state (first login, onboarding status, user role, etc.)
 *
 * Example implementation:
 */
export function getCallbackUrl(user: { id: string; email: string }) {
  // TODO: Implementar lógica de redirecionamento conforme critérios do usuário

  // Exemplo de lógica condicional:
  // 1. Verificar se é o primeiro login do usuário
  // if (user.isFirstLogin) {
  //   return "/bem-vindo";
  // }

  // 2. Verificar se completou o onboarding
  // if (!user.hasCompletedOnboarding) {
  //   return "/onboarding";
  // }

  // 3. Verificar papel do usuário
  // if (user.role === "admin") {
  //   return "/admin/dashboard";
  // }

  // 4. Usar URL de retorno da query string
  // const returnUrl = new URLSearchParams(window.location.search).get("returnUrl");
  // if (returnUrl) {
  //   return returnUrl;
  // }

  // 5. Redirecionar para dashboard por padrão
  // return "/dashboard";
}
