// ============================================================================
// UNIT SPECIALTIES SERVICE - API Integration for Unit Specialties Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  UnitSpecialty,
  UnitSpecialtyWithDetails,
  LinkUnitSpecialtyPayload,
  UnitSpecialtiesResponse,
} from "../types/unit-specialty.types";

const apiClient = createApiClient();

/**
 * Unit Specialties Service
 * Handles all unit-specialty linking API calls
 */
class UnitSpecialtiesService {
  /**
   * Get all specialties linked to a unit
   */
  async getUnitSpecialties(
    unitId: string
  ): Promise<UnitSpecialtiesResponse> {
    const response = await apiClient.get<UnitSpecialtiesResponse>(
      API_ENDPOINTS.UNITS.SPECIALTIES(unitId)
    );
    return response.data;
  }

  /**
   * Link a specialty to a unit
   */
  async linkUnitSpecialty(
    unitId: string,
    data: LinkUnitSpecialtyPayload
  ): Promise<UnitSpecialtyWithDetails> {
    const response = await apiClient.post<UnitSpecialtyWithDetails>(
      API_ENDPOINTS.UNITS.SPECIALTIES(unitId),
      data
    );
    return response.data;
  }

  /**
   * Unlink a specialty from a unit
   */
  async unlinkUnitSpecialty(
    unitId: string,
    specialtyId: string
  ): Promise<void> {
    await apiClient.delete(
      API_ENDPOINTS.UNITS.SPECIALTY(unitId, specialtyId)
    );
  }
}

// Export singleton instance
export const unitSpecialtiesService = new UnitSpecialtiesService();
export default unitSpecialtiesService;
