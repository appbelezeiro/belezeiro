// ============================================================================
// SERVICE TYPES - Domain Types for Services Feature
// ============================================================================

/**
 * Service Entity
 */
export interface Service {
  id: string;
  name: string;
  description?: string;
  duration: number; // minutes
  price: number;
  category: string;
  color: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service Category
 */
export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
  servicesCount: number;
}

/**
 * Service with Stats
 */
export interface ServiceWithStats extends Service {
  appointmentsCount: number;
  revenue: number;
  averageRating?: number;
}

/**
 * Create Service Request
 */
export interface CreateServiceRequest {
  name: string;
  description?: string;
  duration: number;
  price: number;
  category: string;
  color?: string;
}

/**
 * Update Service Request
 */
export interface UpdateServiceRequest {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  category?: string;
  color?: string;
  isActive?: boolean;
}

/**
 * Services List Response
 */
export interface ServicesListResponse {
  services: ServiceWithStats[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Service Filters
 */
export interface ServiceFilters {
  category?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "name" | "price" | "duration" | "appointmentsCount";
  sortOrder?: "asc" | "desc";
}

/**
 * Create Category Request
 */
export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

/**
 * Update Category Request
 */
export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  order?: number;
}
