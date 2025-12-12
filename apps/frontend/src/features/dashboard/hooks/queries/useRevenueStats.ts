// ============================================================================
// USE REVENUE STATS - Query Hook for Revenue Statistics
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../api";
import type { RevenueStats } from "../../types";

type RevenuePeriod = "day" | "week" | "month" | "year";

interface UseRevenueStatsOptions {
  unitId: string | undefined;
  period?: RevenuePeriod;
  enabled?: boolean;
}

/**
 * Query hook to fetch revenue statistics
 */
export function useRevenueStats({
  unitId,
  period = "month",
  enabled = true,
}: UseRevenueStatsOptions) {
  return useQuery<RevenueStats, Error>({
    queryKey: ["dashboard", "revenue", unitId, period],
    queryFn: () => dashboardService.getRevenueStats(unitId!, period),
    enabled: enabled && !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
