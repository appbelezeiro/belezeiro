// ============================================================================
// OTP SERVICE - Phone Verification for Booking Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  SendOTPRequest,
  SendOTPResponse,
  VerifyOTPRequest,
  VerifyOTPResponse,
} from "../types";
import { sendOTPResponseSchema, verifyOTPResponseSchema } from "../schemas";

const apiClient = createApiClient();

/**
 * OTP Service
 * Handles phone verification via OTP
 */
class OTPService {
  /**
   * Send OTP to phone number
   */
  async sendOTP(request: SendOTPRequest): Promise<SendOTPResponse> {
    const response = await apiClient.post<SendOTPResponse>(
      API_ENDPOINTS.OTP.SEND,
      request
    );
    return sendOTPResponseSchema.parse(response.data);
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(request: VerifyOTPRequest): Promise<VerifyOTPResponse> {
    const response = await apiClient.post<VerifyOTPResponse>(
      API_ENDPOINTS.OTP.VERIFY,
      request
    );
    return verifyOTPResponseSchema.parse(response.data);
  }

  /**
   * Resend OTP code
   */
  async resendOTP(phone: string): Promise<SendOTPResponse> {
    return this.sendOTP({ phone });
  }
}

// Export singleton instance
export const otpService = new OTPService();
export default otpService;
