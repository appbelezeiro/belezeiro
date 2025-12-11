// ============================================================================
// USE CURRENT USER HOOK TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCurrentUser } from "../hooks/queries/useCurrentUser";
import { mockUser } from "@/test/mocks/handlers";

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

describe("useCurrentUser", () => {
  it("should fetch and return the current user", async () => {
    const { result } = renderHook(() => useCurrentUser(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have user data
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.id).toBe(mockUser.id);
    expect(result.current.data?.email).toBe(mockUser.email);
  });

  it("should not fetch when disabled", async () => {
    const { result } = renderHook(() => useCurrentUser({ enabled: false }), {
      wrapper: createWrapper(),
    });

    // Should not be loading since it's disabled
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
