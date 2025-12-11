// ============================================================================
// USE CREATE SERVICE - Mutation Hook to Create Service
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";
import type { CreateServiceRequest, Service } from "../../types";

/**
 * Mutation hook to create a new service
 */
export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, CreateServiceRequest>({
    mutationFn: (data) => servicesService.createService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.services.all });
    },
  });
}
