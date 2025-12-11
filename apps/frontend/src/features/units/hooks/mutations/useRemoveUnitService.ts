// ============================================================================
// USE REMOVE UNIT SERVICE - Mutation Hook for Removing Services from Units
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitServicesService } from "../../api";

interface RemoveUnitServiceParams {
  unitId: string;
  serviceId: string;
}

/**
 * Mutation hook to remove a service from a unit
 */
export function useRemoveUnitService() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, RemoveUnitServiceParams>({
    mutationFn: ({ unitId, serviceId }) =>
      unitServicesService.removeUnitService(unitId, serviceId),
    onSuccess: (_, variables) => {
      // Invalidate the unit services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitServices.list(variables.unitId),
      });
    },
  });
}
