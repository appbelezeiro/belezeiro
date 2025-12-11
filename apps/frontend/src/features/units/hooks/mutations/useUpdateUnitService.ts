// ============================================================================
// USE UPDATE UNIT SERVICE - Mutation Hook for Updating Unit Services
// ============================================================================

import { useMutation, useQueryClient } from "@tantml:react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitServicesService } from "../../api";
import type {
  UpdateUnitServicePayload,
  UnitServiceWithDetails,
} from "../../types/unit-service.types";

interface UpdateUnitServiceParams {
  unitId: string;
  serviceId: string;
  data: UpdateUnitServicePayload;
}

/**
 * Mutation hook to update a unit service (custom pricing/duration or active status)
 */
export function useUpdateUnitService() {
  const queryClient = useQueryClient();

  return useMutation<UnitServiceWithDetails, Error, UpdateUnitServiceParams>({
    mutationFn: ({ unitId, serviceId, data }) =>
      unitServicesService.updateUnitService(unitId, serviceId, data),
    onSuccess: (_, variables) => {
      // Invalidate the unit services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitServices.list(variables.unitId),
      });
    },
  });
}
