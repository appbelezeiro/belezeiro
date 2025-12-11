// ============================================================================
// USE SERVICE CATEGORIES - Query Hook for Service Categories
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { servicesService } from "../../api";
import type { ServiceCategory } from "../../types";

interface UseServiceCategoriesOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch service categories
 */
export function useServiceCategories({
  enabled = true,
}: UseServiceCategoriesOptions = {}) {
  return useQuery<ServiceCategory[], Error>({
    queryKey: ["services", "categories"],
    queryFn: () => servicesService.getCategories(),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
