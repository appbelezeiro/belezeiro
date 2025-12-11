// ============================================================================
// USE BOOKING FLOW HOOK TESTS
// ============================================================================

import { describe, it, expect } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBookingFlow } from "../hooks/useBookingFlow";
import { mockUnitInfo, mockService } from "@/test/mocks/handlers";

// Create a wrapper with QueryClient
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useBookingFlow", () => {
  it("should initialize with PHONE_INPUT step", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    expect(result.current.currentStep).toBe("PHONE_INPUT");
    expect(result.current.progress).toBe(20); // First step of 5 steps
  });

  it("should have empty form data initially", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    expect(result.current.formData.phone).toBe("");
    expect(result.current.formData.selectedServices).toHaveLength(0);
    expect(result.current.formData.selectedTime).toBeNull();
  });

  it("should calculate total price correctly", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    // Initially zero
    expect(result.current.totalPrice).toBe(0);

    // Add a service
    act(() => {
      result.current.selectServices([mockService]);
    });

    expect(result.current.totalPrice).toBe(mockService.price);
  });

  it("should calculate total duration correctly", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    // Initially zero
    expect(result.current.totalDuration).toBe(0);

    // Add a service
    act(() => {
      result.current.selectServices([mockService]);
    });

    expect(result.current.totalDuration).toBe(mockService.duration);
  });

  it("should handle service selection", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    act(() => {
      result.current.selectServices([mockService]);
    });

    expect(result.current.formData.selectedServices).toHaveLength(1);
    expect(result.current.formData.selectedServices[0].id).toBe(mockService.id);
  });

  it("should handle date selection", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    const newDate = new Date("2024-12-20");

    act(() => {
      result.current.selectDate(newDate);
    });

    expect(result.current.formData.selectedDate.toDateString()).toBe(
      newDate.toDateString()
    );
    // Time should be reset when date changes
    expect(result.current.formData.selectedTime).toBeNull();
  });

  it("should handle time selection", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    const timeSlot = { id: "slot-1", time: "14:00", available: true };

    act(() => {
      result.current.selectTime(timeSlot);
    });

    expect(result.current.formData.selectedTime).toEqual(timeSlot);
  });

  it("should reset to initial state", () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    // Make some changes
    act(() => {
      result.current.selectServices([mockService]);
      result.current.selectTime({ id: "slot-1", time: "14:00", available: true });
    });

    // Reset
    act(() => {
      result.current.reset();
    });

    expect(result.current.currentStep).toBe("PHONE_INPUT");
    expect(result.current.formData.phone).toBe("");
    expect(result.current.formData.selectedServices).toHaveLength(0);
    expect(result.current.formData.selectedTime).toBeNull();
  });

  it("should submit phone and store the value", async () => {
    const { result } = renderHook(
      () => useBookingFlow({ unitId: "unit-1", unitInfo: mockUnitInfo }),
      { wrapper: createWrapper() }
    );

    // Submit phone
    await act(async () => {
      await result.current.submitPhone("11999999999");
    });

    // Phone should be stored in form data
    expect(result.current.formData.phone).toBe("11999999999");
  });
});
