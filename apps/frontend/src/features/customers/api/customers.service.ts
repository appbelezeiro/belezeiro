// ============================================================================
// CUSTOMERS SERVICE - API Integration for Customers Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Customer,
  CustomerWithStats,
  CustomersListResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  CustomerFilters,
  CustomerHistoryItem,
  CustomerTag,
  ImportCustomersResult,
} from "../types";
import {
  customerSchema,
  customerWithStatsSchema,
  customersListResponseSchema,
  customerHistoryItemSchema,
  customerTagSchema,
  importCustomersResultSchema,
} from "../schemas";

const apiClient = createApiClient();

/**
 * Customers Service
 * Handles all customer-related API calls
 */
class CustomersService {
  /**
   * Get customers list with pagination and filters
   */
  async getCustomers(filters: CustomerFilters = {}): Promise<CustomersListResponse> {
    const response = await apiClient.get<CustomersListResponse>(
      API_ENDPOINTS.CUSTOMERS.BASE,
      {
        params: filters as Record<string, unknown>,
      }
    );
    return customersListResponseSchema.parse(response.data);
  }

  /**
   * Get single customer by ID
   */
  async getCustomer(customerId: string): Promise<CustomerWithStats> {
    const response = await apiClient.get<CustomerWithStats>(
      API_ENDPOINTS.CUSTOMERS.DETAIL(customerId)
    );
    return customerWithStatsSchema.parse(response.data);
  }

  /**
   * Get customer by phone number
   */
  async getCustomerByPhone(phone: string): Promise<Customer | null> {
    try {
      const response = await apiClient.get<Customer>(
        `${API_ENDPOINTS.CUSTOMERS.BASE}/by-phone`,
        {
          params: { phone },
        }
      );
      return customerSchema.parse(response.data);
    } catch {
      return null;
    }
  }

  /**
   * Create new customer
   */
  async createCustomer(data: CreateCustomerRequest): Promise<Customer> {
    const response = await apiClient.post<Customer>(
      API_ENDPOINTS.CUSTOMERS.BASE,
      data
    );
    return customerSchema.parse(response.data);
  }

  /**
   * Update customer
   */
  async updateCustomer(
    customerId: string,
    data: UpdateCustomerRequest
  ): Promise<Customer> {
    const response = await apiClient.patch<Customer>(
      API_ENDPOINTS.CUSTOMERS.DETAIL(customerId),
      data
    );
    return customerSchema.parse(response.data);
  }

  /**
   * Delete customer
   */
  async deleteCustomer(customerId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.CUSTOMERS.DETAIL(customerId));
  }

  /**
   * Get customer history
   */
  async getCustomerHistory(customerId: string): Promise<CustomerHistoryItem[]> {
    const response = await apiClient.get<CustomerHistoryItem[]>(
      `${API_ENDPOINTS.CUSTOMERS.DETAIL(customerId)}/history`
    );
    return response.data.map((item) => customerHistoryItemSchema.parse(item));
  }

  /**
   * Search customers
   */
  async searchCustomers(query: string): Promise<CustomerWithStats[]> {
    const response = await apiClient.get<CustomerWithStats[]>(
      `${API_ENDPOINTS.CUSTOMERS.BASE}/search`,
      {
        params: { q: query },
      }
    );
    return response.data.map((c) => customerWithStatsSchema.parse(c));
  }

  /**
   * Get all customer tags
   */
  async getTags(): Promise<CustomerTag[]> {
    const response = await apiClient.get<CustomerTag[]>(
      `${API_ENDPOINTS.CUSTOMERS.BASE}/tags`
    );
    return response.data.map((tag) => customerTagSchema.parse(tag));
  }

  /**
   * Import customers from CSV/Excel
   */
  async importCustomers(file: File): Promise<ImportCustomersResult> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<ImportCustomersResult>(
      `${API_ENDPOINTS.CUSTOMERS.BASE}/import`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return importCustomersResultSchema.parse(response.data);
  }

  /**
   * Get export URL for customers CSV
   * The component should handle the actual download
   */
  getExportUrl(filters?: CustomerFilters): string {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, String(value));
        }
      });
    }
    const queryString = params.toString();
    return `${API_ENDPOINTS.CUSTOMERS.BASE}/export${queryString ? `?${queryString}` : ""}`;
  }
}

// Export singleton instance
export const customersService = new CustomersService();
export default customersService;
