// ============================================================================
// QUERY KEYS - Factory de query keys para React Query
// ============================================================================

/**
 * Filtros de agendamentos
 */
export interface BookingFilters {
  date?: string;
  status?: string;
  customerId?: string;
  serviceId?: string;
  page?: number;
  limit?: number;
}

/**
 * Filtros de clientes
 */
export interface CustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

/**
 * Filtros de serviços
 */
export interface ServiceFilters {
  active?: boolean;
  page?: number;
  limit?: number;
}

/**
 * Filtros de especialidades
 */
export interface SpecialtyFilters {
  cursor?: string;
  limit?: number;
}

/**
 * Filtros de serviços globais
 */
export interface GlobalServiceFilters {
  specialty_id?: string;
  cursor?: string;
  limit?: number;
}

/**
 * Filtros de serviços de unidade
 */
export interface UnitServiceFilters {
  cursor?: string;
  limit?: number;
}

/**
 * Query keys organizadas por feature
 * Padrão: feature.scope.params
 */
export const queryKeys = {
  // ========================================================================
  // Auth
  // ========================================================================
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
    session: () => [...queryKeys.auth.all, 'session'] as const,
  },

  // ========================================================================
  // Bookings
  // ========================================================================
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...queryKeys.bookings.all, 'list'] as const,
    list: (filters: BookingFilters = {}) =>
      [...queryKeys.bookings.lists(), filters] as const,
    details: () => [...queryKeys.bookings.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.bookings.details(), id] as const,
    slots: (date: string, serviceId: string) =>
      [...queryKeys.bookings.all, 'slots', { date, serviceId }] as const,
    byDate: (date: string) =>
      [...queryKeys.bookings.all, 'by-date', date] as const,
  },

  // ========================================================================
  // Customers
  // ========================================================================
  customers: {
    all: ['customers'] as const,
    lists: () => [...queryKeys.customers.all, 'list'] as const,
    list: (filters: CustomerFilters = {}) =>
      [...queryKeys.customers.lists(), filters] as const,
    details: () => [...queryKeys.customers.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.customers.details(), id] as const,
    search: (query: string) =>
      [...queryKeys.customers.all, 'search', query] as const,
    byPhone: (phone: string) =>
      [...queryKeys.customers.all, 'by-phone', phone] as const,
  },

  // ========================================================================
  // Services
  // ========================================================================
  services: {
    all: ['services'] as const,
    lists: () => [...queryKeys.services.all, 'list'] as const,
    list: (filters: ServiceFilters = {}) =>
      [...queryKeys.services.lists(), filters] as const,
    details: () => [...queryKeys.services.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.services.details(), id] as const,
    active: () => [...queryKeys.services.all, 'active'] as const,
  },

  // ========================================================================
  // Units
  // ========================================================================
  units: {
    all: ['units'] as const,
    lists: () => [...queryKeys.units.all, 'list'] as const,
    list: () => [...queryKeys.units.lists()] as const,
    details: () => [...queryKeys.units.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.units.details(), id] as const,
    bySlug: (slug: string) => [...queryKeys.units.all, 'slug', slug] as const,
    current: () => [...queryKeys.units.all, 'current'] as const,
  },

  // ========================================================================
  // Specialties (Global)
  // ========================================================================
  specialties: {
    all: ['specialties'] as const,
    lists: () => [...queryKeys.specialties.all, 'list'] as const,
    list: (filters: SpecialtyFilters = {}) =>
      [...queryKeys.specialties.lists(), filters] as const,
    details: () => [...queryKeys.specialties.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.specialties.details(), id] as const,
    search: (query: string, filters: SpecialtyFilters = {}) =>
      [...queryKeys.specialties.all, 'search', query, filters] as const,
  },

  // ========================================================================
  // Services (Global)
  // ========================================================================
  servicesGlobal: {
    all: ['services-global'] as const,
    lists: () => [...queryKeys.servicesGlobal.all, 'list'] as const,
    list: (filters: GlobalServiceFilters = {}) =>
      [...queryKeys.servicesGlobal.lists(), filters] as const,
    details: () => [...queryKeys.servicesGlobal.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.servicesGlobal.details(), id] as const,
    search: (query: string, filters: GlobalServiceFilters = {}) =>
      [...queryKeys.servicesGlobal.all, 'search', query, filters] as const,
  },

  // ========================================================================
  // Unit Specialties
  // ========================================================================
  unitSpecialties: {
    all: ['unit-specialties'] as const,
    lists: () => [...queryKeys.unitSpecialties.all, 'list'] as const,
    list: (unitId: string) =>
      [...queryKeys.unitSpecialties.lists(), unitId] as const,
  },

  // ========================================================================
  // Unit Services
  // ========================================================================
  unitServices: {
    all: ['unit-services'] as const,
    lists: () => [...queryKeys.unitServices.all, 'list'] as const,
    list: (unitId: string, filters: UnitServiceFilters = {}) =>
      [...queryKeys.unitServices.lists(), unitId, filters] as const,
  },

  // ========================================================================
  // Dashboard
  // ========================================================================
  dashboard: {
    all: ['dashboard'] as const,
    stats: () => [...queryKeys.dashboard.all, 'stats'] as const,
    recentBookings: () =>
      [...queryKeys.dashboard.all, 'recent-bookings'] as const,
    revenue: (period: string) =>
      [...queryKeys.dashboard.all, 'revenue', period] as const,
  },

  // ========================================================================
  // Agenda
  // ========================================================================
  agenda: {
    all: ['agenda'] as const,
    day: (date: string) => [...queryKeys.agenda.all, 'day', date] as const,
    week: (startDate: string) =>
      [...queryKeys.agenda.all, 'week', startDate] as const,
    month: (year: number, month: number) =>
      [...queryKeys.agenda.all, 'month', { year, month }] as const,
  },

  // ========================================================================
  // Settings
  // ========================================================================
  settings: {
    all: ['settings'] as const,
    profile: () => [...queryKeys.settings.all, 'profile'] as const,
    business: () => [...queryKeys.settings.all, 'business'] as const,
    notifications: () => [...queryKeys.settings.all, 'notifications'] as const,
    workingHours: () => [...queryKeys.settings.all, 'working-hours'] as const,
  },

  // ========================================================================
  // Referral
  // ========================================================================
  referral: {
    all: ['referral'] as const,
    stats: () => [...queryKeys.referral.all, 'stats'] as const,
    invites: () => [...queryKeys.referral.all, 'invites'] as const,
    history: () => [...queryKeys.referral.all, 'history'] as const,
  },

  // ========================================================================
  // Public Booking (for customers booking appointments)
  // ========================================================================
  booking: {
    all: ['public-booking'] as const,
    unit: (unitId: string) => [...queryKeys.booking.all, 'unit', unitId] as const,
    unitBySlug: (slug: string) =>
      [...queryKeys.booking.all, 'unit', 'slug', slug] as const,
    services: (unitId: string) =>
      [...queryKeys.booking.all, 'services', unitId] as const,
    availability: (unitId: string, date: string, serviceIds: string[]) =>
      [...queryKeys.booking.all, 'availability', { unitId, date, serviceIds }] as const,
    weekAvailability: (
      unitId: string,
      startDate: string,
      endDate: string,
      serviceIds: string[]
    ) =>
      [
        ...queryKeys.booking.all,
        'availability',
        'week',
        { unitId, startDate, endDate, serviceIds },
      ] as const,
    checkPhone: (phone: string, unitId: string) =>
      [...queryKeys.booking.all, 'check-phone', { phone, unitId }] as const,
  },
} as const;

/**
 * Tipo para extrair o tipo de uma query key
 */
export type QueryKeyType = typeof queryKeys;
