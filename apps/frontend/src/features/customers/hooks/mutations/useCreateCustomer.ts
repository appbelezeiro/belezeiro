// ============================================================================
// USE CREATE CUSTOMER - Mutation Hook to Create Customer
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { CreateCustomerRequest, Customer } from "../../types";

/**
 * Mutation hook to create a new customer
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();

  return useMutation<Customer, Error, CreateCustomerRequest>({
    mutationFn: (data) => customersService.createCustomer(data),
    onSuccess: () => {
      // Invalidate customers list cache
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.all });
    },
  });
}
