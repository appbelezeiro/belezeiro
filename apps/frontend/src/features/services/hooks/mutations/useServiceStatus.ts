// ============================================================================
// USE SERVICE STATUS - Mutation Hooks for Service Activation/Deactivation
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { Service } from "../../types/service.types";

/**
 * Mutation hook to activate a service
 */
export function useActivateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, string>({
    mutationFn: (serviceId) => servicesService.activateService(serviceId),
    onSuccess: (_, serviceId) => {
      // Invalidate lists and detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.detail(serviceId),
      });
    },
  });
}

/**
 * Mutation hook to deactivate a service
 */
export function useDeactivateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, string>({
    mutationFn: (serviceId) => servicesService.deactivateService(serviceId),
    onSuccess: (_, serviceId) => {
      // Invalidate lists and detail query
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.lists(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.detail(serviceId),
      });
    },
  });
}
