// ============================================================================
// USE CUSTOMER HISTORY - Query Hook for Customer History
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { customersService } from "../../api";
import type { CustomerHistoryItem } from "../../types";

interface UseCustomerHistoryOptions {
  customerId: string;
  enabled?: boolean;
}

/**
 * Query hook to fetch customer history
 */
export function useCustomerHistory({
  customerId,
  enabled = true,
}: UseCustomerHistoryOptions) {
  return useQuery<CustomerHistoryItem[], Error>({
    queryKey: ["customers", customerId, "history"],
    queryFn: () => customersService.getCustomerHistory(customerId),
    enabled: enabled && !!customerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
