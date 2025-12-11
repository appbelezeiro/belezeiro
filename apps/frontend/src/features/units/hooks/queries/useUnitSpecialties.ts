// ============================================================================
// USE UNIT SPECIALTIES - Query Hook for Unit Specialties
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitSpecialtiesService } from "../../api";
import type { UnitSpecialtiesResponse } from "../../types/unit-specialty.types";

interface UseUnitSpecialtiesOptions {
  unitId: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch all specialties linked to a unit
 */
export function useUnitSpecialties({
  unitId,
  enabled = true,
}: UseUnitSpecialtiesOptions) {
  return useQuery<UnitSpecialtiesResponse, Error>({
    queryKey: queryKeys.unitSpecialties.list(unitId),
    queryFn: () => unitSpecialtiesService.getUnitSpecialties(unitId),
    enabled: enabled && !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
