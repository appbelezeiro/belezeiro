import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingStepBasicInfo } from "@/components/onboarding/OnboardingStepBasicInfo";
import { OnboardingStepAddress } from "@/components/onboarding/OnboardingStepAddress";
import { OnboardingStepSpecialties } from "@/components/onboarding/OnboardingStepSpecialties";
import { OnboardingStepServiceType } from "@/components/onboarding/OnboardingStepServiceType";
import { OnboardingStepAmenities } from "@/components/onboarding/OnboardingStepAmenities";
import { OnboardingStepWorkingHours } from "@/components/onboarding/OnboardingStepWorkingHours";
import { OnboardingStepPersonalization } from "@/components/onboarding/OnboardingStepPersonalization";
import { OnboardingFinalizing } from "@/components/onboarding/OnboardingFinalizing";
import { useCurrentUser } from "@/features/auth";
import { useSubmitOnboarding, type OnboardingSubmitData, type AmenityId } from "@/features/onboarding";
import { useOnboardingPersistence } from "@/shared/hooks";
import type { AvailabilityRuleInput, AvailabilityExceptionInput } from "@/features/units/types/unit-availability.types";

export interface OnboardingFormData {
  // Business
  businessName: string;

  // Unit Basic Info
  unitName: string;
  logo: File | null;
  gallery: File[];
  whatsapp: string;
  phone: string;
  
  // Address
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  
  // Specialties & Services
  especialidades: { id: string; name: string; icon: string }[];
  services: { id: string; name: string; especialidadeId: string }[];
  
  // Service Type
  serviceType: "local" | "home" | "both" | null;
  
  // Amenities
  amenities: string[];

  // Availability Rules (instead of working hours)
  availability_rules: AvailabilityRuleInput[];
  availability_exceptions: AvailabilityExceptionInput[];

  // Personalization
  brandColor: string;
}

const initialFormData: OnboardingFormData = {
  businessName: "",
  unitName: "",
  logo: null,
  gallery: [],
  whatsapp: "",
  phone: "",
  cep: "",
  street: "",
  neighborhood: "",
  city: "",
  state: "",
  number: "",
  complement: "",
  especialidades: [],
  services: [],
  serviceType: null,
  amenities: [],
  availability_rules: [
    // Default: Monday to Friday 9AM-6PM
    { type: 'weekly' as const, weekday: 1, start_time: '09:00', end_time: '18:00', slot_duration_minutes: 30, is_active: true },
    { type: 'weekly' as const, weekday: 2, start_time: '09:00', end_time: '18:00', slot_duration_minutes: 30, is_active: true },
    { type: 'weekly' as const, weekday: 3, start_time: '09:00', end_time: '18:00', slot_duration_minutes: 30, is_active: true },
    { type: 'weekly' as const, weekday: 4, start_time: '09:00', end_time: '18:00', slot_duration_minutes: 30, is_active: true },
    { type: 'weekly' as const, weekday: 5, start_time: '09:00', end_time: '18:00', slot_duration_minutes: 30, is_active: true },
    { type: 'weekly' as const, weekday: 6, start_time: '09:00', end_time: '13:00', slot_duration_minutes: 30, is_active: true },
  ],
  availability_exceptions: [],
  brandColor: "#3b82f6",
};

const TOTAL_STEPS = 7;

const Onboarding = () => {
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isRestored, setIsRestored] = useState(false);
  const isFirstRender = useRef(true);

  // Finalizing state
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [finalizingStep, setFinalizingStep] = useState(0);
  const [isFinalizingComplete, setIsFinalizingComplete] = useState(false);

  // Initialize persistence hook
  const {
    saveFormData,
    saveStep,
    clear: clearPersistence,
    hasSavedData,
    metadata,
    initialData,
    isLoaded,
  } = useOnboardingPersistence({
    userId: user?.id,
  });

  // Restore persisted data on initial load
  useEffect(() => {
    if (isLoaded && initialData && !isRestored) {
      setFormData(initialData.formData);
      setCurrentStep(initialData.currentStep);
      setIsRestored(true);
    } else if (isLoaded && !initialData) {
      setIsRestored(true);
    }
  }, [isLoaded, initialData, isRestored]);

  // Auto-save form data when it changes (skip first render and until restored)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!isRestored) return;

    saveFormData(formData);
  }, [formData, saveFormData, isRestored]);

  // Auto-save step when it changes (skip until restored)
  useEffect(() => {
    if (!isRestored) return;
    saveStep(currentStep);
  }, [currentStep, saveStep, isRestored]);

  const submitOnboarding = useSubmitOnboarding({
    onSuccess: () => {
      // Clear persisted data on successful completion
      clearPersistence();

      // Mark as complete
      setIsFinalizingComplete(true);

      // Wait 2.5s to show success message, then redirect
      setTimeout(() => {
        navigate("/dashboard");
      }, 2500);
    },
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Transform form data to API format
  const transformFormDataToSubmit = (): OnboardingSubmitData => {
    return {
      businessName: formData.businessName,
      brandColor: formData.brandColor,
      unitName: formData.unitName,
      // Don't send logo/gallery URLs - we'll upload files after unit creation
      gallery: [], // Empty array - images will be uploaded separately
      whatsapp: formData.whatsapp.replace(/\D/g, ''), // Remove non-digits
      phone: formData.phone ? formData.phone.replace(/\D/g, '') : undefined,
      address: {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement || undefined,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
      especialidades: formData.especialidades,
      services: formData.services,
      serviceType: formData.serviceType as 'local' | 'home' | 'both',
      amenities: formData.amenities as AmenityId[],
      // Pass availability rules directly - no conversion needed
      availability_rules: formData.availability_rules,
      availability_exceptions: formData.availability_exceptions,
    };
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    // Show finalizing screen
    setIsFinalizing(true);

    const submitData = transformFormDataToSubmit();

    // Files are already in the correct format - no conversion needed
    submitOnboarding.mutate({
      data: submitData,
      userId: user.id,
      logoFile: formData.logo,
      galleryFiles: formData.gallery,
      onProgress: (step) => {
        setFinalizingStep(step);
      },
    });
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Submit onboarding data
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const stepTitles = [
    "Informações básicas",
    "Endereço",
    "Especialidades",
    "Atendimento",
    "Comodidades",
    "Horários",
    "Personalização",
  ];

  // Show loading state while restoring data
  if (!isLoaded || !isRestored) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // Show finalizing screen
  if (isFinalizing) {
    return (
      <OnboardingFinalizing
        currentStep={finalizingStep}
        isComplete={isFinalizingComplete}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="content-container py-4">
          <div className="flex items-center gap-4">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStep}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold text-foreground">
                  Configuração inicial
                </h1>
                {hasSavedData && metadata && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Salvo automaticamente</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Etapa {currentStep} de {TOTAL_STEPS} — {stepTitles[currentStep - 1]}
              </p>
            </div>
          </div>
        </div>
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Content */}
      <main className="content-container py-8">
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <OnboardingStepBasicInfo
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <OnboardingStepAddress
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <OnboardingStepSpecialties
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <OnboardingStepServiceType
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <OnboardingStepAmenities
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 6 && (
            <OnboardingStepWorkingHours
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 7 && (
            <OnboardingStepPersonalization
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
              isSubmitting={submitOnboarding.isPending}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
