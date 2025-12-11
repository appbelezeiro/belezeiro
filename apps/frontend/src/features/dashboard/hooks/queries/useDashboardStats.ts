// ============================================================================
// USE DASHBOARD STATS - Query Hook for Dashboard KPIs
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { dashboardService } from "../../api";
import type { DashboardStats } from "../../types";

interface UseDashboardStatsOptions {
  unitId?: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch dashboard stats/KPIs
 */
export function useDashboardStats({
  unitId,
  enabled = true,
}: UseDashboardStatsOptions = {}) {
  return useQuery<DashboardStats, Error>({
    queryKey: queryKeys.dashboard.stats(),
    queryFn: () => dashboardService.getStats(unitId),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (stats change frequently)
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
}
