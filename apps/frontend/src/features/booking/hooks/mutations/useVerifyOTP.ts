// ============================================================================
// USE VERIFY OTP - Mutation Hook to Verify OTP Code
// ============================================================================

import { useMutation } from "@tanstack/react-query";
import { otpService } from "../../api";
import type { VerifyOTPRequest, VerifyOTPResponse } from "../../types";

/**
 * Mutation hook to verify OTP code
 */
export function useVerifyOTP() {
  return useMutation<VerifyOTPResponse, Error, VerifyOTPRequest>({
    mutationFn: (request) => otpService.verifyOTP(request),
  });
}
