import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StepBasicInfo } from "@/components/new-unit/StepBasicInfo";
import { StepSpecialties } from "@/components/new-unit/StepSpecialties";
import { StepServiceType } from "@/components/new-unit/StepServiceType";
import { StepAmenities } from "@/components/new-unit/StepAmenities";
import { StepWorkingHours } from "@/components/new-unit/StepWorkingHours";
import { StepSuccess } from "@/components/new-unit/StepSuccess";

export interface UnitFormData {
  name: string;
  logo: string | null;
  gallery: string[];
  whatsapp: string;
  phone: string;
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  number: string;
  complement: string;
  professions: { id: string; name: string; icon: string }[];
  services: { name: string; professionId: string }[];
  serviceType: "local" | "home" | "both" | null;
  amenities: string[];
  workingHours: Record<string, { open: string; close: string; enabled: boolean }>;
  lunchBreak: { enabled: boolean; start: string; end: string };
}

const initialFormData: UnitFormData = {
  name: "",
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
};

const TOTAL_STEPS = 5;

const NewUnit = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UnitFormData>(initialFormData);
  const [isComplete, setIsComplete] = useState(false);

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const updateFormData = (data: Partial<UnitFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    } else {
      setIsComplete(true);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  if (isComplete) {
    return <StepSuccess unitName={formData.name} onComplete={handleComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="content-container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-foreground">
                Nova Unidade
              </h1>
              <p className="text-sm text-muted-foreground">
                Etapa {currentStep} de {TOTAL_STEPS}
              </p>
            </div>
          </div>
        </div>
        {/* Progress Bar */}
        <Progress value={progress} className="h-1 rounded-none" />
      </header>

      {/* Content */}
      <main className="content-container py-8">
        <div className="max-w-2xl mx-auto">
          {currentStep === 1 && (
            <StepBasicInfo
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
            />
          )}
          {currentStep === 2 && (
            <StepSpecialties
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 3 && (
            <StepServiceType
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 4 && (
            <StepAmenities
              data={formData}
              onUpdate={updateFormData}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}
          {currentStep === 5 && (
            <StepWorkingHours
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

export default NewUnit;
