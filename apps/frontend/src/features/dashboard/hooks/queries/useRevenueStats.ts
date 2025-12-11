// ============================================================================
// USE REVENUE STATS - Query Hook for Revenue Statistics
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { dashboardService } from "../../api";
import type { RevenueStats } from "../../types";

type RevenuePeriod = "day" | "week" | "month" | "year";

interface UseRevenueStatsOptions {
  period?: RevenuePeriod;
  enabled?: boolean;
}

/**
 * Query hook to fetch revenue statistics
 */
export function useRevenueStats({
  period = "month",
  enabled = true,
}: UseRevenueStatsOptions = {}) {
  return useQuery<RevenueStats, Error>({
    queryKey: queryKeys.dashboard.revenue(period),
    queryFn: () => dashboardService.getRevenueStats(period),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
