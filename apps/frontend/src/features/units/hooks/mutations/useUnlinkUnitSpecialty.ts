// ============================================================================
// USE UNLINK UNIT SPECIALTY - Mutation Hook for Unlinking Specialties from Units
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitSpecialtiesService } from "../../api";

interface UnlinkUnitSpecialtyParams {
  unitId: string;
  specialtyId: string;
}

/**
 * Mutation hook to unlink a specialty from a unit
 */
export function useUnlinkUnitSpecialty() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UnlinkUnitSpecialtyParams>({
    mutationFn: ({ unitId, specialtyId }) =>
      unitSpecialtiesService.unlinkUnitSpecialty(unitId, specialtyId),
    onSuccess: (_, variables) => {
      // Invalidate the unit specialties list
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitSpecialties.list(variables.unitId),
      });
    },
  });
}
