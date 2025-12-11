// ============================================================================
// USE ADD UNIT SERVICE - Mutation Hook for Adding Services to Units
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { unitServicesService } from "../../api";
import type {
  AddUnitServicePayload,
  UnitServiceWithDetails,
} from "../../types/unit-service.types";

interface AddUnitServiceParams {
  unitId: string;
  data: AddUnitServicePayload;
}

/**
 * Mutation hook to add a service to a unit with optional custom pricing
 */
export function useAddUnitService() {
  const queryClient = useQueryClient();

  return useMutation<UnitServiceWithDetails, Error, AddUnitServiceParams>({
    mutationFn: ({ unitId, data }) =>
      unitServicesService.addUnitService(unitId, data),
    onSuccess: (_, variables) => {
      // Invalidate the unit services list
      queryClient.invalidateQueries({
        queryKey: queryKeys.unitServices.list(variables.unitId),
      });
    },
  });
}
