// ============================================================================
// AUTH SERVICE TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { getAuthService, createAuthService } from "../api/auth.service";
import { mockUser } from "@/test/mocks/handlers";

describe("AuthService", () => {
  describe("login", () => {
    it("should successfully login with valid OAuth credentials", async () => {
      const authService = getAuthService();
      const result = await authService.login({
        name: "Test User",
        email: "test@example.com",
        providerId: "google-oauth-id-123",
      });

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(mockUser.email);
    });
  });

  describe("getCurrentUser", () => {
    it("should return the current user", async () => {
      const authService = getAuthService();
      const user = await authService.getCurrentUser();

      expect(user).toBeDefined();
      expect(user.id).toBe(mockUser.id);
      expect(user.email).toBe(mockUser.email);
    });
  });

  describe("checkAuth", () => {
    it("should return user when authenticated", async () => {
      const authService = getAuthService();
      const user = await authService.checkAuth();

      expect(user).not.toBeNull();
      expect(user?.id).toBe(mockUser.id);
    });
  });

  describe("logout", () => {
    it("should successfully logout", async () => {
      const authService = getAuthService();
      // Should not throw
      await expect(authService.logout()).resolves.not.toThrow();
    });
  });

  describe("createAuthService", () => {
    it("should create a new instance", () => {
      const instance1 = createAuthService();
      const instance2 = createAuthService();

      // They should be different instances
      expect(instance1).not.toBe(instance2);
    });
  });
});
