// ============================================================================
// API CONFIG - Configuração centralizada da API
// ============================================================================

/**
 * URL base da API
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

/**
 * Timeout padrão para requisições (30 segundos)
 */
export const API_TIMEOUT = 30000;

/**
 * Se deve enviar credentials (cookies) nas requisições
 */
export const API_WITH_CREDENTIALS = true;

/**
 * Endpoints da API
 * Nota: Todos os endpoints incluem o prefixo /api
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/social-login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    ME: '/api/auth/me',
  },

  // Customers
  CUSTOMERS: {
    BASE: '/api/customers',
    DETAIL: (id: string) => `/api/customers/${id}`,
  },

  // Services
  SERVICES: {
    BASE: '/api/services',
    DETAIL: (id: string) => `/api/services/${id}`,
  },

  // Bookings
  BOOKINGS: {
    BASE: '/api/bookings',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    SLOTS: '/api/bookings/slots',
    CHECK_PHONE: '/api/bookings/check-phone',
  },

  // Units
  UNITS: {
    BASE: '/api/units',
    DETAIL: (id: string) => `/api/units/${id}`,
    PUBLIC: (id: string) => `/api/units/${id}/public`,
    BY_SLUG: (slug: string) => `/api/units/slug/${slug}`,
    SERVICES: (id: string) => `/api/units/${id}/services`,
    SPECIALTIES: (id: string) => `/api/units/${id}/specialties`,
    SPECIALTY: (unitId: string, specialtyId: string) => `/api/units/${unitId}/specialties/${specialtyId}`,
    SERVICE: (unitId: string, serviceId: string) => `/api/units/${unitId}/services/${serviceId}`,
    AMENITIES: (id: string) => `/api/units/${id}/amenities`,
    AMENITY: (unitId: string, amenityId: string) => `/api/units/${unitId}/amenities/${amenityId}`,
  },

  // Specialties
  SPECIALTIES: {
    BASE: '/api/specialties',
    DETAIL: (id: string) => `/api/specialties/${id}`,
    SEARCH: '/api/specialties/search',
  },

  // Amenities
  AMENITIES: {
    BASE: '/api/amenities',
    DETAIL: (id: string) => `/api/amenities/${id}`,
    SEARCH: '/api/amenities/search',
    SEED: '/api/amenities/seed',
  },

  // Services (Global)
  SERVICES_GLOBAL: {
    BASE: '/api/services',
    DETAIL: (id: string) => `/api/services/${id}`,
    SEARCH: '/api/services/search',
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/api/dashboard/stats',
    RECENT_BOOKINGS: '/api/dashboard/recent-bookings',
  },

  // Settings
  SETTINGS: {
    PROFILE: '/api/settings/profile',
    BUSINESS: '/api/settings/business',
    NOTIFICATIONS: '/api/settings/notifications',
  },

  // OTP (Phone Verification)
  OTP: {
    SEND: '/api/otp/send',
    VERIFY: '/api/otp/verify',
  },

  // Clients
  CLIENTS: {
    BASE: '/api/clients',
    DETAIL: (id: string) => `/api/clients/${id}`,
    BY_PHONE: '/api/clients/by-phone',
  },
} as const;

/**
 * Configuração de retry
 */
export const API_RETRY_CONFIG = {
  maxRetries: 3,
  retryDelay: 1000,
  retryStatusCodes: [408, 429, 500, 502, 503, 504],
} as const;
