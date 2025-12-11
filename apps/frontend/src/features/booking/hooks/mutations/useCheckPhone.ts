// ============================================================================
// USE CHECK PHONE - Mutation Hook to Check if Phone Exists
// ============================================================================

import { useMutation } from "@tanstack/react-query";
import { bookingService } from "../../api";
import type { CheckPhoneRequest, CheckPhoneResponse } from "../../types";

/**
 * Mutation hook to check if a phone number is registered
 */
export function useCheckPhone() {
  return useMutation<CheckPhoneResponse, Error, CheckPhoneRequest>({
    mutationFn: (request) => bookingService.checkPhone(request),
  });
}
