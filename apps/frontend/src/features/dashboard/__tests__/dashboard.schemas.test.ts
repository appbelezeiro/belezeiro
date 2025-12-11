// ============================================================================
// DASHBOARD SCHEMAS TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  dashboardStatsSchema,
  appointmentStatusSchema,
  dashboardAppointmentSchema,
  secretaryInfoSchema,
  planInfoSchema,
  revenueStatsSchema,
} from "../schemas/dashboard.schemas";

describe("Dashboard Schemas", () => {
  describe("dashboardStatsSchema", () => {
    it("should validate valid dashboard stats", () => {
      const validStats = {
        appointmentsToday: 12,
        appointmentsChange: 3,
        newClients: 4,
        newClientsChange: 2,
        topService: "Corte",
        topServicePercentage: 35,
        peakHours: "14h-16h",
        peakHoursCount: 8,
        revenue: 1500,
        revenueChange: 10,
      };

      const result = dashboardStatsSchema.safeParse(validStats);
      expect(result.success).toBe(true);
    });

    it("should reject missing fields", () => {
      const invalidStats = {
        appointmentsToday: 12,
        // missing other fields
      };

      const result = dashboardStatsSchema.safeParse(invalidStats);
      expect(result.success).toBe(false);
    });
  });

  describe("appointmentStatusSchema", () => {
    it("should validate valid appointment statuses", () => {
      const validStatuses = [
        "scheduled",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
        "no_show",
      ];

      validStatuses.forEach((status) => {
        const result = appointmentStatusSchema.safeParse(status);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid status", () => {
      const result = appointmentStatusSchema.safeParse("invalid_status");
      expect(result.success).toBe(false);
    });
  });

  describe("dashboardAppointmentSchema", () => {
    it("should validate valid appointment", () => {
      const validAppointment = {
        id: "apt-1",
        clientName: "John Doe",
        clientPhone: "11999999999",
        serviceName: "Corte",
        serviceColor: "#3B82F6",
        time: "14:00",
        duration: 30,
        status: "confirmed",
      };

      const result = dashboardAppointmentSchema.safeParse(validAppointment);
      expect(result.success).toBe(true);
    });
  });

  describe("secretaryInfoSchema", () => {
    it("should validate valid secretary info", () => {
      const validInfo = {
        status: "active",
        messagesHandled: 150,
        appointmentsBooked: 45,
        responseRate: 98,
        averageResponseTime: 30,
        isEnabled: true,
      };

      const result = secretaryInfoSchema.safeParse(validInfo);
      expect(result.success).toBe(true);
    });

    it("should validate all status types", () => {
      const statuses = ["active", "inactive", "busy", "offline"];

      statuses.forEach((status) => {
        const info = {
          status,
          messagesHandled: 0,
          appointmentsBooked: 0,
          responseRate: 0,
          averageResponseTime: 0,
          isEnabled: false,
        };

        const result = secretaryInfoSchema.safeParse(info);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("planInfoSchema", () => {
    it("should validate valid plan info", () => {
      const validPlan = {
        plan: "professional",
        planName: "Profissional",
        daysRemaining: 25,
        appointmentsUsed: 150,
        appointmentsLimit: 500,
        features: ["Feature 1", "Feature 2"],
      };

      const result = planInfoSchema.safeParse(validPlan);
      expect(result.success).toBe(true);
    });

    it("should validate all plan types", () => {
      const planTypes = ["free", "starter", "professional", "enterprise"];

      planTypes.forEach((plan) => {
        const info = {
          plan,
          planName: plan,
          appointmentsUsed: 0,
          appointmentsLimit: 100,
          features: [],
        };

        const result = planInfoSchema.safeParse(info);
        expect(result.success).toBe(true);
      });
    });
  });

  describe("revenueStatsSchema", () => {
    it("should validate valid revenue stats", () => {
      const validStats = {
        period: "month",
        total: 15000,
        change: 10,
        data: [
          { date: "2024-12-01", revenue: 500, appointments: 10 },
          { date: "2024-12-02", revenue: 600, appointments: 12 },
        ],
      };

      const result = revenueStatsSchema.safeParse(validStats);
      expect(result.success).toBe(true);
    });

    it("should validate all period types", () => {
      const periods = ["day", "week", "month", "year"];

      periods.forEach((period) => {
        const stats = {
          period,
          total: 0,
          change: 0,
          data: [],
        };

        const result = revenueStatsSchema.safeParse(stats);
        expect(result.success).toBe(true);
      });
    });
  });
});
