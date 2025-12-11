// ============================================================================
// USE UNIT SERVICES - Query Hook for Unit Services with Infinite Scroll
// ============================================================================

import { useInfiniteQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitServicesService } from "../../api";
import type { UnitServicesResponse } from "../../types/unit-service.types";

interface UseUnitServicesOptions {
  unitId: string;
  limit?: number;
  enabled?: boolean;
}

/**
 * Query hook to fetch all services linked to a unit with infinite scroll (cursor pagination)
 */
export function useUnitServices({
  unitId,
  limit = 20,
  enabled = true,
}: UseUnitServicesOptions) {
  return useInfiniteQuery<UnitServicesResponse, Error>({
    queryKey: queryKeys.unitServices.list(unitId, { limit }),
    queryFn: ({ pageParam }) =>
      unitServicesService.getUnitServices(
        unitId,
        pageParam as string | undefined,
        limit
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled: enabled && !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
