// ============================================================================
// USE SERVICES - Query Hook for Services List
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { ServicesListResponse, ServiceFilters } from "../../types";

interface UseServicesOptions extends ServiceFilters {
  enabled?: boolean;
}

/**
 * Query hook to fetch services list with pagination and filters
 */
export function useServices({
  enabled = true,
  ...filters
}: UseServicesOptions = {}) {
  return useQuery<ServicesListResponse, Error>({
    queryKey: queryKeys.services.list(filters),
    queryFn: () => servicesService.getServices(filters),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to fetch active services only
 */
export function useActiveServices(enabled = true) {
  return useQuery({
    queryKey: queryKeys.services.active(),
    queryFn: () => servicesService.getActiveServices(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
