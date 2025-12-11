// ============================================================================
// USE IMPORT CUSTOMERS - Mutation Hook to Import Customers
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { ImportCustomersResult } from "../../types";

/**
 * Mutation hook to import customers from file
 */
export function useImportCustomers() {
  const queryClient = useQueryClient();

  return useMutation<ImportCustomersResult, Error, File>({
    mutationFn: (file) => customersService.importCustomers(file),
    onSuccess: () => {
      // Invalidate customers list cache after import
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
