// ============================================================================
// CUSTOMER SCHEMAS TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  customerSchema,
  createCustomerRequestSchema,
  updateCustomerRequestSchema,
  customersListResponseSchema,
} from "../schemas/customer.schemas";

describe("Customer Schemas", () => {
  describe("customerSchema", () => {
    it("should validate a valid customer", () => {
      const validCustomer = {
        id: "customer-1",
        name: "John Doe",
        phone: "11999999999",
        email: "john@example.com",
        tags: ["VIP"],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        isActive: true,
      };

      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });

    it("should allow optional fields", () => {
      const minimalCustomer = {
        id: "customer-1",
        name: "John Doe",
        phone: "11999999999",
        tags: [],
        createdAt: "2024-01-01T00:00:00.000Z",
        updatedAt: "2024-01-01T00:00:00.000Z",
        isActive: true,
      };

      const result = customerSchema.safeParse(minimalCustomer);
      expect(result.success).toBe(true);
    });
  });

  describe("createCustomerRequestSchema", () => {
    it("should validate valid create request", () => {
      const validRequest = {
        name: "John Doe",
        phone: "11999999999",
        email: "john@example.com",
      };

      const result = createCustomerRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });

    it("should reject name that is too short", () => {
      const invalidRequest = {
        name: "J",
        phone: "11999999999",
      };

      const result = createCustomerRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it("should reject invalid phone", () => {
      const invalidRequest = {
        name: "John Doe",
        phone: "123",
      };

      const result = createCustomerRequestSchema.safeParse(invalidRequest);
      expect(result.success).toBe(false);
    });

    it("should allow empty email", () => {
      const validRequest = {
        name: "John Doe",
        phone: "11999999999",
        email: "",
      };

      const result = createCustomerRequestSchema.safeParse(validRequest);
      expect(result.success).toBe(true);
    });
  });

  describe("updateCustomerRequestSchema", () => {
    it("should validate partial update", () => {
      const validUpdate = {
        name: "Jane Doe",
      };

      const result = updateCustomerRequestSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate full update", () => {
      const validUpdate = {
        name: "Jane Doe",
        phone: "11988888888",
        email: "jane@example.com",
        isActive: false,
      };

      const result = updateCustomerRequestSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should allow empty object", () => {
      const result = updateCustomerRequestSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe("customersListResponseSchema", () => {
    it("should validate valid list response", () => {
      const validResponse = {
        customers: [
          {
            id: "customer-1",
            name: "John Doe",
            phone: "11999999999",
            tags: [],
            createdAt: "2024-01-01T00:00:00.000Z",
            updatedAt: "2024-01-01T00:00:00.000Z",
            isActive: true,
            totalAppointments: 10,
            totalSpent: 500,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      const result = customersListResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it("should validate empty list", () => {
      const emptyResponse = {
        customers: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      const result = customersListResponseSchema.safeParse(emptyResponse);
      expect(result.success).toBe(true);
    });
  });
});
