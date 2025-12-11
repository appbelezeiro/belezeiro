// ============================================================================
// UNIT AMENITIES SERVICE - API Integration for Unit-Amenity Relationship
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type { UnitAmenityWithDetails } from "../types/amenity.types";

const apiClient = createApiClient();

/**
 * Unit Amenities Service
 * Handles unit-amenity relationship API calls
 */
class UnitAmenitiesService {
  /**
   * Get amenities linked to a unit
   */
  async getUnitAmenities(
    unitId: string
  ): Promise<{ items: UnitAmenityWithDetails[] }> {
    const response = await apiClient.get<{ items: UnitAmenityWithDetails[] }>(
      API_ENDPOINTS.UNITS.AMENITIES(unitId)
    );
    return response.data;
  }

  /**
   * Link amenity to unit
   */
  async linkAmenity(unitId: string, amenityId: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.UNITS.AMENITIES(unitId), {
      amenity_id: amenityId,
    });
  }

  /**
   * Unlink amenity from unit
   */
  async unlinkAmenity(unitId: string, amenityId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.UNITS.AMENITY(unitId, amenityId));
  }
}

// Export singleton instance
export const unitAmenitiesService = new UnitAmenitiesService();
export default unitAmenitiesService;
