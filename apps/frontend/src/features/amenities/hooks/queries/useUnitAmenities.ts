// ============================================================================
// USE UNIT AMENITIES - Query Hook for Unit Amenities
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitAmenitiesService } from "../../api";
import type { UnitAmenityWithDetails } from "../../types/amenity.types";

interface UseUnitAmenitiesOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch amenities linked to a unit
 */
export function useUnitAmenities(
  unitId: string,
  { enabled = true }: UseUnitAmenitiesOptions = {}
) {
  return useQuery<{ items: UnitAmenityWithDetails[] }, Error>({
    queryKey: queryKeys.unitAmenities.list(unitId),
    queryFn: () => unitAmenitiesService.getUnitAmenities(unitId),
    enabled: enabled && !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
