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
 */
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Customers
  CUSTOMERS: {
    BASE: '/customers',
    DETAIL: (id: string) => `/customers/${id}`,
  },

  // Services
  SERVICES: {
    BASE: '/services',
    DETAIL: (id: string) => `/services/${id}`,
  },

  // Bookings
  BOOKINGS: {
    BASE: '/bookings',
    DETAIL: (id: string) => `/bookings/${id}`,
    SLOTS: '/bookings/slots',
  },

  // Units
  UNITS: {
    BASE: '/units',
    DETAIL: (id: string) => `/units/${id}`,
    BY_SLUG: (slug: string) => `/units/slug/${slug}`,
  },

  // Dashboard
  DASHBOARD: {
    STATS: '/dashboard/stats',
    RECENT_BOOKINGS: '/dashboard/recent-bookings',
  },

  // Settings
  SETTINGS: {
    PROFILE: '/settings/profile',
    BUSINESS: '/settings/business',
    NOTIFICATIONS: '/settings/notifications',
  },

  // OTP (Phone Verification)
  OTP: {
    SEND: '/otp/send',
    VERIFY: '/otp/verify',
  },

  // Clients
  CLIENTS: {
    BASE: '/clients',
    DETAIL: (id: string) => `/clients/${id}`,
    BY_PHONE: '/clients/by-phone',
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
