// ============================================================================
// USE CREATE SPECIALTY - Mutation Hook for Creating Specialties
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { specialtiesService } from "../../api";
import type { CreateSpecialtyPayload, Specialty } from "../../types/specialty.types";

/**
 * Mutation hook to create a new specialty
 */
export function useCreateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation<Specialty, Error, CreateSpecialtyPayload>({
    mutationFn: (data) => specialtiesService.createSpecialty(data),
    onSuccess: () => {
      // Invalidate all specialty lists to refetch with new data
      queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.lists(),
      });
    },
  });
}
