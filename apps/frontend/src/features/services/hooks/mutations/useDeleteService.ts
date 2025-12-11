// ============================================================================
// USE DELETE SERVICE - Mutation Hook to Delete Service
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "../../api";

/**
 * Mutation hook to delete a service
 */
export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (serviceId) => servicesService.deleteService(serviceId),
    onSuccess: (_, serviceId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.services.detail(serviceId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.services.lists() });
    },
  });
}
