// ============================================================================
// BOOKING TYPES - Domain Types for Booking Feature
// ============================================================================

/**
 * Booking Flow Steps (State Machine States)
 */
export type BookingStep =
  | "PHONE_INPUT"
  | "OTP_VERIFICATION"
  | "REGISTRATION"
  | "SERVICE_SELECTION"
  | "TIME_SELECTION"
  | "CONFIRMATION"
  | "SUCCESS";

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
  isActive?: boolean;
}

/**
 * Service Category
 */
export interface ServiceCategory {
  id: string;
  name: string;
  services: Service[];
}

/**
 * Time Slot Entity
 */
export interface TimeSlot {
  id: string;
  time: string; // HH:mm format
  available: boolean;
  professionalId?: string;
}

/**
 * Available Slots for a Date
 */
export interface DayAvailability {
  date: string; // ISO date string
  slots: TimeSlot[];
}

/**
 * Client Info (for registration)
 */
export interface ClientInfo {
  name: string;
  email: string;
  phone: string;
}

/**
 * Unit Info (for public booking page)
 */
export interface UnitInfo {
  id: string;
  businessName: string;
  unitName: string;
  address: string;
  logo?: string | null;
  primaryColor: string;
  isBookingEnabled: boolean;
  images: string[];
}

/**
 * Booking Data (form state during booking flow)
 */
export interface BookingFormData {
  phone: string;
  isNewClient: boolean;
  clientName: string;
  clientEmail: string;
  selectedServices: Service[];
  selectedDate: Date;
  selectedTime: TimeSlot | null;
}

/**
 * Booking Request (for API)
 */
export interface CreateBookingRequest {
  unitId: string;
  clientPhone: string;
  clientName: string;
  clientEmail?: string;
  serviceIds: string[];
  date: string; // ISO date string
  time: string; // HH:mm format
  notes?: string;
}

/**
 * Booking Response (from API)
 */
export interface Booking {
  id: string;
  unitId: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  services: Service[];
  date: string;
  time: string;
  totalDuration: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
  confirmationCode?: string;
}

/**
 * Booking Status
 */
export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED"
  | "NO_SHOW";

/**
 * OTP Verification Request
 */
export interface SendOTPRequest {
  phone: string;
}

/**
 * OTP Verification Response
 */
export interface SendOTPResponse {
  success: boolean;
  message: string;
  expiresIn: number; // seconds
}

/**
 * Verify OTP Request
 */
export interface VerifyOTPRequest {
  phone: string;
  code: string;
}

/**
 * Verify OTP Response
 */
export interface VerifyOTPResponse {
  success: boolean;
  isNewClient: boolean;
  clientId?: string;
  token?: string;
}

/**
 * Check Phone Request
 */
export interface CheckPhoneRequest {
  phone: string;
  unitId: string;
}

/**
 * Check Phone Response
 */
export interface CheckPhoneResponse {
  exists: boolean;
  clientName?: string | null;
}

/**
 * Register Client Request
 */
export interface RegisterClientRequest {
  phone: string;
  name: string;
  email?: string;
  unitId: string;
}

/**
 * Register Client Response
 */
export interface RegisterClientResponse {
  clientId: string;
  name: string;
  phone: string;
  email?: string;
}

/**
 * Booking State Machine Context
 */
export interface BookingContext {
  unitId: string;
  unitInfo: UnitInfo | null;
  formData: BookingFormData;
  currentStep: BookingStep;
  clientId: string | null;
  bookingResult: Booking | null;
  error: string | null;
}

/**
 * Booking State Machine Events
 */
export type BookingEvent =
  | { type: "SUBMIT_PHONE"; phone: string }
  | { type: "PHONE_EXISTS"; clientName: string }
  | { type: "PHONE_NEW" }
  | { type: "SEND_OTP" }
  | { type: "VERIFY_OTP"; code: string }
  | { type: "OTP_VERIFIED" }
  | { type: "REGISTER_CLIENT"; name: string; email: string }
  | { type: "CLIENT_REGISTERED"; clientId: string }
  | { type: "SELECT_SERVICES"; services: Service[] }
  | { type: "SELECT_DATE"; date: Date }
  | { type: "SELECT_TIME"; timeSlot: TimeSlot }
  | { type: "CONFIRM_BOOKING" }
  | { type: "BOOKING_SUCCESS"; booking: Booking }
  | { type: "BOOKING_ERROR"; error: string }
  | { type: "GO_BACK" }
  | { type: "RESET" };
