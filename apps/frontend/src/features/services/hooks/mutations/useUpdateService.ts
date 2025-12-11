// ============================================================================
// USE UPDATE SERVICE - Mutation Hook to Update Service
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { UpdateServiceRequest, Service } from "../../types";

interface UpdateServiceParams {
  serviceId: string;
  data: UpdateServiceRequest;
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.services.detail(variables.serviceId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
}
