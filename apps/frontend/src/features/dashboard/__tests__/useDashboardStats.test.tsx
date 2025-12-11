// ============================================================================
// USE DASHBOARD STATS HOOK TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDashboardStats } from "../hooks/queries/useDashboardStats";
import { mockDashboardStats } from "@/test/mocks/handlers";

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

describe("useDashboardStats", () => {
  it("should fetch dashboard stats", async () => {
    const { result } = renderHook(() => useDashboardStats(), {
      wrapper: createWrapper(),
    });

    // Initially loading
    expect(result.current.isLoading).toBe(true);

    // Wait for the query to resolve
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // Should have stats data
    expect(result.current.data).toBeDefined();
    expect(result.current.data?.appointmentsToday).toBe(
      mockDashboardStats.appointmentsToday
    );
    expect(result.current.data?.newClients).toBe(mockDashboardStats.newClients);
  });

  it("should not fetch when disabled", () => {
    const { result } = renderHook(() => useDashboardStats({ enabled: false }), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
