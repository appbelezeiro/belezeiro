// ============================================================================
// REACT QUERY DEFAULT OPTIONS - Configurações padrão
// ============================================================================

import type { DefaultOptions } from '@tanstack/react-query';

/**
 * Tempo que os dados são considerados "frescos" (5 minutos)
 */
export const STALE_TIME = 5 * 60 * 1000;

/**
 * Tempo que os dados ficam no cache (10 minutos)
 */
export const GC_TIME = 10 * 60 * 1000;

/**
 * Número de tentativas em caso de erro
 */
export const RETRY_COUNT = 3;

/**
 * Opções padrão do React Query
 */
export const defaultQueryOptions: DefaultOptions = {
  queries: {
    // Dados são considerados frescos por 5 minutos
    staleTime: STALE_TIME,

    // Dados permanecem no cache por 10 minutos após não serem usados
    gcTime: GC_TIME,

    // Retry 3 vezes em caso de erro
    retry: RETRY_COUNT,

    // Delay exponencial entre retries
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    // Não refetch ao focar a janela (comportamento mais previsível)
    refetchOnWindowFocus: false,

    // Refetch ao reconectar (importante para mobile)
    refetchOnReconnect: true,

    // Não refetch automaticamente ao montar
    refetchOnMount: true,
  },

  mutations: {
    // Apenas 1 retry para mutations
    retry: 1,

    // Delay entre retries
    retryDelay: 1000,
  },
};

/**
 * Opções para queries que precisam ser sempre atualizadas
 */
export const alwaysFreshOptions = {
  staleTime: 0,
  refetchOnMount: true,
  refetchOnWindowFocus: true,
} as const;

/**
 * Opções para dados que mudam raramente
 */
export const rarelyChangesOptions = {
  staleTime: 30 * 60 * 1000, // 30 minutos
  gcTime: 60 * 60 * 1000, // 1 hora
  refetchOnMount: false,
} as const;

/**
 * Opções para dados estáticos (configurações, etc)
 */
export const staticDataOptions = {
  staleTime: Infinity,
  gcTime: Infinity,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
} as const;
