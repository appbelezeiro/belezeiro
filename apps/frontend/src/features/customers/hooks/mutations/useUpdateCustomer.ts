// ============================================================================
// USE UPDATE CUSTOMER - Mutation Hook to Update Customer
// ============================================================================

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { UpdateCustomerRequest, Customer } from "../../types";

interface UpdateCustomerParams {
  customerId: string;
  data: UpdateCustomerRequest;
}

/**
 * Mutation hook to update a customer
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation<Customer, Error, UpdateCustomerParams>({
    mutationFn: ({ customerId, data }) =>
      customersService.updateCustomer(customerId, data),
    onSuccess: (_, variables) => {
      // Invalidate specific customer cache
      queryClient.invalidateQueries({
        queryKey: queryKeys.customers.detail(variables.customerId),
      });
      // Invalidate customers list cache
      queryClient.invalidateQueries({ queryKey: queryKeys.customers.lists() });
    },
  });
}
