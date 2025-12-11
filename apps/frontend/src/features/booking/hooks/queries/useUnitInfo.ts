// ============================================================================
// USE UNIT INFO - Query Hook for Unit Information
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { bookingService } from "../../api";
import type { UnitInfo } from "../../types";

interface UseUnitInfoOptions {
  unitId?: string;
  slug?: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch unit information for public booking page
 * Can fetch by unitId or by slug
 */
export function useUnitInfo({ unitId, slug, enabled = true }: UseUnitInfoOptions) {
  return useQuery<UnitInfo, Error>({
    queryKey: unitId
      ? queryKeys.booking.unit(unitId)
      : queryKeys.booking.unitBySlug(slug ?? ""),
    queryFn: async () => {
      if (unitId) {
        return bookingService.getUnitInfo(unitId);
      }
      if (slug) {
        return bookingService.getUnitInfoBySlug(slug);
      }
      throw new Error("Either unitId or slug must be provided");
    },
    enabled: enabled && !!(unitId || slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
