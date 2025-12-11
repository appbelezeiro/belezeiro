// ============================================================================
// USE CREATE AMENITY - Mutation Hook for Creating Amenities
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { amenitiesService } from "../../api";
import type { CreateAmenityPayload, Amenity } from "../../types/amenity.types";

/**
 * Mutation hook to create a new amenity
 */
export function useCreateAmenity() {
  const queryClient = useQueryClient();

  return useMutation<Amenity, Error, CreateAmenityPayload>({
    mutationFn: (data) => amenitiesService.createAmenity(data),
    onSuccess: () => {
      // Invalidate all amenity lists to refetch with new data
      queryClient.invalidateQueries({
        queryKey: queryKeys.amenities.lists(),
      });
    },
  });
}
