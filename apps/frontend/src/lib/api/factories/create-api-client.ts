// ============================================================================
// API CLIENT FACTORY - Criação de clientes HTTP configurados
// ============================================================================

import { AxiosHttpClient } from '../client/axios-http-client';
import type { IHttpClient } from '../contracts/http-client.types';
import {
  setupAuthInterceptor,
  setupErrorInterceptor,
  setupLoggingInterceptor,
  type AuthInterceptorCallbacks,
} from '../interceptors';
import { API_BASE_URL, API_TIMEOUT, API_WITH_CREDENTIALS } from '../config';

/**
 * Opções de criação do cliente API
 */
export interface CreateApiClientOptions {
  baseURL?: string;
  timeout?: number;
  withCredentials?: boolean;
  authCallbacks?: AuthInterceptorCallbacks;
  enableLogging?: boolean;
  enableErrorInterceptor?: boolean;
  enableAuthInterceptor?: boolean;
}

/**
 * Singleton do cliente público (sem interceptor de auth)
 */
let publicClientInstance: IHttpClient | null = null;

/**
 * Singleton do cliente privado (com interceptor de auth)
 */
let privateClientInstance: IHttpClient | null = null;

/**
 * Callbacks de autenticação globais
 */
let globalAuthCallbacks: AuthInterceptorCallbacks = {};

/**
 * Define os callbacks de autenticação globais
 */
export function setGlobalAuthCallbacks(callbacks: AuthInterceptorCallbacks): void {
  globalAuthCallbacks = callbacks;
}

/**
 * Cria um novo cliente API com as configurações especificadas
 */
export function createApiClient(options: CreateApiClientOptions = {}): IHttpClient {
  const {
    baseURL = API_BASE_URL,
    timeout = API_TIMEOUT,
    withCredentials = API_WITH_CREDENTIALS,
    authCallbacks,
    enableLogging = import.meta.env.DEV,
    enableErrorInterceptor = true,
    enableAuthInterceptor = false,
  } = options;

  const client = new AxiosHttpClient({
    baseURL,
    timeout,
    withCredentials,
  });

  // Adiciona interceptadores na ordem correta

  // 1. Logging (primeiro, para capturar tudo)
  if (enableLogging) {
    setupLoggingInterceptor(client);
  }

  // 2. Error interceptor (padroniza erros)
  if (enableErrorInterceptor) {
    setupErrorInterceptor(client);
  }

  // 3. Auth interceptor (refresh de token)
  if (enableAuthInterceptor) {
    setupAuthInterceptor(
      client,
      '/api/auth/refresh',
      authCallbacks ?? globalAuthCallbacks
    );
  }

  return client;
}

/**
 * Retorna o cliente público (singleton)
 * Usado para endpoints que não precisam de autenticação
 * Ex: login, refresh token, páginas públicas
 */
export function getPublicClient(): IHttpClient {
  if (!publicClientInstance) {
    publicClientInstance = createApiClient({
      enableAuthInterceptor: false,
    });
  }
  return publicClientInstance;
}

/**
 * Retorna o cliente privado (singleton)
 * Usado para endpoints que precisam de autenticação
 * Inclui refresh automático de token
 */
export function getPrivateClient(): IHttpClient {
  if (!privateClientInstance) {
    privateClientInstance = createApiClient({
      enableAuthInterceptor: true,
    });
  }
  return privateClientInstance;
}

/**
 * Reseta os singletons dos clientes
 * Útil para testes ou logout
 */
export function resetApiClients(): void {
  publicClientInstance = null;
  privateClientInstance = null;
}
