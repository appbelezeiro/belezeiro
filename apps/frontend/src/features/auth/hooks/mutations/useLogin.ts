// ============================================================================
// USE LOGIN - Hook para realizar login
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/constants/query-keys';
import { getAuthService } from '../../api';
import type { LoginRequest, LoginResponse } from '../../types/auth.types';

/**
 * Opções do hook useLogin
 */
export interface UseLoginOptions {
  /**
   * Callback chamado após login bem-sucedido
   */
  onSuccess?: (data: LoginResponse) => void;

  /**
   * Callback chamado em caso de erro
   */
  onError?: (error: Error) => void;

  /**
   * URL para redirecionar após login
   * @default '/dashboard'
   */
  redirectTo?: string;

  /**
   * Se deve redirecionar automaticamente após login
   * @default true
   */
  shouldRedirect?: boolean;
}

/**
 * Hook para realizar login
 */
export function useLogin(options: UseLoginOptions = {}) {
  const {
    onSuccess,
    onError,
    redirectTo = '/dashboard',
    shouldRedirect = true,
  } = options;

  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const authService = getAuthService();

  return useMutation({
    mutationFn: (request: LoginRequest) => authService.login(request),

    onSuccess: (data) => {
      // Atualiza cache do usuário
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // Mostra mensagem de sucesso
      toast.success(`Bem-vindo, ${data.user.name}!`);

      // Callback customizado
      onSuccess?.(data);

      // Redireciona
      if (shouldRedirect) {
        // Se onboarding não está completo, redireciona para onboarding
        if (data.onboarding === false) {
          navigate('/onboarding');
        } else if (data.created) {
          // Se é primeiro login, redireciona para bem-vindo
          navigate('/bem-vindo');
        } else {
          navigate(redirectTo);
        }
      }
    },

    onError: (error: Error) => {
      toast.error(error.message || 'Erro ao fazer login');
      onError?.(error);
    },
  });
}

/**
 * Tipo de retorno do useLogin
 */
export type UseLoginReturn = ReturnType<typeof useLogin>;

/**
 * Helper para verificar se o login foi bem-sucedido
 */
export function isLoginSuccess(result: UseLoginReturn): result is UseLoginReturn & {
  data: LoginResponse;
} {
  return result.isSuccess && result.data !== undefined;
}
