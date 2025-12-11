// ============================================================================
// USE SECRETARY INFO - Query Hook for AI Secretary Status
// ============================================================================

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../api";
import type { SecretaryInfo } from "../../types";

interface UseSecretaryInfoOptions {
  enabled?: boolean;
}

/**
 * Query hook to fetch AI Secretary status
 */
export function useSecretaryInfo({ enabled = true }: UseSecretaryInfoOptions = {}) {
  return useQuery<SecretaryInfo, Error>({
    queryKey: ["dashboard", "secretary"],
    queryFn: () => dashboardService.getSecretaryInfo(),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
