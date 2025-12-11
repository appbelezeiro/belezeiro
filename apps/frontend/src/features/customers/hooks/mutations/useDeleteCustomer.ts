// ============================================================================
// USE DELETE CUSTOMER - Mutation Hook to Delete Customer
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";

/**
 * Mutation hook to delete a customer
 */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (customerId) => customersService.deleteCustomer(customerId),
    onSuccess: (_, customerId) => {
      // Remove specific customer from cache
      queryClient.removeQueries({
        queryKey: queryKeys.customers.detail(customerId),
      });
      // Invalidate customers list cache
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
  });
}
