// ============================================================================
// USE SERVICES HOOK TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useServices, useActiveServices } from "../hooks/queries/useServices";
import { mockService } from "@/test/mocks/handlers";

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useServices", () => {
  it("should fetch services list", async () => {
    const { result } = renderHook(() => useServices(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have services data
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.services).toHaveLength(1);
    expect(result.current.data?.services[0].name).toBe(mockService.name);
  });

  it("should pass filters to the query", async () => {
    const { result } = renderHook(
      () => useServices({ category: "Cabelo", isActive: true }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch when disabled", () => {
    const { result } = renderHook(() => useServices({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});

describe("useActiveServices", () => {
  it("should fetch active services only", async () => {
    const { result } = renderHook(() => useActiveServices(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
    expect(Array.isArray(result.current.data)).toBe(true);
  });
});
