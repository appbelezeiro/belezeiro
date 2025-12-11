// ============================================================================
// USE LINK UNIT SPECIALTY - Mutation Hook for Linking Specialties to Units
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitSpecialtiesService } from "../../api";
import type {
  LinkUnitSpecialtyPayload,
  UnitSpecialtyWithDetails,
} from "../../types/unit-specialty.types";

interface LinkUnitSpecialtyParams {
  unitId: string;
  data: LinkUnitSpecialtyPayload;
}

/**
 * Mutation hook to link a specialty to a unit
 */
export function useLinkUnitSpecialty() {
  const queryClient = useQueryClient();

  return useMutation<UnitSpecialtyWithDetails, Error, LinkUnitSpecialtyParams>({
    mutationFn: ({ unitId, data }) =>
      unitSpecialtiesService.linkUnitSpecialty(unitId, data),
    onSuccess: (_, variables) => {
      // Invalidate the unit specialties list
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitSpecialties.list(variables.unitId),
      });
    },
  });
}
