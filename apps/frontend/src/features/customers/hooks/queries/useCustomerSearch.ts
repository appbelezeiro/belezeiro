// ============================================================================
// USE CUSTOMER SEARCH - Query Hook for Customer Search
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/shared/constants/query-keys";
import { customersService } from "../../api";
import type { CustomerWithStats } from "../../types";

interface UseCustomerSearchOptions {
  query: string;
  enabled?: boolean;
}

/**
 * Query hook to search customers
 */
export function useCustomerSearch({
  query,
  enabled = true,
}: UseCustomerSearchOptions) {
  return useQuery<CustomerWithStats[], Error>({
    queryKey: queryKeys.customers.search(query),
    queryFn: () => customersService.searchCustomers(query),
    enabled: enabled && query.length >= 2,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
