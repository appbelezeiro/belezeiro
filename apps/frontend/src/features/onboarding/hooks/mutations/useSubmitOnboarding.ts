// ============================================================================
// USE SUBMIT ONBOARDING - Mutation para submeter onboarding completo
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../../api';
import { privateClient } from '@/services/api/client';
import type { OnboardingSubmitData, OnboardingResult } from '../../types';
import { toast } from '@/shared/lib/toast';
import { queryKeys } from '@/shared/constants/query-keys';

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
      logoFile,
      galleryFiles,
    }: {
      data: OnboardingSubmitData;
      userId: string;
      logoFile?: File | null;
      galleryFiles?: File[];
    }): Promise<OnboardingResult> => {
      // Step 1: Create organization and unit
      const result = await onboardingService.submitOnboarding(data, userId);

      // Step 2: Upload images if they exist
      if (logoFile || (galleryFiles && galleryFiles.length > 0)) {
        await onboardingService.uploadImagesAndUpdateUnit({
          unitId: result.unit.id,
          userId,
          logoFile,
          galleryFiles,
        });
      }

      // Step 3: Mark onboarding as complete
      await privateClient.post('/api/users/complete-onboarding', {
        userId,
      });

      return result;
    },
    onSuccess: (result) => {
      // Invalidate user cache to fetch updated onboardingCompleted
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

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
