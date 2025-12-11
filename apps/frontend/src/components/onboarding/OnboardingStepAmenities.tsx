import {
  Wifi,
  Car,
  Coffee,
  Wind,
  Droplets,
  Sofa,
  Accessibility,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";

interface OnboardingStepAmenitiesProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const amenitiesList = [
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "parking", label: "Estacionamento", icon: Car },
  { id: "coffee", label: "Café / Água", icon: Coffee },
  { id: "ac", label: "Ar-condicionado", icon: Wind },
  { id: "snacks", label: "Snacks", icon: Droplets },
  { id: "waiting-room", label: "Sala de espera", icon: Sofa },
  { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
];

export const OnboardingStepAmenities = ({ data, onUpdate, onNext, onBack }: OnboardingStepAmenitiesProps) => {
  const toggleAmenity = (id: string) => {
    const isSelected = data.amenities.includes(id);
    onUpdate({
      amenities: isSelected
        ? data.amenities.filter((a) => a !== id)
        : [...data.amenities, id],
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Comodidades
        </h2>
        <p className="text-muted-foreground">
          Selecione as comodidades oferecidas na sua unidade
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenitiesList.map((amenity) => {
          const isSelected = data.amenities.includes(amenity.id);
          return (
            <div
              key={amenity.id}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all",
                isSelected
                  ? "border-primary/30 bg-primary/5"
                  : "border-border"
              )}
            >
              <amenity.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="flex-1 text-sm font-medium">{amenity.label}</span>
              <Switch
                checked={isSelected}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
            </div>
          );
        })}
      </div>

      {/* Selected Count */}
      <p className="text-sm text-muted-foreground text-center">
        {data.amenities.length} comodidade(s) selecionada(s)
      </p>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 text-base">
          Continuar
        </Button>
      </div>
    </div>
  );
};
