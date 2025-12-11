// ============================================================================
// CUSTOMER TYPES - Domain Types for Customers Feature
// ============================================================================

/**
 * Customer Entity
 */
export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone: string;
  photo?: string;
  birthDate?: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

/**
 * Customer with Stats
 */
export interface CustomerWithStats extends Customer {
  totalAppointments: number;
  totalSpent: number;
  lastVisit?: string;
  nextAppointment?: string;
}

/**
 * Customer History Item
 */
export interface CustomerHistoryItem {
  id: string;
  type: "appointment" | "payment" | "note";
  date: string;
  description: string;
  value?: number;
  status?: string;
}

/**
 * Create Customer Request
 */
export interface CreateCustomerRequest {
  name: string;
  email?: string;
  phone: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
}

/**
 * Update Customer Request
 */
export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  notes?: string;
  tags?: string[];
  isActive?: boolean;
}

/**
 * Customers List Response
 */
export interface CustomersListResponse {
  customers: CustomerWithStats[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Customer Filters
 */
export interface CustomerFilters {
  search?: string;
  tags?: string[];
  isActive?: boolean;
  page?: number;
  limit?: number;
  sortBy?: "name" | "createdAt" | "lastVisit" | "totalSpent";
  sortOrder?: "asc" | "desc";
}

/**
 * Customer Tag
 */
export interface CustomerTag {
  id: string;
  name: string;
  color: string;
  count: number;
}

/**
 * Import Customers Result
 */
export interface ImportCustomersResult {
  imported: number;
  failed: number;
  errors: Array<{
    row: number;
    message: string;
  }>;
}
