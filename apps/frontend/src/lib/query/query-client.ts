// ============================================================================
// QUERY CLIENT - Configuração do React Query
// ============================================================================

import { QueryClient } from '@tanstack/react-query';
import { defaultQueryOptions } from './default-options';

/**
 * Cria uma nova instância do QueryClient
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: defaultQueryOptions,
  });
}

/**
 * Singleton do QueryClient
 */
let queryClientInstance: QueryClient | null = null;

/**
 * Retorna o QueryClient singleton
 */
export function getQueryClient(): QueryClient {
  if (!queryClientInstance) {
    queryClientInstance = createQueryClient();
  }
  return queryClientInstance;
}

/**
 * Reseta o QueryClient (útil para logout ou testes)
 */
export function resetQueryClient(): void {
  if (queryClientInstance) {
    queryClientInstance.clear();
    queryClientInstance = null;
  }
}
