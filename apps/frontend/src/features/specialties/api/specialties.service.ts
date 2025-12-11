// ============================================================================
// SPECIALTIES SERVICE - API Integration for Specialties Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Specialty,
  CreateSpecialtyPayload,
  SpecialtiesResponse,
} from "../types/specialty.types";

const apiClient = createApiClient();

/**
 * Specialties Service
 * Handles all specialty-related API calls with cursor pagination
 */
class SpecialtiesService {
  /**
   * Get specialties list with cursor pagination
   */
  async getSpecialties(
    cursor?: string,
    limit = 20
  ): Promise<SpecialtiesResponse> {
    const response = await apiClient.get<SpecialtiesResponse>(
      API_ENDPOINTS.SPECIALTIES.BASE,
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
   * Search specialties by name with cursor pagination
   */
  async searchSpecialties(
    query: string,
    cursor?: string,
    limit = 20
  ): Promise<SpecialtiesResponse> {
    const response = await apiClient.get<SpecialtiesResponse>(
      API_ENDPOINTS.SPECIALTIES.SEARCH,
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
   * Get single specialty by ID
   */
  async getSpecialty(specialtyId: string): Promise<Specialty> {
    const response = await apiClient.get<Specialty>(
      API_ENDPOINTS.SPECIALTIES.DETAIL(specialtyId)
    );
    return response.data;
  }

  /**
   * Create new specialty
   */
  async createSpecialty(data: CreateSpecialtyPayload): Promise<Specialty> {
    const response = await apiClient.post<Specialty>(
      API_ENDPOINTS.SPECIALTIES.BASE,
      data
    );
    return response.data;
  }

  /**
   * Activate specialty
   */
  async activateSpecialty(specialtyId: string): Promise<Specialty> {
    const response = await apiClient.patch<Specialty>(
      `${API_ENDPOINTS.SPECIALTIES.DETAIL(specialtyId)}/activate`
    );
    return response.data;
  }

  /**
   * Deactivate specialty
   */
  async deactivateSpecialty(specialtyId: string): Promise<Specialty> {
    const response = await apiClient.patch<Specialty>(
      `${API_ENDPOINTS.SPECIALTIES.DETAIL(specialtyId)}/deactivate`
    );
    return response.data;
  }
}

// Export singleton instance
export const specialtiesService = new SpecialtiesService();
export default specialtiesService;
