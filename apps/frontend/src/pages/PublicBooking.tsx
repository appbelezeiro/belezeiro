import { useState, useCallback } from "react";
import { BookingPhoneInput } from "@/components/booking/BookingPhoneInput";
import { BookingOTPVerification } from "@/components/booking/BookingOTPVerification";
import { BookingRegistration } from "@/components/booking/BookingRegistration";
import { BookingServiceSelection } from "@/components/booking/BookingServiceSelection";
import { BookingTimeSelection } from "@/components/booking/BookingTimeSelection";
import { BookingConfirmation } from "@/components/booking/BookingConfirmation";
import { BookingSuccess } from "@/components/booking/BookingSuccess";
import { BookingProgress } from "@/components/booking/BookingProgress";
import { BookingSummary } from "@/components/booking/BookingSummary";
import { PublicHeader } from "@/components/public/PublicHeader";

// State Machine States
export type BookingStep = 
  | "PHONE_INPUT"
  | "OTP_VERIFICATION"
  | "REGISTRATION"
  | "SERVICE_SELECTION"
  | "TIME_SELECTION"
  | "CONFIRMATION"
  | "SUCCESS";

// Types
export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
  category: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface BookingData {
  phone: string;
  isNewClient: boolean;
  clientName: string;
  clientEmail: string;
  selectedServices: Service[];
  selectedDate: Date;
  selectedTime: TimeSlot | null;
}

// Mock services data
const mockServices: Service[] = [
  { id: "1", name: "Limpeza de Pele", duration: 60, price: 150, category: "Estética Facial" },
  { id: "2", name: "Peeling Químico", duration: 45, price: 200, category: "Estética Facial" },
  { id: "3", name: "Massagem Relaxante", duration: 60, price: 120, category: "Massoterapia" },
  { id: "4", name: "Drenagem Linfática", duration: 50, price: 140, category: "Massoterapia" },
  { id: "5", name: "Design de Sobrancelha", duration: 30, price: 45, category: "Sobrancelhas" },
  { id: "6", name: "Micropigmentação", duration: 120, price: 350, category: "Sobrancelhas" },
];

// Mock unit data
const mockUnitData = {
  businessName: "Salão do Zezé",
  unitName: "Unidade Centro",
  address: "Av. Paulista, 1000 - Bela Vista, São Paulo",
  logo: null,
  primaryColor: "hsl(195, 70%, 45%)",
  isBookingEnabled: true,
  images: [
    "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
    "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
    "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80",
  ],
};

const PublicBooking = () => {
  const [currentStep, setCurrentStep] = useState<BookingStep>("PHONE_INPUT");
  const [bookingData, setBookingData] = useState<BookingData>({
    phone: "",
    isNewClient: false,
    clientName: "",
    clientEmail: "",
    selectedServices: [],
    selectedDate: new Date(),
    selectedTime: null,
  });

  const updateBookingData = useCallback((data: Partial<BookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }));
  }, []);

  const goToStep = useCallback((step: BookingStep) => {
    setCurrentStep(step);
  }, []);

  const resetBooking = useCallback(() => {
    setCurrentStep("PHONE_INPUT");
    setBookingData({
      phone: "",
      isNewClient: false,
      clientName: "",
      clientEmail: "",
      selectedServices: [],
      selectedDate: new Date(),
      selectedTime: null,
    });
  }, []);

  // Calculate progress based on current step
  const getProgress = () => {
    const steps: BookingStep[] = bookingData.isNewClient
      ? ["PHONE_INPUT", "OTP_VERIFICATION", "REGISTRATION", "SERVICE_SELECTION", "TIME_SELECTION", "CONFIRMATION", "SUCCESS"]
      : ["PHONE_INPUT", "SERVICE_SELECTION", "TIME_SELECTION", "CONFIRMATION", "SUCCESS"];
    
    const currentIndex = steps.indexOf(currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  const renderStep = () => {
    switch (currentStep) {
      case "PHONE_INPUT":
        return (
          <BookingPhoneInput
            onSubmit={(phone, isNewClient) => {
              updateBookingData({ phone, isNewClient });
              goToStep(isNewClient ? "OTP_VERIFICATION" : "SERVICE_SELECTION");
            }}
          />
        );
      
      case "OTP_VERIFICATION":
        return (
          <BookingOTPVerification
            phone={bookingData.phone}
            onVerified={() => goToStep("REGISTRATION")}
            onBack={() => goToStep("PHONE_INPUT")}
          />
        );
      
      case "REGISTRATION":
        return (
          <BookingRegistration
            onSubmit={(name, email) => {
              updateBookingData({ clientName: name, clientEmail: email });
              goToStep("SERVICE_SELECTION");
            }}
            onBack={() => goToStep("OTP_VERIFICATION")}
          />
        );
      
      case "SERVICE_SELECTION":
        return (
          <BookingServiceSelection
            services={mockServices}
            selectedServices={bookingData.selectedServices}
            onSelectServices={(services) => updateBookingData({ selectedServices: services })}
            onContinue={() => goToStep("TIME_SELECTION")}
            onBack={() => goToStep(bookingData.isNewClient ? "REGISTRATION" : "PHONE_INPUT")}
          />
        );
      
      case "TIME_SELECTION":
        return (
          <BookingTimeSelection
            selectedDate={bookingData.selectedDate}
            selectedTime={bookingData.selectedTime}
            totalDuration={bookingData.selectedServices.reduce((acc, s) => acc + s.duration, 0)}
            onSelectDate={(date) => updateBookingData({ selectedDate: date })}
            onSelectTime={(time) => updateBookingData({ selectedTime: time })}
            onContinue={() => goToStep("CONFIRMATION")}
            onBack={() => goToStep("SERVICE_SELECTION")}
          />
        );
      
      case "CONFIRMATION":
        return (
          <BookingConfirmation
            bookingData={bookingData}
            onConfirm={() => goToStep("SUCCESS")}
            onBack={() => goToStep("TIME_SELECTION")}
          />
        );
      
      case "SUCCESS":
        return (
          <BookingSuccess
            bookingData={bookingData}
            onReset={resetBooking}
          />
        );
      
      default:
        return null;
    }
  };

  const fullUnitName = `${mockUnitData.businessName} - ${mockUnitData.unitName}`;

  return (
    <div className="min-h-screen bg-background">
      <PublicHeader
        businessName={mockUnitData.businessName}
        logo={mockUnitData.logo}
        primaryColor={mockUnitData.primaryColor}
        isBookingEnabled={false}
        onNavigate={() => {}}
        activeSection="booking"
      />
      
      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex gap-12">
          {/* Left side - Form */}
          <div className="flex-1 max-w-md">
            {currentStep !== "SUCCESS" && (
              <BookingProgress progress={getProgress()} currentStep={currentStep} />
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
              unitName={fullUnitName}
              unitAddress={mockUnitData.address}
              unitImages={mockUnitData.images}
              bookingData={bookingData}
              currentStep={currentStep}
              primaryColor={mockUnitData.primaryColor}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicBooking;
