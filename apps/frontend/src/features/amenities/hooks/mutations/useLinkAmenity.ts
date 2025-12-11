// ============================================================================
// USE LINK AMENITY - Mutation Hooks for Linking/Unlinking Amenities to Units
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitAmenitiesService } from "../../api";

interface LinkAmenityPayload {
  amenityId: string;
}

/**
 * Mutation hook to link an amenity to a unit
 */
export function useLinkAmenity(unitId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, LinkAmenityPayload>({
    mutationFn: ({ amenityId }) =>
      unitAmenitiesService.linkAmenity(unitId, amenityId),
    onSuccess: () => {
      // Invalidate unit amenities list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitAmenities.list(unitId),
      });
    },
  });
}

interface UnlinkAmenityPayload {
  amenityId: string;
}

/**
 * Mutation hook to unlink an amenity from a unit
 */
export function useUnlinkAmenity(unitId: string) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, UnlinkAmenityPayload>({
    mutationFn: ({ amenityId }) =>
      unitAmenitiesService.unlinkAmenity(unitId, amenityId),
    onSuccess: () => {
      // Invalidate unit amenities list to refetch
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitAmenities.list(unitId),
      });
    },
  });
}
