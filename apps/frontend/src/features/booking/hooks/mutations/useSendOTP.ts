// ============================================================================
// USE SEND OTP - Mutation Hook to Send OTP
// ============================================================================

import { useMutation } from "@tanstack/react-query";
import { otpService } from "../../api";
import type { SendOTPRequest, SendOTPResponse } from "../../types";

/**
 * Mutation hook to send OTP to a phone number
 */
export function useSendOTP() {
  return useMutation<SendOTPResponse, Error, SendOTPRequest>({
    mutationFn: (request) => otpService.sendOTP(request),
  });
}

/**
 * Mutation hook to resend OTP
 */
export function useResendOTP() {
  return useMutation<SendOTPResponse, Error, string>({
    mutationFn: (phone) => otpService.resendOTP(phone),
  });
}
