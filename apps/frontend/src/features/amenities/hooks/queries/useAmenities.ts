// ============================================================================
// USE AMENITIES - Query Hook for Amenities List with Infinite Scroll
// ============================================================================

import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { amenitiesService } from "../../api";
import type { Amenity, AmenitiesResponse } from "../../types/amenity.types";

interface UseAmenitiesOptions {
  limit?: number;
  enabled?: boolean;
}

/**
 * Query hook to fetch amenities list with infinite scroll (cursor pagination)
 */
export function useAmenities({ limit = 20, enabled = true }: UseAmenitiesOptions = {}) {
  return useInfiniteQuery<AmenitiesResponse, Error>({
    queryKey: queryKeys.amenities.list({ limit }),
    queryFn: ({ pageParam }) =>
      amenitiesService.getAmenities(pageParam as string | undefined, limit),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to search amenities with infinite scroll
 */
export function useSearchAmenities(
  query: string,
  { limit = 20, enabled = true }: UseAmenitiesOptions = {}
) {
  return useInfiniteQuery<AmenitiesResponse, Error>({
    queryKey: queryKeys.amenities.search(query, { limit }),
    queryFn: ({ pageParam }) =>
      amenitiesService.searchAmenities(
        query,
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
 * Query hook to fetch a single amenity by ID
 */
export function useAmenity(amenityId: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<Amenity, Error>({
    queryKey: queryKeys.amenities.detail(amenityId),
    queryFn: () => amenitiesService.getAmenity(amenityId),
    enabled: enabled && !!amenityId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
