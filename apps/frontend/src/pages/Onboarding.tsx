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
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (data: Partial<OnboardingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Save data and go to plans
      navigate("/onboarding/plans");
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
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default Onboarding;
