// ============================================================================
// USE SUBMIT ONBOARDING - Mutation para submeter onboarding completo
// ============================================================================

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { onboardingService } from '../../api';
import { uploadService } from '@/features/upload/api/upload.service';
import type { OnboardingSubmitData, OnboardingResult } from '../../types';
import { toast } from '@/shared/lib/toast';
import { queryKeys } from '@/shared/constants/query-keys';

interface UseSubmitOnboardingOptions {
  onSuccess?: (data: OnboardingResult) => void;
  onError?: (error: Error) => void;
  onProgress?: (step: number) => void;
}

export function useSubmitOnboarding(options?: UseSubmitOnboardingOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      data,
      userId,
      logoFile,
      galleryFiles,
      onProgress,
    }: {
      data: OnboardingSubmitData;
      userId: string;
      logoFile?: File | null;
      galleryFiles?: File[];
      onProgress?: (step: number) => void;
    }): Promise<OnboardingResult> => {
      // Step 1: Create organization (backend marks onboarding complete if first business)
      onProgress?.(1);
      // Step 2: Create unit (without images)
      const result = await onboardingService.submitOnboarding(data, userId);

      // Step 3: Configure unit
      onProgress?.(2);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay for UX

      // Step 4: Upload images
      onProgress?.(3);

      // Upload logo if exists
      if (logoFile) {
        try {
          const presigned = await uploadService.generateUploadUrl(
            'logo',
            logoFile.name,
            logoFile.type
          );
          await uploadService.uploadToStorage(presigned.upload_url, logoFile);
          await uploadService.confirmUnitLogo(result.unit.id, presigned.key);
        } catch (error) {
          console.error('Logo upload failed:', error);
          // Continue even if logo upload fails
        }
      }

      // Upload gallery if exists
      if (galleryFiles && galleryFiles.length > 0) {
        try {
          onProgress?.(4);

          const presignedBatch = await uploadService.generateBatchUploadUrls(
            'gallery',
            galleryFiles.map((file) => ({
              fileName: file.name,
              contentType: file.type,
            }))
          );

          await Promise.all(
            presignedBatch.map((presigned, index) =>
              uploadService.uploadToStorage(presigned.upload_url, galleryFiles[index])
            )
          );

          const keys = presignedBatch.map((p) => p.key);
          await uploadService.confirmBatchGalleryUpload(result.unit.id, keys);
        } catch (error) {
          console.error('Gallery upload failed:', error);
          // Continue even if gallery upload fails
        }
      }

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
