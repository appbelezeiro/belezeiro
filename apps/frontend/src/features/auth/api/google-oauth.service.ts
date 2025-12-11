// ============================================================================
// GOOGLE OAUTH SERVICE - Serviço de integração com Google OAuth
// ============================================================================

import type { GoogleUserInfo, LoginRequest } from '../types/auth.types';
import { googleUserInfoSchema } from '../schemas/auth.schemas';

/**
 * URL da API do Google para buscar informações do usuário
 */
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';

/**
 * Serviço de integração com Google OAuth
 */
export class GoogleOAuthService {
  /**
   * Busca informações do usuário no Google usando access token
   */
  async getUserInfo(accessToken: string): Promise<GoogleUserInfo> {
    const response = await fetch(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar informações do Google: ${response.status}`);
    }

    const data: unknown = await response.json();
    return googleUserInfoSchema.parse(data);
  }

  /**
   * Converte informações do Google para formato de LoginRequest
   */
  mapToLoginRequest(googleUser: GoogleUserInfo): LoginRequest {
    return {
      name: googleUser.name,
      email: googleUser.email,
      providerId: `google_${googleUser.sub}`,
      photoUrl: googleUser.picture,
    };
  }

  /**
   * Busca informações do usuário e converte para LoginRequest
   * Método de conveniência que combina getUserInfo + mapToLoginRequest
   */
  async getLoginRequest(accessToken: string): Promise<LoginRequest> {
    const userInfo = await this.getUserInfo(accessToken);
    return this.mapToLoginRequest(userInfo);
  }
}

// Singleton do serviço
let googleOAuthServiceInstance: GoogleOAuthService | null = null;

/**
 * Retorna instância singleton do GoogleOAuthService
 */
export function getGoogleOAuthService(): GoogleOAuthService {
  if (!googleOAuthServiceInstance) {
    googleOAuthServiceInstance = new GoogleOAuthService();
  }
  return googleOAuthServiceInstance;
}

/**
 * Cria nova instância do GoogleOAuthService (útil para testes)
 */
export function createGoogleOAuthService(): GoogleOAuthService {
  return new GoogleOAuthService();
}
