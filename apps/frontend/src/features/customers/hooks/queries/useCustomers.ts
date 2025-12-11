// ============================================================================
// USE CUSTOMERS - Query Hook for Customers List
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { CustomersListResponse, CustomerFilters } from "../../types";

interface UseCustomersOptions extends CustomerFilters {
  enabled?: boolean;
}

/**
 * Query hook to fetch customers list with pagination and filters
 */
export function useCustomers({
  enabled = true,
  ...filters
}: UseCustomersOptions = {}) {
  return useQuery<CustomersListResponse, Error>({
    queryKey: queryKeys.customers.list(filters),
    queryFn: () => customersService.getCustomers(filters),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}
