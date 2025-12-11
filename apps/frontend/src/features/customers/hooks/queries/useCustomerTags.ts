// ============================================================================
// USE CUSTOMER TAGS - Query Hook for Customer Tags
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { customersService } from "../../api";
import type { CustomerTag } from "../../types";

interface UseCustomerTagsOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch customer tags
 */
export function useCustomerTags({ enabled = true }: UseCustomerTagsOptions = {}) {
  return useQuery<CustomerTag[], Error>({
    queryKey: ["customers", "tags"],
    queryFn: () => customersService.getTags(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
