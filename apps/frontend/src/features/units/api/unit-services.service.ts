// ============================================================================
// UNIT SERVICES SERVICE - API Integration for Unit Services Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  UnitService,
  UnitServiceWithDetails,
  AddUnitServicePayload,
  UpdateUnitServicePayload,
  UnitServicesResponse,
} from "../types/unit-service.types";

const apiClient = createApiClient();

/**
 * Unit Services Service
 * Handles all unit-service management API calls with custom pricing
 */
class UnitServicesService {
  /**
   * Get all services linked to a unit with cursor pagination
   */
  async getUnitServices(
    unitId: string,
    cursor?: string,
    limit = 20
  ): Promise<UnitServicesResponse> {
    const response = await apiClient.get<UnitServicesResponse>(
      API_ENDPOINTS.UNITS.SERVICES(unitId),
      {
        params: {
          cursor,
          limit,
        },
      }
    );
    return response.data;
  }

  /**
   * Add a service to a unit with optional custom pricing
   */
  async addUnitService(
    unitId: string,
    data: AddUnitServicePayload
  ): Promise<UnitServiceWithDetails> {
    const response = await apiClient.post<UnitServiceWithDetails>(
      API_ENDPOINTS.UNITS.SERVICES(unitId),
      data
    );
    return response.data;
  }

  /**
   * Update a unit service (custom pricing/duration or active status)
   */
  async updateUnitService(
    unitId: string,
    serviceId: string,
    data: UpdateUnitServicePayload
  ): Promise<UnitServiceWithDetails> {
    const response = await apiClient.patch<UnitServiceWithDetails>(
      API_ENDPOINTS.UNITS.SERVICE(unitId, serviceId),
      data
    );
    return response.data;
  }

  /**
   * Remove a service from a unit
   */
  async removeUnitService(
    unitId: string,
    serviceId: string
  ): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.UNITS.SERVICE(unitId, serviceId)
    );
  }

  /**
   * Activate a unit service
   */
  async activateUnitService(
    unitId: string,
    serviceId: string
  ): Promise<UnitServiceWithDetails> {
    return this.updateUnitService(unitId, serviceId, { is_active: true });
  }

  /**
   * Deactivate a unit service
   */
  async deactivateUnitService(
    unitId: string,
    serviceId: string
  ): Promise<UnitServiceWithDetails> {
    return this.updateUnitService(unitId, serviceId, { is_active: false });
  }
}

// Export singleton instance
export const unitServicesService = new UnitServicesService();
export default unitServicesService;
