import { SpecialtiesResponse } from "@/features/specialties/types/specialty.types";
import { queryKeys } from "@/shared/constants";
import { container } from "@/shared/di/factory-root";
import { useInfiniteQuery } from "@tanstack/react-query";

interface useGetSpecialitiesParams {
  limit?: number;
  query?: string;
  enabled?: boolean;
}

export function useGetSpecialities(params: useGetSpecialitiesParams = {}) {
  const {
    limit = 50,
    query = undefined,
    enabled = true
  } = params;

  return useInfiniteQuery({
    queryKey: [...queryKeys.specialties.list({ limit }), query],
    queryFn: async ({ pageParam }): Promise<SpecialtiesResponse> => {
      const service = container().services.specialities_service;

      const response = await service.get({
        c: pageParam,
        l: limit,
        q: query,
      });

      return response?.data as SpecialtiesResponse;
    },
    throwOnError(error, query) {
      console.error("Error fetching specialities:", { error, query });
      return true;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: SpecialtiesResponse) =>
      lastPage.has_more ? lastPage.next_cursor : undefined,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}