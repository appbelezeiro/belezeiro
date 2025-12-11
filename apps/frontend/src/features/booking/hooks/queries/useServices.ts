// ============================================================================
// USE SERVICES - Query Hook for Available Services
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { bookingService } from "../../api";
import type { Service, ServiceCategory } from "../../types";

interface UseServicesOptions {
  unitId: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch available services for a unit
 */
export function useServices({ unitId, enabled = true }: UseServicesOptions) {
  return useQuery<Service[], Error>({
    queryKey: queryKeys.booking.services(unitId),
    queryFn: () => bookingService.getServices(unitId),
    enabled: enabled && !!unitId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to get services grouped by category
 */
export function useServicesGrouped({ unitId, enabled = true }: UseServicesOptions) {
  const query = useServices({ unitId, enabled });

  const groupedServices: ServiceCategory[] = query.data
    ? Object.entries(
        query.data.reduce((acc, service) => {
          if (!acc[service.category]) {
            acc[service.category] = [];
          }
          acc[service.category].push(service);
          return acc;
        }, {} as Record<string, Service[]>)
      ).map(([name, services]) => ({
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        services,
      }))
    : [];

  return {
    ...query,
    groupedServices,
  };
}
