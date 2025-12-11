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
import { useCurrentUser } from "@/features/auth";
import { useSubmitOnboarding, type OnboardingSubmitData, type AmenityId } from "@/features/onboarding";
import { useOnboardingPersistence } from "@/shared/hooks";
import type { AvailabilityRuleInput, AvailabilityExceptionInput } from "@/features/units/types/unit-availability.types";

// ============================================================================
// Inline Helpers - Base64 to File Conversion
// ============================================================================

/**
 * Convert base64 string to File object
 */
function base64ToFile(base64: string, filename: string): File {
  const arr = base64.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

/**
 * Convert array of base64 strings to File objects
 */
function base64ArrayToFiles(base64Array: string[], baseFilename: string): File[] {
  return base64Array.map((base64, index) => {
    const extension = base64.startsWith('data:image/png') ? 'png' : 'jpg';
    return base64ToFile(base64, `${baseFilename}_${index}.${extension}`);
  });
}

// ============================================================================
// Inline Helpers - Working Hours to Availability Rules Conversion
// ============================================================================

/**
 * Map day names to weekday numbers (0 = Sunday, 1 = Monday, etc.)
 */
const DAY_TO_WEEKDAY: Record<string, number> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

/**
 * Convert workingHours format to availability_rules format
 */
function convertWorkingHoursToAvailabilityRules(
  workingHours: Record<string, { open: string; close: string; enabled: boolean }>,
  lunchBreak?: { enabled: boolean; start: string; end: string },
  slotDurationMinutes: number = 30
): {
  availability_rules: AvailabilityRuleInput[];
  availability_exceptions: AvailabilityExceptionInput[];
} {
  const availability_rules: AvailabilityRuleInput[] = [];

  // Convert each enabled day to a weekly availability rule
  Object.entries(workingHours).forEach(([day, schedule]) => {
    if (schedule.enabled) {
      availability_rules.push({
        type: 'weekly',
        weekday: DAY_TO_WEEKDAY[day],
        start_time: schedule.open,
        end_time: schedule.close,
        slot_duration_minutes: slotDurationMinutes,
        is_active: true,
      });
    }
  });

  // For now, we don't convert lunch breaks to exceptions
  // This can be handled later if needed
  const availability_exceptions: AvailabilityExceptionInput[] = [];

  return { availability_rules, availability_exceptions };
}

export interface OnboardingFormData {
  // Business
  businessName: string;
  
  // Unit Basic Info
  unitName: string;
  logo: string | null;
  gallery: string[];
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
  professions: { id: string; name: string; icon: string }[];
  services: { name: string; professionId: string }[];
  
  // Service Type
  serviceType: "local" | "home" | "both" | null;
  
  // Amenities
  amenities: string[];
  
  // Working Hours
  workingHours: Record<string, { open: string; close: string; enabled: boolean }>;
  lunchBreak: { enabled: boolean; start: string; end: string };
  
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
  professions: [],
  services: [],
  serviceType: null,
  amenities: [],
  workingHours: {
    monday: { open: "09:00", close: "18:00", enabled: true },
    tuesday: { open: "09:00", close: "18:00", enabled: true },
    wednesday: { open: "09:00", close: "18:00", enabled: true },
    thursday: { open: "09:00", close: "18:00", enabled: true },
    friday: { open: "09:00", close: "18:00", enabled: true },
    saturday: { open: "09:00", close: "13:00", enabled: true },
    sunday: { open: "09:00", close: "18:00", enabled: false },
  },
  lunchBreak: { enabled: false, start: "12:00", end: "13:00" },
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
      // Redirect to dashboard
      navigate("/dashboard");
    },
  });

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  // Transform form data to API format
  const transformFormDataToSubmit = (): OnboardingSubmitData => {
    // Transform services to include ID (generate from name)
    const servicesWithId = formData.services.map((service) => ({
      id: `serv_${service.name.toLowerCase().replace(/\s+/g, '_')}`,
      name: service.name,
      professionId: service.professionId,
    }));

    // Convert working hours to availability rules (inline conversion)
    const { availability_rules, availability_exceptions } = convertWorkingHoursToAvailabilityRules(
      formData.workingHours,
      formData.lunchBreak.enabled ? formData.lunchBreak : undefined,
      30 // Default slot duration: 30 minutes
    );

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
      professions: formData.professions,
      services: servicesWithId,
      serviceType: formData.serviceType as 'local' | 'home' | 'both',
      amenities: formData.amenities as AmenityId[],
      // Use new availability rules system
      availability_rules,
      availability_exceptions,
    };
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    const submitData = transformFormDataToSubmit();

    // Prepare image files for upload (convert base64 to File objects)
    const logoFile = formData.logo ? base64ToFile(formData.logo, 'logo.png') : null;
    const galleryFiles = formData.gallery.length > 0
      ? base64ArrayToFiles(formData.gallery, 'gallery')
      : [];

    submitOnboarding.mutate({
      data: submitData,
      userId: user.id,
      logoFile,
      galleryFiles,
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
