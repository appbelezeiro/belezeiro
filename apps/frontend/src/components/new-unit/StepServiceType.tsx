import { Building2, Home, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UnitFormData } from "@/pages/NewUnit";
import { cn } from "@/lib/utils";

interface StepServiceTypeProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const serviceTypes = [
  {
    id: "local" as const,
    title: "Local próprio",
    description: "Atendo em meu estabelecimento",
    icon: Building2,
  },
  {
    id: "home" as const,
    title: "Na casa do cliente",
    description: "Vou até o endereço do cliente",
    icon: Home,
  },
  {
    id: "both" as const,
    title: "Ambos",
    description: "Atendo em ambos os locais",
    icon: Repeat,
  },
];

export const StepServiceType = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepServiceTypeProps) => {
  const handleSelect = (type: "local" | "home" | "both") => {
    onUpdate({ serviceType: type });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Tipo de Atendimento
        </h2>
        <p className="text-muted-foreground">
          Como esta unidade atende os clientes?
        </p>
      </div>

      {/* Options */}
      <div className="space-y-4">
        {serviceTypes.map((type) => {
          const isSelected = data.serviceType === type.id;
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              onClick={() => handleSelect(type.id)}
              className={cn(
                "w-full flex items-center gap-4 p-6 rounded-2xl border-2 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/30 hover:bg-secondary/30"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors",
                  isSelected ? "bg-primary" : "bg-secondary"
                )}
              >
                <Icon
                  className={cn(
                    "h-7 w-7",
                    isSelected ? "text-primary-foreground" : "text-muted-foreground"
                  )}
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">
                  {type.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {type.description}
                </p>
              </div>
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                  isSelected ? "border-primary bg-primary" : "border-border"
                )}
              >
                {isSelected && (
                  <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                )}
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
          disabled={!data.serviceType}
          className="flex-1 h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
