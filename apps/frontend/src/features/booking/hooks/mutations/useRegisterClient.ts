// ============================================================================
// USE REGISTER CLIENT - Mutation Hook to Register New Client
// ============================================================================

import { useMutation } from "@tanstack/react-query";
import { clientService } from "../../api";
import type { RegisterClientRequest, RegisterClientResponse } from "../../types";

/**
 * Mutation hook to register a new client
 */
export function useRegisterClient() {
  return useMutation<RegisterClientResponse, Error, RegisterClientRequest>({
    mutationFn: (request) => clientService.registerClient(request),
  });
}
