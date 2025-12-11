// ============================================================================
// USE LOGOUT - Hook para realizar logout
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/constants/query-keys';
import { resetApiClients } from '@/lib/api';
import { getAuthService } from '../../api';

/**
 * Opções do hook useLogout
 */
export interface UseLogoutOptions {
  /**
   * Callback chamado após logout bem-sucedido
   */
  onSuccess?: () => void;

  /**
   * Callback chamado em caso de erro
   */
  onError?: (error: Error) => void;

  /**
   * URL para redirecionar após logout
   * @default '/login'
   */
  redirectTo?: string;

  /**
   * Se deve redirecionar automaticamente após logout
   * @default true
   */
  shouldRedirect?: boolean;

  /**
   * Se deve mostrar toast de sucesso
   * @default true
   */
  showSuccessToast?: boolean;
}

/**
 * Hook para realizar logout
 */
export function useLogout(options: UseLogoutOptions = {}) {
  const {
    onSuccess,
    onError,
    redirectTo = '/login',
    shouldRedirect = true,
    showSuccessToast = true,
  } = options;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authService = getAuthService();

  return useMutation({
    mutationFn: () => authService.logout(),

    onSuccess: () => {
      // Limpa cache do usuário
      queryClient.setQueryData(queryKeys.auth.me(), null);

      // Limpa todo o cache do React Query
      queryClient.clear();

      // Mostra mensagem de sucesso
      if (showSuccessToast) {
        toast.success('Desconectado com sucesso!');
      }

      // Callback customizado
      onSuccess?.();

      // Redireciona
      if (shouldRedirect) {
        navigate(redirectTo);
      }
    },

    onError: (error: Error) => {
      // Mesmo com erro, limpa o estado local
      queryClient.setQueryData(queryKeys.auth.me(), null);
      queryClient.clear();

      toast.error(error.message || 'Erro ao desconectar');
      onError?.(error);

      // Redireciona mesmo com erro
      if (shouldRedirect) {
        navigate(redirectTo);
      }
    },
  });
}

/**
 * Hook para logout forçado (sem chamada à API)
 * Útil quando a sessão já expirou
 */
export function useForceLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return (redirectTo: string = '/login') => {
    // Limpa cache
    queryClient.setQueryData(queryKeys.auth.me(), null);
    queryClient.clear();

    // Reseta clientes API
    resetApiClients();

    // Mostra mensagem
    toast.info('Sua sessão expirou. Faça login novamente.');

    // Redireciona
    navigate(redirectTo);
  };
}
