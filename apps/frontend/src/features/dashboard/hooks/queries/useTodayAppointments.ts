// ============================================================================
// USE TODAY APPOINTMENTS - Query Hook for Today's Appointments
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { dashboardService } from "../../api";
import type { DashboardAppointmentsResponse } from "../../types";

interface UseTodayAppointmentsOptions {
  unitId?: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch today's appointments for the dashboard
 */
export function useTodayAppointments({
  unitId,
  enabled = true,
}: UseTodayAppointmentsOptions = {}) {
  return useQuery<DashboardAppointmentsResponse, Error>({
    queryKey: queryKeys.dashboard.recentBookings(),
    queryFn: () => dashboardService.getTodayAppointments(unitId),
    enabled,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 2 * 60 * 1000, // Refetch every 2 minutes
  });
}
