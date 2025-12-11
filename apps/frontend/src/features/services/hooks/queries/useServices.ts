// ============================================================================
// USE SERVICES - Query Hook for Services List with Infinite Scroll
// ============================================================================

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { Service, ServiceWithSpecialty, ServicesResponse } from "../../types/service.types";

interface UseServicesOptions {
  specialtyId?: string;
  limit?: number;
  enabled?: boolean;
}

/**
 * Query hook to fetch services list with infinite scroll (cursor pagination)
 */
export function useServices({
  specialtyId,
  limit = 20,
  enabled = true,
}: UseServicesOptions = {}) {
  return useInfiniteQuery<ServicesResponse, Error>({
    queryKey: queryKeys.servicesGlobal.list({ specialty_id: specialtyId, limit }),
    queryFn: ({ pageParam }) =>
      servicesService.getServices(
        specialtyId,
        pageParam as string | undefined,
        limit
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to search services with infinite scroll
 */
export function useSearchServices(
  query: string,
  {
    specialtyId,
    limit = 20,
    enabled = true,
  }: UseServicesOptions = {}
) {
  return useInfiniteQuery<ServicesResponse, Error>({
    queryKey: queryKeys.servicesGlobal.search(query, {
      specialty_id: specialtyId,
      limit,
    }),
    queryFn: ({ pageParam }) =>
      servicesService.searchServices(
        query,
        specialtyId,
        pageParam as string | undefined,
        limit
      ),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled: enabled && !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to fetch a single service by ID
 */
export function useService(
  serviceId: string,
  { enabled = true }: { enabled?: boolean } = {}
) {
  return useQuery<ServiceWithSpecialty, Error>({
    queryKey: queryKeys.servicesGlobal.detail(serviceId),
    queryFn: () => servicesService.getService(serviceId),
    enabled: enabled && !!serviceId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
