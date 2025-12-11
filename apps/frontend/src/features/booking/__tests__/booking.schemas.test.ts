// ============================================================================
// BOOKING SCHEMAS TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  phoneSchema,
  otpCodeSchema,
  clientRegistrationSchema,
  serviceSchema,
  timeSlotSchema,
  createBookingRequestSchema,
} from "../schemas/booking.schemas";

describe("Booking Schemas", () => {
  describe("phoneSchema", () => {
    it("should validate a valid phone number", () => {
      const validPhone = "11999999999";
      const result = phoneSchema.safeParse(validPhone);
      expect(result.success).toBe(true);
    });

    it("should validate phone with country code", () => {
      const validPhone = "+5511999999999";
      const result = phoneSchema.safeParse(validPhone);
      expect(result.success).toBe(true);
    });

    it("should reject phone that is too short", () => {
      const invalidPhone = "999999";
      const result = phoneSchema.safeParse(invalidPhone);
      expect(result.success).toBe(false);
    });

    it("should reject phone with letters", () => {
      const invalidPhone = "11999abc999";
      const result = phoneSchema.safeParse(invalidPhone);
      expect(result.success).toBe(false);
    });
  });

  describe("otpCodeSchema", () => {
    it("should validate a valid 6-digit OTP", () => {
      const validOTP = "123456";
      const result = otpCodeSchema.safeParse(validOTP);
      expect(result.success).toBe(true);
    });

    it("should reject OTP with less than 6 digits", () => {
      const invalidOTP = "12345";
      const result = otpCodeSchema.safeParse(invalidOTP);
      expect(result.success).toBe(false);
    });

    it("should reject OTP with non-numeric characters", () => {
      const invalidOTP = "12345a";
      const result = otpCodeSchema.safeParse(invalidOTP);
      expect(result.success).toBe(false);
    });
  });

  describe("clientRegistrationSchema", () => {
    it("should validate valid client registration data", () => {
      const validData = {
        name: "John Doe",
        email: "john@example.com",
        phone: "11999999999",
      };

      const result = clientRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should allow empty email", () => {
      const validData = {
        name: "John Doe",
        email: "",
        phone: "11999999999",
      };

      const result = clientRegistrationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject name that is too short", () => {
      const invalidData = {
        name: "J",
        phone: "11999999999",
      };

      const result = clientRegistrationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("serviceSchema", () => {
    it("should validate a valid service", () => {
      const validService = {
        id: "service-1",
        name: "Corte de Cabelo",
        duration: 30,
        price: 50,
        category: "Cabelo",
      };

      const result = serviceSchema.safeParse(validService);
      expect(result.success).toBe(true);
    });

    it("should reject negative price", () => {
      const invalidService = {
        id: "service-1",
        name: "Corte",
        duration: 30,
        price: -10,
        category: "Cabelo",
      };

      const result = serviceSchema.safeParse(invalidService);
      expect(result.success).toBe(false);
    });
  });

  describe("timeSlotSchema", () => {
    it("should validate a valid time slot", () => {
      const validSlot = {
        id: "slot-1",
        time: "14:00",
        available: true,
      };

      const result = timeSlotSchema.safeParse(validSlot);
      expect(result.success).toBe(true);
    });

    it("should reject invalid time format", () => {
      const invalidSlot = {
        id: "slot-1",
        time: "2:00 PM",
        available: true,
      };

      const result = timeSlotSchema.safeParse(invalidSlot);
      expect(result.success).toBe(false);
    });
  });

  describe("createBookingRequestSchema", () => {
    it("should validate a valid booking request", () => {
      const validRequest = {
        unitId: "unit-1",
        clientPhone: "11999999999",
        clientName: "John Doe",
        serviceIds: ["service-1"],
        date: "2024-12-15",
        time: "14:00",
      };

      const result = createBookingRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject empty service list", () => {
      const invalidRequest = {
        unitId: "unit-1",
        clientPhone: "11999999999",
        clientName: "John Doe",
        serviceIds: [],
        date: "2024-12-15",
        time: "14:00",
      };

      const result = createBookingRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });
  });
});
