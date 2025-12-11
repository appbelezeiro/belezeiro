// ============================================================================
// AUTH SERVICE - Serviço de autenticação
// ============================================================================

import type { IHttpClient } from '@/lib/api';
import { getPublicClient, getPrivateClient, API_ENDPOINTS } from '@/lib/api';
import type {
  User,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RefreshTokenResponse,
  LogoutResponse,
} from '../types/auth.types';
import {
  loginRequestSchema,
  loginResponseSchema,
  meResponseSchema,
  refreshTokenResponseSchema,
  logoutResponseSchema,
} from '../schemas/auth.schemas';

/**
 * Serviço de autenticação
 * Responsável por todas as chamadas de API relacionadas a auth
 */
export class AuthService {
  private readonly publicClient: IHttpClient;
  private readonly privateClient: IHttpClient;

  constructor(publicClient?: IHttpClient, privateClient?: IHttpClient) {
    this.publicClient = publicClient ?? getPublicClient();
    this.privateClient = privateClient ?? getPrivateClient();
  }

  /**
   * Realiza login com dados do OAuth
   */
  async login(request: LoginRequest): Promise<LoginResponse> {
    // Valida dados de entrada
    const validatedRequest = loginRequestSchema.parse(request);

    // Faz chamada à API
    const response = await this.publicClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      validatedRequest,
      { withCredentials: true }
    );

    // Valida e retorna resposta
    return loginResponseSchema.parse(response.data);
  }

  /**
   * Busca dados do usuário autenticado
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.privateClient.get<MeResponse>(
      API_ENDPOINTS.AUTH.ME
    );

    const validatedResponse = meResponseSchema.parse(response.data);
    return validatedResponse.user;
  }

  /**
   * Verifica se usuário está autenticado
   * Retorna usuário se autenticado, null caso contrário
   */
  async checkAuth(): Promise<User | null> {
    try {
      return await this.getCurrentUser();
    } catch {
      return null;
    }
  }

  /**
   * Realiza refresh do token
   */
  async refreshToken(): Promise<void> {
    const response = await this.publicClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH,
      {},
      { withCredentials: true }
    );

    refreshTokenResponseSchema.parse(response.data);
  }

  /**
   * Realiza logout
   */
  async logout(): Promise<void> {
    const response = await this.privateClient.post<LogoutResponse>(
      API_ENDPOINTS.AUTH.LOGOUT
    );

    logoutResponseSchema.parse(response.data);
  }
}

// Singleton do serviço
let authServiceInstance: AuthService | null = null;

/**
 * Retorna instância singleton do AuthService
 */
export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    authServiceInstance = new AuthService();
  }
  return authServiceInstance;
}

/**
 * Cria nova instância do AuthService (útil para testes)
 */
export function createAuthService(
  publicClient?: IHttpClient,
  privateClient?: IHttpClient
): AuthService {
  return new AuthService(publicClient, privateClient);
}
