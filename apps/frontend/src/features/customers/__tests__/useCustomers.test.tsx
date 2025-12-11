// ============================================================================
// USE CUSTOMERS HOOK TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCustomers } from "../hooks/queries/useCustomers";
import { mockCustomer } from "@/test/mocks/handlers";

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

describe("useCustomers", () => {
  it("should fetch customers list", async () => {
    const { result } = renderHook(() => useCustomers(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have customers data
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.customers).toHaveLength(1);
    expect(result.current.data?.customers[0].name).toBe(mockCustomer.name);
  });

  it("should pass filters to the query", async () => {
    const { result } = renderHook(
      () => useCustomers({ search: "John", page: 1, limit: 20 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });

  it("should not fetch when disabled", () => {
    const { result } = renderHook(() => useCustomers({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
