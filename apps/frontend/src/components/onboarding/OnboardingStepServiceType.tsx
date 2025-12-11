import { Building2, Home, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";

interface OnboardingStepServiceTypeProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const serviceTypes = [
  {
    value: "local" as const,
    icon: Building2,
    title: "Local próprio",
    description: "Atendo em meu estabelecimento",
  },
  {
    value: "home" as const,
    icon: Home,
    title: "Na casa do cliente",
    description: "Atendo a domicílio",
  },
  {
    value: "both" as const,
    icon: Users,
    title: "Ambos",
    description: "Atendo no local e a domicílio",
  },
];

export const OnboardingStepServiceType = ({ data, onUpdate, onNext, onBack }: OnboardingStepServiceTypeProps) => {
  const isValid = data.serviceType !== null;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Home className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Como você atende?
        </h2>
        <p className="text-muted-foreground">
          Selecione o tipo de atendimento da sua unidade
        </p>
      </div>

      {/* Options */}
      <div className="grid gap-4">
        {serviceTypes.map((type) => {
          const isSelected = data.serviceType === type.value;
          return (
            <button
              key={type.value}
              onClick={() => onUpdate({ serviceType: type.value })}
              className={cn(
                "flex items-center gap-4 p-5 rounded-xl border-2 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-xl",
                  isSelected ? "bg-primary/20" : "bg-secondary"
                )}
              >
                <type.icon
                  className={cn(
                    "h-6 w-6",
                    isSelected ? "text-primary" : "text-muted-foreground"
                  )}
                />
              </div>
              <div>
                <h3
                  className={cn(
                    "font-semibold",
                    isSelected ? "text-foreground" : "text-foreground"
                  )}
                >
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground">{type.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
