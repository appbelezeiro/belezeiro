// ============================================================================
// USE CUSTOMER - Query Hook for Single Customer
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { CustomerWithStats } from "../../types";

interface UseCustomerOptions {
  customerId: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch a single customer by ID
 */
export function useCustomer({ customerId, enabled = true }: UseCustomerOptions) {
  return useQuery<CustomerWithStats, Error>({
    queryKey: queryKeys.customers.detail(customerId),
    queryFn: () => customersService.getCustomer(customerId),
    enabled: enabled && !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
