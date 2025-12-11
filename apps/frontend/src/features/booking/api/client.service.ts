// ============================================================================
// CLIENT SERVICE - Client Management for Booking Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  RegisterClientRequest,
  RegisterClientResponse,
} from "../types";
import { z } from "zod";

const apiClient = createApiClient();

/**
 * Register Client Response Schema
 */
const registerClientResponseSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  phone: z.string(),
  email: z.string().optional(),
});

/**
 * Client Service
 * Handles client registration and management
 */
class ClientService {
  /**
   * Register a new client
   */
  async registerClient(
    request: RegisterClientRequest
  ): Promise<RegisterClientResponse> {
    const response = await apiClient.post<RegisterClientResponse>(
      API_ENDPOINTS.CLIENTS.BASE,
      request
    );
    return registerClientResponseSchema.parse(response.data);
  }

  /**
   * Get client by phone number
   */
  async getClientByPhone(
    phone: string,
    unitId: string
  ): Promise<RegisterClientResponse | null> {
    try {
      const response = await apiClient.get<RegisterClientResponse>(
        API_ENDPOINTS.CLIENTS.BY_PHONE,
        {
          params: { phone, unitId },
        }
      );
      return registerClientResponseSchema.parse(response.data);
    } catch {
      return null;
    }
  }
}

// Export singleton instance
export const clientService = new ClientService();
export default clientService;
