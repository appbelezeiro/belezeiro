// ============================================================================
// PUBLIC BOOKING PAGE - Container Component for Booking Flow
// ============================================================================

import { useParams } from "react-router-dom";
import { PublicHeader } from "@/components/public/PublicHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

import { useUnitInfo } from "../hooks/queries/useUnitInfo";
import { useServices } from "../hooks/queries/useServices";
import { useAvailability } from "../hooks/queries/useAvailability";
import { useBookingFlow } from "../hooks/useBookingFlow";

import {
  PhoneInputStep,
  OTPVerificationStep,
  RegistrationStep,
  ServiceSelectionStep,
  TimeSelectionStep,
  ConfirmationStep,
  SuccessStep,
  BookingProgress,
  BookingSummary,
} from "../ui";

/**
 * Public Booking Page
 * Main container for the public booking flow
 */
export function PublicBookingPage() {
  // Get unit slug from URL params
  const { slug } = useParams<{ slug: string }>();

  // Fetch unit info
  const {
    data: unitInfo,
    isLoading: isLoadingUnit,
    error: unitError,
  } = useUnitInfo({ slug });

  // Fetch services when unit is loaded
  const { data: services = [], isLoading: isLoadingServices } = useServices({
    unitId: unitInfo?.id ?? "",
    enabled: !!unitInfo?.id,
  });

  // Booking flow state
  const bookingFlow = useBookingFlow({
    unitId: unitInfo?.id ?? "",
    unitInfo,
  });

  // Fetch availability when services are selected
  const { data: availability, isLoading: isLoadingAvailability } =
    useAvailability({
      unitId: unitInfo?.id ?? "",
      date: bookingFlow.formData.selectedDate,
      serviceIds: bookingFlow.formData.selectedServices.map((s) => s.id),
      enabled:
        !!unitInfo?.id &&
        bookingFlow.formData.selectedServices.length > 0 &&
        (bookingFlow.currentStep === "TIME_SELECTION" ||
          bookingFlow.currentStep === "CONFIRMATION"),
    });

  // Loading state
  if (isLoadingUnit) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 border-b">
          <Skeleton className="h-full" />
        </div>
        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex gap-12">
            <div className="flex-1 max-w-md space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-[400px] w-full rounded-lg" />
            </div>
            <div className="hidden lg:block w-72 space-y-4">
              <Skeleton className="h-48 w-full rounded-lg" />
              <Skeleton className="h-32 w-full rounded-lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (unitError || !unitInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
          <h1 className="text-2xl font-bold">Estabelecimento não encontrado</h1>
          <p className="text-muted-foreground">
            O link que você acessou pode estar incorreto ou o estabelecimento
            não está mais disponível.
          </p>
        </div>
      </div>
    );
  }

  // Booking disabled state
  if (!unitInfo.isBookingEnabled) {
    return (
      <div className="min-h-screen bg-background">
        <PublicHeader
          businessName={unitInfo.businessName}
          logo={unitInfo.logo ?? null}
          primaryColor={unitInfo.primaryColor}
          isBookingEnabled={false}
          onNavigate={() => {}}
          activeSection="booking"
        />
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Agendamento indisponível</h1>
          <p className="text-muted-foreground">
            O agendamento online está temporariamente indisponível para este
            estabelecimento.
          </p>
        </main>
      </div>
    );
  }

  // Render current step
  const renderStep = () => {
    switch (bookingFlow.currentStep) {
      case "PHONE_INPUT":
        return (
          <PhoneInputStep
            onSubmit={bookingFlow.submitPhone}
            isLoading={bookingFlow.isLoading}
            error={bookingFlow.error}
          />
        );

      case "OTP_VERIFICATION":
        return (
          <OTPVerificationStep
            phone={bookingFlow.formData.phone}
            onVerify={bookingFlow.verifyOTP}
            onResend={bookingFlow.resendOTP}
            onBack={bookingFlow.goBack}
            isLoading={bookingFlow.isLoading}
            error={bookingFlow.error}
          />
        );

      case "REGISTRATION":
        return (
          <RegistrationStep
            phone={bookingFlow.formData.phone}
            onSubmit={bookingFlow.registerClient}
            onBack={bookingFlow.goBack}
            isLoading={bookingFlow.isLoading}
            error={bookingFlow.error}
          />
        );

      case "SERVICE_SELECTION":
        return (
          <ServiceSelectionStep
            services={services}
            selectedServices={bookingFlow.formData.selectedServices}
            onSelectServices={bookingFlow.selectServices}
            onContinue={bookingFlow.confirmServiceSelection}
            onBack={bookingFlow.goBack}
            isLoading={isLoadingServices}
          />
        );

      case "TIME_SELECTION":
        return (
          <TimeSelectionStep
            selectedDate={bookingFlow.formData.selectedDate}
            selectedTime={bookingFlow.formData.selectedTime}
            totalDuration={bookingFlow.totalDuration}
            availability={availability}
            isLoadingAvailability={isLoadingAvailability}
            onSelectDate={bookingFlow.selectDate}
            onSelectTime={bookingFlow.selectTime}
            onContinue={bookingFlow.confirmTimeSelection}
            onBack={bookingFlow.goBack}
          />
        );

      case "CONFIRMATION":
        return (
          <ConfirmationStep
            formData={bookingFlow.formData}
            onConfirm={bookingFlow.confirmBooking}
            onBack={bookingFlow.goBack}
            isLoading={bookingFlow.isLoading}
            error={bookingFlow.error}
          />
        );

      case "SUCCESS":
        return (
          <SuccessStep
            booking={bookingFlow.bookingResult}
            formData={bookingFlow.formData}
            unitInfo={unitInfo}
            onNewBooking={bookingFlow.reset}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader
        businessName={unitInfo.businessName}
        logo={unitInfo.logo ?? null}
        primaryColor={unitInfo.primaryColor}
        isBookingEnabled={false}
        onNavigate={() => {}}
        activeSection="booking"
      />

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-12">
          {/* Left side - Form */}
          <div className="flex-1 max-w-md">
            {bookingFlow.currentStep !== "SUCCESS" && (
              <BookingProgress
                progress={bookingFlow.progress}
                currentStep={bookingFlow.currentStep}
              />
            )}

            <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              {renderStep()}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px bg-border" />

          {/* Right side - Summary */}
          <div className="hidden lg:block w-72">
            <BookingSummary
              unitInfo={unitInfo}
              formData={bookingFlow.formData}
              currentStep={bookingFlow.currentStep}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default PublicBookingPage;
