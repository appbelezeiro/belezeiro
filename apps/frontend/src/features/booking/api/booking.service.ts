// ============================================================================
// BOOKING SERVICE - API Integration for Booking Feature
// ============================================================================

import { createApiClient } from "@/lib/api";
import { API_ENDPOINTS } from "@/lib/api/config";
import type {
  Service,
  UnitInfo,
  Booking,
  CreateBookingRequest,
  CheckPhoneRequest,
  CheckPhoneResponse,
  DayAvailability,
} from "../types";
import {
  servicesListResponseSchema,
  unitInfoSchema,
  checkPhoneResponseSchema,
  dayAvailabilitySchema,
  bookingSchema,
} from "../schemas";

const apiClient = createApiClient();

/**
 * Booking Service
 * Handles all booking-related API calls
 */
class BookingService {
  /**
   * Get unit information for public booking page
   */
  async getUnitInfo(unitId: string): Promise<UnitInfo> {
    const response = await apiClient.get<UnitInfo>(
      `${API_ENDPOINTS.UNITS.BASE}/${unitId}/public`
    );
    return unitInfoSchema.parse(response.data);
  }

  /**
   * Get unit information by slug
   */
  async getUnitInfoBySlug(slug: string): Promise<UnitInfo> {
    const response = await apiClient.get<UnitInfo>(
      API_ENDPOINTS.UNITS.BY_SLUG(slug)
    );
    return unitInfoSchema.parse(response.data);
  }

  /**
   * Get available services for a unit
   */
  async getServices(unitId: string): Promise<Service[]> {
    const response = await apiClient.get<Service[]>(
      `${API_ENDPOINTS.UNITS.BASE}/${unitId}/services`
    );
    return servicesListResponseSchema.parse(response.data);
  }

  /**
   * Check if phone number exists for a unit
   */
  async checkPhone(request: CheckPhoneRequest): Promise<CheckPhoneResponse> {
    const response = await apiClient.post<CheckPhoneResponse>(
      `${API_ENDPOINTS.BOOKINGS.BASE}/check-phone`,
      request
    );
    return checkPhoneResponseSchema.parse(response.data);
  }

  /**
   * Get available time slots for a date
   */
  async getAvailability(
    unitId: string,
    date: string,
    serviceIds: string[]
  ): Promise<DayAvailability> {
    const response = await apiClient.get<DayAvailability>(
      API_ENDPOINTS.BOOKINGS.SLOTS,
      {
        params: {
          unitId,
          date,
          serviceIds: serviceIds.join(","),
        },
      }
    );
    return dayAvailabilitySchema.parse(response.data);
  }

  /**
   * Get available slots for multiple dates (week view)
   */
  async getWeekAvailability(
    unitId: string,
    startDate: string,
    endDate: string,
    serviceIds: string[]
  ): Promise<DayAvailability[]> {
    const response = await apiClient.get<DayAvailability[]>(
      `${API_ENDPOINTS.BOOKINGS.SLOTS}/week`,
      {
        params: {
          unitId,
          startDate,
          endDate,
          serviceIds: serviceIds.join(","),
        },
      }
    );
    return response.data.map((day) => dayAvailabilitySchema.parse(day));
  }

  /**
   * Create a new booking
   */
  async createBooking(request: CreateBookingRequest): Promise<Booking> {
    const response = await apiClient.post<Booking>(
      API_ENDPOINTS.BOOKINGS.BASE,
      request
    );
    return bookingSchema.parse(response.data);
  }

  /**
   * Get booking by ID
   */
  async getBooking(bookingId: string): Promise<Booking> {
    const response = await apiClient.get<Booking>(
      API_ENDPOINTS.BOOKINGS.DETAIL(bookingId)
    );
    return bookingSchema.parse(response.data);
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.BOOKINGS.DETAIL(bookingId));
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;
