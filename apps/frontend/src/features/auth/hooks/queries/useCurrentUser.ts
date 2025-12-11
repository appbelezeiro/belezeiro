// ============================================================================
// USE CURRENT USER - Hook para buscar usuário atual
// ============================================================================

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants/query-keys';
import { getAuthService } from '../../api';
import type { User } from '../../types/auth.types';

/**
 * Opções do hook useCurrentUser
 */
export interface UseCurrentUserOptions {
  /**
   * Se deve buscar automaticamente ao montar
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook para buscar o usuário atualmente autenticado
 * Usa React Query para cache e gerenciamento de estado
 */
export function useCurrentUser(options: UseCurrentUserOptions = {}) {
  const { enabled = true } = options;
  const authService = getAuthService();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
    retry: false, // Não retry em erros de auth
  });
}

/**
 * Hook para verificar se usuário está autenticado
 * Retorna dados derivados do useCurrentUser
 */
export function useIsAuthenticated(): boolean {
  const { data: user, isLoading } = useCurrentUser();
  return !isLoading && user !== undefined && user !== null;
}

/**
 * Hook para invalidar cache do usuário atual
 */
export function useInvalidateCurrentUser() {
  const queryClient = useQueryClient();

  return () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.auth.me(),
    });
  };
}

/**
 * Hook para definir o usuário no cache
 */
export function useSetCurrentUser() {
  const queryClient = useQueryClient();

  return (user: User | null) => {
    queryClient.setQueryData(queryKeys.auth.me(), user);
  };
}

/**
 * Hook para limpar cache de autenticação
 */
export function useClearAuthCache() {
  const queryClient = useQueryClient();

  return () => {
    queryClient.removeQueries({
      queryKey: queryKeys.auth.all,
    });
  };
}
