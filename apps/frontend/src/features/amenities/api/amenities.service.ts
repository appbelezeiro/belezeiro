// ============================================================================
// AMENITIES SERVICE - API Integration for Amenities Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Amenity,
  CreateAmenityPayload,
  UpdateAmenityPayload,
  AmenitiesResponse,
} from "../types/amenity.types";

const apiClient = createApiClient();

/**
 * Amenities Service
 * Handles all amenity-related API calls with cursor pagination
 */
class AmenitiesService {
  /**
   * Get amenities list with cursor pagination
   */
  async getAmenities(
    cursor?: string,
    limit = 20
  ): Promise<AmenitiesResponse> {
    const response = await apiClient.get<AmenitiesResponse>(
      API_ENDPOINTS.AMENITIES.BASE,
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
   * Search amenities by name with cursor pagination
   */
  async searchAmenities(
    query: string,
    cursor?: string,
    limit = 20
  ): Promise<AmenitiesResponse> {
    const response = await apiClient.get<AmenitiesResponse>(
      API_ENDPOINTS.AMENITIES.SEARCH,
      {
        params: {
          q: query,
          cursor,
          limit,
        },
      }
    );
    return response.data;
  }

  /**
   * Get single amenity by ID
   */
  async getAmenity(amenityId: string): Promise<Amenity> {
    const response = await apiClient.get<Amenity>(
      API_ENDPOINTS.AMENITIES.DETAIL(amenityId)
    );
    return response.data;
  }

  /**
   * Create new amenity
   */
  async createAmenity(data: CreateAmenityPayload): Promise<Amenity> {
    const response = await apiClient.post<Amenity>(
      API_ENDPOINTS.AMENITIES.BASE,
      data
    );
    return response.data;
  }

  /**
   * Update amenity
   */
  async updateAmenity(
    amenityId: string,
    data: UpdateAmenityPayload
  ): Promise<Amenity> {
    const response = await apiClient.patch<Amenity>(
      API_ENDPOINTS.AMENITIES.DETAIL(amenityId),
      data
    );
    return response.data;
  }

  /**
   * Activate amenity
   */
  async activateAmenity(amenityId: string): Promise<Amenity> {
    const response = await apiClient.post<Amenity>(
      `${API_ENDPOINTS.AMENITIES.DETAIL(amenityId)}/activate`
    );
    return response.data;
  }

  /**
   * Deactivate amenity
   */
  async deactivateAmenity(amenityId: string): Promise<Amenity> {
    const response = await apiClient.post<Amenity>(
      `${API_ENDPOINTS.AMENITIES.DETAIL(amenityId)}/deactivate`
    );
    return response.data;
  }
}

// Export singleton instance
export const amenitiesService = new AmenitiesService();
export default amenitiesService;
