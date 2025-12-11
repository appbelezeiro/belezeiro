// ============================================================================
// USE UPDATE SERVICE - Mutation Hook to Update Service
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { UpdateServicePayload, Service } from "../../types/service.types";

interface UpdateServiceParams {
  serviceId: string;
  data: UpdateServicePayload;
}

/**
 * Mutation hook to update a service
 */
export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, UpdateServiceParams>({
    mutationFn: ({ serviceId, data }) =>
      servicesService.updateService(serviceId, data),
    onSuccess: (_, variables) => {
      // Invalidate detail and lists
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.detail(variables.serviceId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.lists(),
      });
    },
  });
}
