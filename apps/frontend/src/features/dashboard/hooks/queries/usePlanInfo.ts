// ============================================================================
// USE PLAN INFO - Query Hook for Subscription Plan Info
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../api";
import type { PlanInfo } from "../../types";

interface UsePlanInfoOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch subscription plan info
 */
export function usePlanInfo({ enabled = true }: UsePlanInfoOptions = {}) {
  return useQuery<PlanInfo, Error>({
    queryKey: ["dashboard", "plan"],
    queryFn: () => dashboardService.getPlanInfo(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes (plan info changes rarely)
  });
}
