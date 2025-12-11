// ============================================================================
// USE SERVICE - Query Hook for Single Service
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { ServiceWithStats } from "../../types";

interface UseServiceOptions {
  serviceId: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch a single service by ID
 */
export function useService({ serviceId, enabled = true }: UseServiceOptions) {
  return useQuery<ServiceWithStats, Error>({
    queryKey: queryKeys.services.detail(serviceId),
    queryFn: () => servicesService.getService(serviceId),
    enabled: enabled && !!serviceId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
