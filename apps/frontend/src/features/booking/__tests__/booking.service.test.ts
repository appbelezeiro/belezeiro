// ============================================================================
// BOOKING SERVICE TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { bookingService } from "../api/booking.service";
import { mockUnitInfo, mockService, mockBooking } from "@/test/mocks/handlers";

describe("BookingService", () => {
  describe("getUnitInfo", () => {
    it("should fetch unit info by ID", async () => {
      const result = await bookingService.getUnitInfo("unit-1");

      expect(result).toBeDefined();
      expect(result.id).toBe(mockUnitInfo.id);
      expect(result.businessName).toBe(mockUnitInfo.businessName);
      expect(result.isBookingEnabled).toBe(true);
    });
  });

  describe("getUnitInfoBySlug", () => {
    it("should fetch unit info by slug", async () => {
      const result = await bookingService.getUnitInfoBySlug("salao-do-zeze");

      expect(result).toBeDefined();
      expect(result.businessName).toBe(mockUnitInfo.businessName);
    });
  });

  describe("getServices", () => {
    it("should fetch services for a unit", async () => {
      const result = await bookingService.getServices("unit-1");

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBe(mockService.name);
    });
  });

  describe("checkPhone", () => {
    it("should check if phone exists", async () => {
      const result = await bookingService.checkPhone({
        phone: "11999999999",
        unitId: "unit-1",
      });

      expect(result).toBeDefined();
      expect(typeof result.exists).toBe("boolean");
    });
  });

  describe("getAvailability", () => {
    it("should fetch available time slots", async () => {
      const result = await bookingService.getAvailability(
        "unit-1",
        "2024-12-15",
        ["service-1"]
      );

      expect(result).toBeDefined();
      expect(result.date).toBe("2024-12-15");
      expect(Array.isArray(result.slots)).toBe(true);
    });
  });

  describe("createBooking", () => {
    it("should create a new booking", async () => {
      const result = await bookingService.createBooking({
        unitId: "unit-1",
        clientPhone: "11999999999",
        clientName: "John Doe",
        serviceIds: ["service-1"],
        date: "2024-12-15",
        time: "14:00",
      });

      expect(result).toBeDefined();
      expect(result.id).toBe(mockBooking.id);
      expect(result.status).toBe("CONFIRMED");
      expect(result.confirmationCode).toBeDefined();
    });
  });

  describe("getBooking", () => {
    it("should fetch a booking by ID", async () => {
      const result = await bookingService.getBooking("booking-1");

      expect(result).toBeDefined();
      expect(result.id).toBe("booking-1");
    });
  });

  describe("cancelBooking", () => {
    it("should cancel a booking", async () => {
      await expect(
        bookingService.cancelBooking("booking-1")
      ).resolves.not.toThrow();
    });
  });
});
