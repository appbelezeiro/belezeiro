// ============================================================================
// AUTH SCHEMAS TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import {
  loginRequestSchema,
  loginResponseSchema,
  userSchema,
  meResponseSchema,
} from "../schemas/auth.schemas";

describe("Auth Schemas", () => {
  describe("loginRequestSchema", () => {
    it("should validate a valid OAuth login request", () => {
      const validData = {
        name: "Test User",
        email: "test@example.com",
        providerId: "google-oauth-id-123",
        photoUrl: "https://example.com/photo.jpg",
      };

      const result = loginRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should reject invalid email", () => {
      const invalidData = {
        name: "Test User",
        email: "invalid-email",
        providerId: "google-oauth-id-123",
      };

      const result = loginRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should reject missing providerId", () => {
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
      };

      const result = loginRequestSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow optional photoUrl", () => {
      const validData = {
        name: "Test User",
        email: "test@example.com",
        providerId: "google-oauth-id-123",
      };

      const result = loginRequestSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("userSchema", () => {
    it("should validate a valid user", () => {
      const validUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        photo: "https://example.com/photo.jpg",
        isActive: true,
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should validate user without optional fields", () => {
      const validUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      };

      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it("should set default isActive to true", () => {
      const validUser = {
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
      };

      const result = userSchema.parse(validUser);
      expect(result.isActive).toBe(true);
    });
  });

  describe("loginResponseSchema", () => {
    it("should validate a valid login response", () => {
      const validResponse = {
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
        },
      };

      const result = loginResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it("should allow optional created field", () => {
      const validResponse = {
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
        },
        created: true,
      };

      const result = loginResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });

  describe("meResponseSchema", () => {
    it("should validate a valid me response", () => {
      const validResponse = {
        user: {
          id: "user-1",
          name: "John Doe",
          email: "john@example.com",
          isActive: true,
        },
      };

      const result = meResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });
  });
});
