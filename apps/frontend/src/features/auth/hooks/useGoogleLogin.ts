// ============================================================================
// USE GOOGLE LOGIN - Hook para login com Google OAuth
// ============================================================================

import { useCallback, useState } from 'react';
import { useGoogleLogin as useGoogleOAuthLogin } from '@react-oauth/google';
import { getGoogleOAuthService } from '../api';
import { useLogin } from './mutations/useLogin';
import type { UseLoginOptions } from './mutations/useLogin';
import { toast } from '@/shared/lib/toast';

/**
 * Estado do login com Google
 */
export interface GoogleLoginState {
  isLoading: boolean;
  error: Error | null;
}

/**
 * Opções do hook useGoogleLogin
 */
export interface UseGoogleLoginOptions extends UseLoginOptions {
  /**
   * Callback chamado quando o popup do Google é aberto
   */
  onPopupOpen?: () => void;

  /**
   * Callback chamado quando o popup do Google é fechado
   */
  onPopupClose?: () => void;
}

/**
 * Hook para login com Google OAuth
 * Combina o fluxo OAuth do Google com o login da API
 */
export function useGoogleLogin(options: UseGoogleLoginOptions = {}) {
  const { onPopupOpen, onPopupClose, ...loginOptions } = options;

  const [state, setState] = useState<GoogleLoginState>({
    isLoading: false,
    error: null,
  });

  const loginMutation = useLogin(loginOptions);
  const googleOAuthService = getGoogleOAuthService();

  // Handler de sucesso do OAuth
  const handleGoogleSuccess = useCallback(
    async (tokenResponse: { access_token: string }) => {
      try {
        setState({ isLoading: true, error: null });

        // Busca informações do usuário no Google
        const loginRequest = await googleOAuthService.getLoginRequest(
          tokenResponse.access_token
        );

        // Faz login na API
        await loginMutation.mutateAsync(loginRequest);

        setState({ isLoading: false, error: null });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erro no login';
        setState({
          isLoading: false,
          error: error instanceof Error ? error : new Error('Erro no login'),
        });
        toast.error({
          title: 'Erro no login',
          description: errorMessage,
        });
      }
    },
    [googleOAuthService, loginMutation]
  );

  // Handler de erro do OAuth
  const handleGoogleError = useCallback(
    (error: unknown) => {
      const errorMessage =
        error instanceof Error ? error.message : 'Erro ao conectar com Google';

      setState({
        isLoading: false,
        error: new Error(errorMessage),
      });
      toast.error({
        title: 'Erro no login',
        description: errorMessage,
      });
    },
    []
  );

  // Configura o hook do Google OAuth
  const googleLogin = useGoogleOAuthLogin({
    onSuccess: handleGoogleSuccess,
    onError: handleGoogleError,
    onNonOAuthError: handleGoogleError,
  });

  // Função de login que será exposta
  const login = useCallback(() => {
    setState({ isLoading: true, error: null });
    onPopupOpen?.();
    googleLogin();
  }, [googleLogin, onPopupOpen]);

  return {
    login,
    isLoading: state.isLoading || loginMutation.isPending,
    error: state.error ?? loginMutation.error,
    isError: state.error !== null || loginMutation.isError,
    reset: () => {
      setState({ isLoading: false, error: null });
      loginMutation.reset();
    },
  };
}
