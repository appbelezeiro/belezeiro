// ============================================================================
// BOOKING SCHEMAS - Zod Validation Schemas for Booking Feature
// ============================================================================

import { z } from "zod";

/**
 * Phone Number Schema (Brazilian format)
 */
export const phoneSchema = z
  .string()
  .min(10, "Telefone deve ter pelo menos 10 dígitos")
  .max(15, "Telefone deve ter no máximo 15 dígitos")
  .regex(/^\+?[0-9]{10,15}$/, "Formato de telefone inválido");

/**
 * OTP Code Schema
 */
export const otpCodeSchema = z
  .string()
  .length(6, "Código deve ter 6 dígitos")
  .regex(/^[0-9]{6}$/, "Código deve conter apenas números");

/**
 * Client Registration Schema
 */
export const clientRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, "Nome deve ter pelo menos 2 caracteres")
    .max(100, "Nome deve ter no máximo 100 caracteres"),
  email: z
    .string()
    .email("Email inválido")
    .optional()
    .or(z.literal("")),
  phone: phoneSchema,
});

/**
 * Service Schema
 */
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  duration: z.number().positive(),
  price: z.number().min(0),
  category: z.string(),
  isActive: z.boolean().optional(),
});

/**
 * Time Slot Schema
 */
export const timeSlotSchema = z.object({
  id: z.string(),
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/, "Formato de hora inválido"),
  available: z.boolean(),
  professionalId: z.string().optional(),
});

/**
 * Unit Info Schema
 */
export const unitInfoSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  unitName: z.string(),
  address: z.string(),
  logo: z.string().nullable().optional(),
  primaryColor: z.string(),
  isBookingEnabled: z.boolean(),
  images: z.array(z.string()),
});

/**
 * Booking Form Data Schema
 */
export const bookingFormDataSchema = z.object({
  phone: phoneSchema,
  isNewClient: z.boolean(),
  clientName: z.string(),
  clientEmail: z.string(),
  selectedServices: z.array(serviceSchema).min(1, "Selecione pelo menos um serviço"),
  selectedDate: z.date(),
  selectedTime: timeSlotSchema.nullable(),
});

/**
 * Create Booking Request Schema
 */
export const createBookingRequestSchema = z.object({
  unitId: z.string(),
  clientPhone: phoneSchema,
  clientName: z.string().min(2),
  clientEmail: z.string().email().optional(),
  serviceIds: z.array(z.string()).min(1),
  date: z.string(), // ISO date string
  time: z.string().regex(/^[0-2][0-9]:[0-5][0-9]$/),
  notes: z.string().optional(),
});

/**
 * Booking Response Schema
 */
export const bookingSchema = z.object({
  id: z.string(),
  unitId: z.string(),
  clientId: z.string(),
  clientName: z.string(),
  clientPhone: z.string(),
  services: z.array(serviceSchema),
  date: z.string(),
  time: z.string(),
  totalDuration: z.number(),
  totalPrice: z.number(),
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED", "NO_SHOW"]),
  createdAt: z.string(),
  confirmationCode: z.string().optional(),
});

/**
 * Check Phone Response Schema
 */
export const checkPhoneResponseSchema = z.object({
  exists: z.boolean(),
  clientName: z.string().optional(),
});

/**
 * Send OTP Response Schema
 */
export const sendOTPResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  expiresIn: z.number(),
});

/**
 * Verify OTP Response Schema
 */
export const verifyOTPResponseSchema = z.object({
  success: z.boolean(),
  isNewClient: z.boolean(),
  clientId: z.string().optional(),
  token: z.string().optional(),
});

/**
 * Services List Response Schema
 */
export const servicesListResponseSchema = z.array(serviceSchema);

/**
 * Day Availability Schema
 */
export const dayAvailabilitySchema = z.object({
  date: z.string(),
  slots: z.array(timeSlotSchema),
});

// Type exports from schemas
export type PhoneInput = z.infer<typeof phoneSchema>;
export type OTPCode = z.infer<typeof otpCodeSchema>;
export type ClientRegistrationInput = z.infer<typeof clientRegistrationSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TimeSlotInput = z.infer<typeof timeSlotSchema>;
export type UnitInfoInput = z.infer<typeof unitInfoSchema>;
export type BookingFormDataInput = z.infer<typeof bookingFormDataSchema>;
export type CreateBookingInput = z.infer<typeof createBookingRequestSchema>;
export type BookingInput = z.infer<typeof bookingSchema>;
