// ============================================================================
// SERVICES SERVICE - API Integration for Services Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Service,
  ServiceWithSpecialty,
  CreateServicePayload,
  UpdateServicePayload,
  ServicesResponse,
} from "../types/service.types";

const apiClient = createApiClient();

/**
 * Services Service
 * Handles all service-related API calls with cursor pagination
 */
class ServicesService {
  /**
   * Get services list with cursor pagination and optional specialty filter
   */
  async getServices(
    specialtyId?: string,
    cursor?: string,
    limit = 20
  ): Promise<ServicesResponse> {
    const response = await apiClient.get<ServicesResponse>(
      API_ENDPOINTS.SERVICES.BASE,
      {
        params: {
          specialty_id: specialtyId,
          cursor,
          limit,
        },
      }
    );
    return response.data;
  }

  /**
   * Search services by name with cursor pagination and optional specialty filter
   */
  async searchServices(
    query: string,
    specialtyId?: string,
    cursor?: string,
    limit = 20
  ): Promise<ServicesResponse> {
    const response = await apiClient.get<ServicesResponse>(
      API_ENDPOINTS.SERVICES_GLOBAL.SEARCH,
      {
        params: {
          q: query,
          specialty_id: specialtyId,
          cursor,
          limit,
        },
      }
    );
    return response.data;
  }

  /**
   * Get single service by ID
   */
  async getService(serviceId: string): Promise<ServiceWithSpecialty> {
    const response = await apiClient.get<ServiceWithSpecialty>(
      API_ENDPOINTS.SERVICES.DETAIL(serviceId)
    );
    return response.data;
  }

  /**
   * Create new service
   */
  async createService(data: CreateServicePayload): Promise<Service> {
    const response = await apiClient.post<Service>(
      API_ENDPOINTS.SERVICES.BASE,
      data
    );
    return response.data;
  }

  /**
   * Update service
   */
  async updateService(
    serviceId: string,
    data: UpdateServicePayload
  ): Promise<Service> {
    const response = await apiClient.patch<Service>(
      API_ENDPOINTS.SERVICES.DETAIL(serviceId),
      data
    );
    return response.data;
  }

  /**
   * Activate service
   */
  async activateService(serviceId: string): Promise<Service> {
    const response = await apiClient.patch<Service>(
      `${API_ENDPOINTS.SERVICES.DETAIL(serviceId)}/activate`
    );
    return response.data;
  }

  /**
   * Deactivate service
   */
  async deactivateService(serviceId: string): Promise<Service> {
    const response = await apiClient.patch<Service>(
      `${API_ENDPOINTS.SERVICES.DETAIL(serviceId)}/deactivate`
    );
    return response.data;
  }
}

// Export singleton instance
export const servicesService = new ServicesService();
export default servicesService;
