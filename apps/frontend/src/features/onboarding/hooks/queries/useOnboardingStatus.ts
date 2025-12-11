// ============================================================================
// USE ONBOARDING STATUS - Query para verificar status do onboarding
// ============================================================================

import { useQuery } from '@tanstack/react-query';
import { onboardingService } from '../../api';
import type { OrganizationDTO, UnitDTO } from '../../types';

interface OnboardingStatus {
  hasOrganization: boolean;
  hasUnit: boolean;
  organization: OrganizationDTO | null;
  units: UnitDTO[];
  isComplete: boolean;
}

export function useOnboardingStatus(userId: string | undefined) {
  return useQuery<OnboardingStatus>({
    queryKey: ['onboarding-status', userId],
    queryFn: async () => {
      if (!userId) {
        return {
          hasOrganization: false,
          hasUnit: false,
          organization: null,
          units: [],
          isComplete: false,
        };
      }

      const status = await onboardingService.checkOnboardingStatus(userId);

      return {
        ...status,
        isComplete: status.hasOrganization && status.hasUnit,
      };
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}
