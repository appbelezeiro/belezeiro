// ============================================================================
// USE SUBMIT ONBOARDING - Mutation para submeter onboarding completo
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../../api';
import type { OnboardingSubmitData, OnboardingResult } from '../../types';
import { toast } from '@/shared/lib/toast';

interface UseSubmitOnboardingOptions {
  onSuccess?: (data: OnboardingResult) => void;
  onError?: (error: Error) => void;
}

export function useSubmitOnboarding(options?: UseSubmitOnboardingOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
    }: {
      data: OnboardingSubmitData;
      userId: string;
    }): Promise<OnboardingResult> => {
      return onboardingService.submitOnboarding(data, userId);
    },
    onSuccess: (result) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['organization'] });
      queryClient.invalidateQueries({ queryKey: ['units'] });
      queryClient.invalidateQueries({ queryKey: ['onboarding-status'] });

      toast.success({
        title: 'Cadastro concluído!',
        description: 'Sua empresa foi criada com sucesso.',
      });

      options?.onSuccess?.(result);
    },
    onError: (error: Error) => {
      console.error('Onboarding error:', error);

      toast.error({
        title: 'Erro ao criar cadastro',
        description: error.message || 'Tente novamente mais tarde.',
      });

      options?.onError?.(error);
    },
  });
}
