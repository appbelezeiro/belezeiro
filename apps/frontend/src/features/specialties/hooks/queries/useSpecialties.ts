import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { specialtiesService } from "../../api";
import type { Specialty, SpecialtiesResponse } from "../../types/specialty.types";

interface UseSpecialtiesOptions {
  limit?: number;
  enabled?: boolean;
}

/**
 * Query hook to fetch specialties list with infinite scroll (cursor pagination)
 */
export function useSpecialties({ limit = 50, enabled = true }: UseSpecialtiesOptions = {}) {
  return useInfiniteQuery<SpecialtiesResponse, Error>({
    queryKey: queryKeys.specialties.list({ limit }),
    queryFn: ({ pageParam }) =>
      specialtiesService.getSpecialties(pageParam as string | undefined, limit),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Query hook to search specialties with infinite scroll
 */
export function useSearchSpecialties(
  query: string,
  { limit = 20, enabled = true }: UseSpecialtiesOptions = {}
) {
  return useInfiniteQuery<SpecialtiesResponse, Error>({
    queryKey: queryKeys.specialties.search(query, { limit }),
    queryFn: ({ pageParam }) =>
      specialtiesService.searchSpecialties(
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
 * Query hook to fetch a single specialty by ID
 */
export function useSpecialty(specialtyId: string, { enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<Specialty, Error>({
    queryKey: queryKeys.specialties.detail(specialtyId),
    queryFn: () => specialtiesService.getSpecialty(specialtyId),
    enabled: enabled && !!specialtyId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
