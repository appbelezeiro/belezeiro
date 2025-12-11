// ============================================================================
// USE SPECIALTY STATUS - Mutation Hooks for Specialty Activation/Deactivation
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { specialtiesService } from "../../api";
import type { Specialty } from "../../types/specialty.types";

/**
 * Mutation hook to activate a specialty
 */
export function useActivateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation<Specialty, Error, string>({
    mutationFn: (specialtyId) =>
      specialtiesService.activateSpecialty(specialtyId),
    onSuccess: (_, specialtyId) => {
      // Invalidate lists and detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.detail(specialtyId),
      });
    },
  });
}

/**
 * Mutation hook to deactivate a specialty
 */
export function useDeactivateSpecialty() {
  const queryClient = useQueryClient();

  return useMutation<Specialty, Error, string>({
    mutationFn: (specialtyId) =>
      specialtiesService.deactivateSpecialty(specialtyId),
    onSuccess: (_, specialtyId) => {
      // Invalidate lists and detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.specialties.detail(specialtyId),
      });
    },
  });
}
