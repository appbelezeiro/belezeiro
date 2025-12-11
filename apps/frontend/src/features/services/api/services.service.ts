// ============================================================================
// SERVICES SERVICE - API Integration for Services Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Service,
  ServiceWithStats,
  ServicesListResponse,
  ServiceCategory,
  CreateServiceRequest,
  UpdateServiceRequest,
  ServiceFilters,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../types";
import {
  serviceSchema,
  serviceWithStatsSchema,
  servicesListResponseSchema,
  serviceCategorySchema,
} from "../schemas";

const apiClient = createApiClient();

/**
 * Services Service
 * Handles all service-related API calls
 */
class ServicesService {
  /**
   * Get services list with pagination and filters
   */
  async getServices(filters: ServiceFilters = {}): Promise<ServicesListResponse> {
    const response = await apiClient.get<ServicesListResponse>(
      API_ENDPOINTS.SERVICES.BASE,
      {
        params: filters as Record<string, unknown>,
      }
    );
    return servicesListResponseSchema.parse(response.data);
  }

  /**
   * Get single service by ID
   */
  async getService(serviceId: string): Promise<ServiceWithStats> {
    const response = await apiClient.get<ServiceWithStats>(
      API_ENDPOINTS.SERVICES.DETAIL(serviceId)
    );
    return serviceWithStatsSchema.parse(response.data);
  }

  /**
   * Get active services only
   */
  async getActiveServices(): Promise<Service[]> {
    const response = await apiClient.get<Service[]>(
      `${API_ENDPOINTS.SERVICES.BASE}/active`
    );
    return response.data.map((s) => serviceSchema.parse(s));
  }

  /**
   * Create new service
   */
  async createService(data: CreateServiceRequest): Promise<Service> {
    const response = await apiClient.post<Service>(
      API_ENDPOINTS.SERVICES.BASE,
      data
    );
    return serviceSchema.parse(response.data);
  }

  /**
   * Update service
   */
  async updateService(
    serviceId: string,
    data: UpdateServiceRequest
  ): Promise<Service> {
    const response = await apiClient.patch<Service>(
      API_ENDPOINTS.SERVICES.DETAIL(serviceId),
      data
    );
    return serviceSchema.parse(response.data);
  }

  /**
   * Delete service
   */
  async deleteService(serviceId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.SERVICES.DETAIL(serviceId));
  }

  /**
   * Get service categories
   */
  async getCategories(): Promise<ServiceCategory[]> {
    const response = await apiClient.get<ServiceCategory[]>(
      `${API_ENDPOINTS.SERVICES.BASE}/categories`
    );
    return response.data.map((c) => serviceCategorySchema.parse(c));
  }

  /**
   * Create service category
   */
  async createCategory(data: CreateCategoryRequest): Promise<ServiceCategory> {
    const response = await apiClient.post<ServiceCategory>(
      `${API_ENDPOINTS.SERVICES.BASE}/categories`,
      data
    );
    return serviceCategorySchema.parse(response.data);
  }

  /**
   * Update service category
   */
  async updateCategory(
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<ServiceCategory> {
    const response = await apiClient.patch<ServiceCategory>(
      `${API_ENDPOINTS.SERVICES.BASE}/categories/${categoryId}`,
      data
    );
    return serviceCategorySchema.parse(response.data);
  }

  /**
   * Delete service category
   */
  async deleteCategory(categoryId: string): Promise<void> {
    await apiClient.delete(
      `${API_ENDPOINTS.SERVICES.BASE}/categories/${categoryId}`
    );
  }

  /**
   * Reorder services within category
   */
  async reorderServices(
    categoryId: string,
    serviceIds: string[]
  ): Promise<void> {
    await apiClient.post(
      `${API_ENDPOINTS.SERVICES.BASE}/categories/${categoryId}/reorder`,
      { serviceIds }
    );
  }
}

// Export singleton instance
export const servicesService = new ServicesService();
export default servicesService;
