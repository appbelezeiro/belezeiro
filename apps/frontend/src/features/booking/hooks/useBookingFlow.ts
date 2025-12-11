// ============================================================================
// USE BOOKING FLOW - Main Hook to Orchestrate Booking Flow
// ============================================================================

import { useReducer, useCallback, useMemo } from "react";
import type {
  BookingStep,
  BookingFormData,
  Service,
  TimeSlot,
  Booking,
  UnitInfo,
} from "../types";
import { useCheckPhone } from "./mutations/useCheckPhone";
import { useSendOTP, useResendOTP } from "./mutations/useSendOTP";
import { useVerifyOTP } from "./mutations/useVerifyOTP";
import { useRegisterClient } from "./mutations/useRegisterClient";
import { useCreateBooking } from "./mutations/useCreateBooking";

// ============================================================================
// State Types
// ============================================================================

interface BookingFlowState {
  currentStep: BookingStep;
  formData: BookingFormData;
  clientId: string | null;
  bookingResult: Booking | null;
  error: string | null;
  isLoading: boolean;
}

type BookingFlowAction =
  | { type: "SET_STEP"; step: BookingStep }
  | { type: "UPDATE_FORM"; data: Partial<BookingFormData> }
  | { type: "SET_CLIENT_ID"; clientId: string }
  | { type: "SET_BOOKING_RESULT"; booking: Booking }
  | { type: "SET_ERROR"; error: string | null }
  | { type: "SET_LOADING"; isLoading: boolean }
  | { type: "RESET" };

// ============================================================================
// Initial State
// ============================================================================

const initialFormData: BookingFormData = {
  phone: "",
  isNewClient: false,
  clientName: "",
  clientEmail: "",
  selectedServices: [],
  selectedDate: new Date(),
  selectedTime: null,
};

const initialState: BookingFlowState = {
  currentStep: "PHONE_INPUT",
  formData: initialFormData,
  clientId: null,
  bookingResult: null,
  error: null,
  isLoading: false,
};

// ============================================================================
// Reducer
// ============================================================================

function bookingFlowReducer(
  state: BookingFlowState,
  action: BookingFlowAction
): BookingFlowState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step, error: null };

    case "UPDATE_FORM":
      return {
        ...state,
        formData: { ...state.formData, ...action.data },
        error: null,
      };

    case "SET_CLIENT_ID":
      return { ...state, clientId: action.clientId };

    case "SET_BOOKING_RESULT":
      return { ...state, bookingResult: action.booking };

    case "SET_ERROR":
      return { ...state, error: action.error, isLoading: false };

    case "SET_LOADING":
      return { ...state, isLoading: action.isLoading };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

// ============================================================================
// Hook
// ============================================================================

interface UseBookingFlowOptions {
  unitId: string;
  unitInfo?: UnitInfo | null;
}

export function useBookingFlow({ unitId, unitInfo }: UseBookingFlowOptions) {
  const [state, dispatch] = useReducer(bookingFlowReducer, initialState);

  // Mutations
  const checkPhoneMutation = useCheckPhone();
  const sendOTPMutation = useSendOTP();
  const resendOTPMutation = useResendOTP();
  const verifyOTPMutation = useVerifyOTP();
  const registerClientMutation = useRegisterClient();
  const createBookingMutation = useCreateBooking();

  // ========================================================================
  // Step Navigation
  // ========================================================================

  const goToStep = useCallback((step: BookingStep) => {
    dispatch({ type: "SET_STEP", step });
  }, []);

  const goBack = useCallback(() => {
    const { currentStep, formData } = state;

    const stepOrder: BookingStep[] = formData.isNewClient
      ? [
          "PHONE_INPUT",
          "OTP_VERIFICATION",
          "REGISTRATION",
          "SERVICE_SELECTION",
          "TIME_SELECTION",
          "CONFIRMATION",
          "SUCCESS",
        ]
      : [
          "PHONE_INPUT",
          "SERVICE_SELECTION",
          "TIME_SELECTION",
          "CONFIRMATION",
          "SUCCESS",
        ];

    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      dispatch({ type: "SET_STEP", step: stepOrder[currentIndex - 1] });
    }
  }, [state]);

  const reset = useCallback(() => {
    dispatch({ type: "RESET" });
  }, []);

  // ========================================================================
  // Step Handlers
  // ========================================================================

  /**
   * Handle phone submission
   */
  const submitPhone = useCallback(
    async (phone: string) => {
      dispatch({ type: "SET_LOADING", isLoading: true });

      try {
        const result = await checkPhoneMutation.mutateAsync({
          phone,
          unitId,
        });

        dispatch({ type: "UPDATE_FORM", data: { phone } });

        if (result.exists) {
          // Existing client - go directly to service selection
          dispatch({
            type: "UPDATE_FORM",
            data: {
              isNewClient: false,
              clientName: result.clientName || "",
            },
          });
          dispatch({ type: "SET_STEP", step: "SERVICE_SELECTION" });
        } else {
          // New client - send OTP and go to verification
          dispatch({ type: "UPDATE_FORM", data: { isNewClient: true } });
          await sendOTPMutation.mutateAsync({ phone });
          dispatch({ type: "SET_STEP", step: "OTP_VERIFICATION" });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error:
            error instanceof Error
              ? error.message
              : "Erro ao verificar telefone",
        });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    },
    [unitId, checkPhoneMutation, sendOTPMutation]
  );

  /**
   * Handle OTP verification
   */
  const verifyOTP = useCallback(
    async (code: string) => {
      dispatch({ type: "SET_LOADING", isLoading: true });

      try {
        const result = await verifyOTPMutation.mutateAsync({
          phone: state.formData.phone,
          code,
        });

        if (result.success) {
          if (result.clientId) {
            dispatch({ type: "SET_CLIENT_ID", clientId: result.clientId });
          }
          dispatch({ type: "SET_STEP", step: "REGISTRATION" });
        } else {
          dispatch({ type: "SET_ERROR", error: "Código inválido" });
        }
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error:
            error instanceof Error ? error.message : "Erro ao verificar código",
        });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    },
    [state.formData.phone, verifyOTPMutation]
  );

  /**
   * Resend OTP
   */
  const resendOTP = useCallback(async () => {
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      await resendOTPMutation.mutateAsync(state.formData.phone);
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        error:
          error instanceof Error ? error.message : "Erro ao reenviar código",
      });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, [state.formData.phone, resendOTPMutation]);

  /**
   * Handle client registration
   */
  const registerClient = useCallback(
    async (name: string, email: string) => {
      dispatch({ type: "SET_LOADING", isLoading: true });

      try {
        const result = await registerClientMutation.mutateAsync({
          phone: state.formData.phone,
          name,
          email: email || undefined,
          unitId,
        });

        dispatch({ type: "SET_CLIENT_ID", clientId: result.clientId });
        dispatch({
          type: "UPDATE_FORM",
          data: { clientName: name, clientEmail: email },
        });
        dispatch({ type: "SET_STEP", step: "SERVICE_SELECTION" });
      } catch (error) {
        dispatch({
          type: "SET_ERROR",
          error:
            error instanceof Error
              ? error.message
              : "Erro ao registrar cliente",
        });
      } finally {
        dispatch({ type: "SET_LOADING", isLoading: false });
      }
    },
    [unitId, state.formData.phone, registerClientMutation]
  );

  /**
   * Handle service selection
   */
  const selectServices = useCallback((services: Service[]) => {
    dispatch({ type: "UPDATE_FORM", data: { selectedServices: services } });
  }, []);

  const confirmServiceSelection = useCallback(() => {
    if (state.formData.selectedServices.length > 0) {
      dispatch({ type: "SET_STEP", step: "TIME_SELECTION" });
    }
  }, [state.formData.selectedServices.length]);

  /**
   * Handle date selection
   */
  const selectDate = useCallback((date: Date) => {
    dispatch({
      type: "UPDATE_FORM",
      data: { selectedDate: date, selectedTime: null },
    });
  }, []);

  /**
   * Handle time selection
   */
  const selectTime = useCallback((timeSlot: TimeSlot) => {
    dispatch({ type: "UPDATE_FORM", data: { selectedTime: timeSlot } });
  }, []);

  const confirmTimeSelection = useCallback(() => {
    if (state.formData.selectedTime) {
      dispatch({ type: "SET_STEP", step: "CONFIRMATION" });
    }
  }, [state.formData.selectedTime]);

  /**
   * Handle booking confirmation
   */
  const confirmBooking = useCallback(async () => {
    dispatch({ type: "SET_LOADING", isLoading: true });

    try {
      const { formData } = state;

      const booking = await createBookingMutation.mutateAsync({
        unitId,
        clientPhone: formData.phone,
        clientName: formData.clientName,
        clientEmail: formData.clientEmail || undefined,
        serviceIds: formData.selectedServices.map((s) => s.id),
        date: formData.selectedDate.toISOString().split("T")[0],
        time: formData.selectedTime!.time,
      });

      dispatch({ type: "SET_BOOKING_RESULT", booking });
      dispatch({ type: "SET_STEP", step: "SUCCESS" });
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "Erro ao confirmar agendamento",
      });
    } finally {
      dispatch({ type: "SET_LOADING", isLoading: false });
    }
  }, [unitId, state, createBookingMutation]);

  // ========================================================================
  // Progress Calculation
  // ========================================================================

  const progress = useMemo(() => {
    const steps: BookingStep[] = state.formData.isNewClient
      ? [
          "PHONE_INPUT",
          "OTP_VERIFICATION",
          "REGISTRATION",
          "SERVICE_SELECTION",
          "TIME_SELECTION",
          "CONFIRMATION",
          "SUCCESS",
        ]
      : [
          "PHONE_INPUT",
          "SERVICE_SELECTION",
          "TIME_SELECTION",
          "CONFIRMATION",
          "SUCCESS",
        ];

    const currentIndex = steps.indexOf(state.currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  }, [state.currentStep, state.formData.isNewClient]);

  // ========================================================================
  // Computed Values
  // ========================================================================

  const totalPrice = useMemo(
    () => state.formData.selectedServices.reduce((acc, s) => acc + s.price, 0),
    [state.formData.selectedServices]
  );

  const totalDuration = useMemo(
    () =>
      state.formData.selectedServices.reduce((acc, s) => acc + s.duration, 0),
    [state.formData.selectedServices]
  );

  const isAnyMutationLoading =
    checkPhoneMutation.isPending ||
    sendOTPMutation.isPending ||
    resendOTPMutation.isPending ||
    verifyOTPMutation.isPending ||
    registerClientMutation.isPending ||
    createBookingMutation.isPending;

  // ========================================================================
  // Return
  // ========================================================================

  return {
    // State
    currentStep: state.currentStep,
    formData: state.formData,
    clientId: state.clientId,
    bookingResult: state.bookingResult,
    error: state.error,
    isLoading: state.isLoading || isAnyMutationLoading,
    progress,
    totalPrice,
    totalDuration,
    unitInfo,

    // Navigation
    goToStep,
    goBack,
    reset,

    // Step Handlers
    submitPhone,
    verifyOTP,
    resendOTP,
    registerClient,
    selectServices,
    confirmServiceSelection,
    selectDate,
    selectTime,
    confirmTimeSelection,
    confirmBooking,
  };
}

export type BookingFlowReturn = ReturnType<typeof useBookingFlow>;
