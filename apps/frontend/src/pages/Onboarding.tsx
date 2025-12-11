import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { OnboardingStepBasicInfo } from "@/components/onboarding/OnboardingStepBasicInfo";
import { OnboardingStepAddress } from "@/components/onboarding/OnboardingStepAddress";
import { OnboardingStepSpecialties } from "@/components/onboarding/OnboardingStepSpecialties";
import { OnboardingStepServiceType } from "@/components/onboarding/OnboardingStepServiceType";
import { OnboardingStepAmenities } from "@/components/onboarding/OnboardingStepAmenities";
import { OnboardingStepWorkingHours } from "@/components/onboarding/OnboardingStepWorkingHours";
import { OnboardingStepPersonalization } from "@/components/onboarding/OnboardingStepPersonalization";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmitOnboarding, type OnboardingSubmitData, type AmenityId, type WorkingHours } from "@/features/onboarding";

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
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  const submitOnboarding = useSubmitOnboarding({
    onSuccess: () => {
      navigate("/onboarding/plans");
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

    // Transform working hours to the correct format
    const workingHours: WorkingHours = {
      monday: formData.workingHours.monday,
      tuesday: formData.workingHours.tuesday,
      wednesday: formData.workingHours.wednesday,
      thursday: formData.workingHours.thursday,
      friday: formData.workingHours.friday,
      saturday: formData.workingHours.saturday,
      sunday: formData.workingHours.sunday,
    };

    return {
      businessName: formData.businessName,
      brandColor: formData.brandColor,
      unitName: formData.unitName,
      logo: formData.logo || undefined,
      gallery: formData.gallery,
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
      workingHours,
      lunchBreak: formData.lunchBreak.enabled ? formData.lunchBreak : undefined,
    };
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    const submitData = transformFormDataToSubmit();
    submitOnboarding.mutate({ data: submitData, userId: user.id });
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
              <h1 className="text-lg font-semibold text-foreground">
                Configuração inicial
              </h1>
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
