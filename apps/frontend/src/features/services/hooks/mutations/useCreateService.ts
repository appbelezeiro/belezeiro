// ============================================================================
// USE CREATE SERVICE - Mutation Hook to Create Service
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { CreateServicePayload, Service } from "../../types/service.types";

/**
 * Mutation hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, CreateServicePayload>({
    mutationFn: (data) => servicesService.createService(data),
    onSuccess: () => {
      // Invalidate all service lists to refetch with new data
      queryClient.invalidateQueries({
        queryKey: queryKeys.servicesGlobal.lists(),
      });
    },
  });
}
