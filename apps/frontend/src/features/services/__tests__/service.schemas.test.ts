// ============================================================================
// SERVICE SCHEMAS TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  serviceSchema,
  createServiceRequestSchema,
  updateServiceRequestSchema,
  servicesListResponseSchema,
  serviceCategorySchema,
} from "../schemas/service.schemas";

describe("Service Schemas", () => {
  describe("serviceSchema", () => {
    it("should validate a valid service", () => {
      const validService = {
        id: "service-1",
        name: "Corte de Cabelo",
        description: "Corte masculino tradicional",
        duration: 30,
        price: 50,
        category: "Cabelo",
        color: "#3B82F6",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const result = serviceSchema.safeParse(validService);
      expect(result.success).toBe(true);
    });

    it("should reject invalid duration", () => {
      const invalidService = {
        id: "service-1",
        name: "Corte",
        duration: -10,
        price: 50,
        category: "Cabelo",
        color: "#3B82F6",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const result = serviceSchema.safeParse(invalidService);
      expect(result.success).toBe(false);
    });

    it("should reject negative price", () => {
      const invalidService = {
        id: "service-1",
        name: "Corte",
        duration: 30,
        price: -10,
        category: "Cabelo",
        color: "#3B82F6",
        isActive: true,
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
      };

      const result = serviceSchema.safeParse(invalidService);
      expect(result.success).toBe(false);
    });
  });

  describe("createServiceRequestSchema", () => {
    it("should validate valid create request", () => {
      const validRequest = {
        name: "Corte de Cabelo",
        duration: 30,
        price: 50,
        category: "Cabelo",
      };

      const result = createServiceRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject short name", () => {
      const invalidRequest = {
        name: "C",
        duration: 30,
        price: 50,
        category: "Cabelo",
      };

      const result = createServiceRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it("should allow optional fields", () => {
      const validRequest = {
        name: "Corte de Cabelo",
        duration: 30,
        price: 50,
        category: "Cabelo",
        description: "Corte masculino",
        color: "#FF0000",
      };

      const result = createServiceRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });
  });

  describe("updateServiceRequestSchema", () => {
    it("should validate partial update", () => {
      const validUpdate = {
        price: 60,
      };

      const result = updateServiceRequestSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate full update", () => {
      const validUpdate = {
        name: "Corte Premium",
        description: "Corte com lavagem",
        duration: 45,
        price: 80,
        category: "Premium",
        color: "#00FF00",
        isActive: true,
      };

      const result = updateServiceRequestSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe("serviceCategorySchema", () => {
    it("should validate valid category", () => {
      const validCategory = {
        id: "cat-1",
        name: "Cabelo",
        description: "Serviços de cabelo",
        order: 1,
        servicesCount: 5,
      };

      const result = serviceCategorySchema.safeParse(validCategory);
      expect(result.success).toBe(true);
    });

    it("should allow optional description", () => {
      const validCategory = {
        id: "cat-1",
        name: "Cabelo",
        order: 1,
        servicesCount: 5,
      };

      const result = serviceCategorySchema.safeParse(validCategory);
      expect(result.success).toBe(true);
    });
  });

  describe("servicesListResponseSchema", () => {
    it("should validate valid list response", () => {
      const validResponse = {
        services: [
          {
            id: "service-1",
            name: "Corte",
            duration: 30,
            price: 50,
            category: "Cabelo",
            color: "#3B82F6",
            isActive: true,
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            appointmentsCount: 100,
            revenue: 5000,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
      };

      const result = servicesListResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});
