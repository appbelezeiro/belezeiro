// ============================================================================
// USE LOGIN - Hook para realizar login
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { queryKeys } from '@/shared/constants/query-keys';
import { getAuthService } from '../../api';
import type { LoginRequest, LoginResult } from '../../types/auth.types';

/**
 * Opções do hook useLogin
 */
export interface UseLoginOptions {
  /**
   * Callback chamado após login bem-sucedido
   */
  onSuccess?: (data: LoginResult) => void;

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
 *
 * O backend retorna apenas { onboarding: false } quando onboarding não foi feito,
 * e não retorna nada quando já foi completado. O AuthService busca os dados
 * do usuário via /me após o login.
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

    onSuccess: (data: LoginResult) => {
      // Atualiza cache do usuário
      queryClient.setQueryData(queryKeys.auth.me(), data.user);

      // Mostra mensagem de sucesso
      toast.success(`Bem-vindo, ${data.user.name}!`);

      // Callback customizado
      onSuccess?.(data);

      // Redireciona baseado no estado de onboarding
      if (shouldRedirect) {
        if (data.needsOnboarding) {
          // Precisa fazer onboarding
          navigate('/onboarding');
        } else {
          // Onboarding já foi feito, vai para dashboard
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
  data: LoginResult;
} {
  return result.isSuccess && result.data !== undefined;
}
