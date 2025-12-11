import {
  Wifi,
  Car,
  Cookie,
  Wind,
  Coffee,
  Armchair,
  Accessibility,
  Tv,
  Music,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { UnitFormData } from "@/pages/NewUnit";
import { cn } from "@/lib/utils";

interface StepAmenitiesProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const amenitiesList = [
  { id: "wifi", label: "Internet Wi-Fi", icon: Wifi },
  { id: "parking", label: "Estacionamento", icon: Car },
  { id: "snacks", label: "Snacks", icon: Cookie },
  { id: "ac", label: "Ar-condicionado", icon: Wind },
  { id: "drinks", label: "Água / Café", icon: Coffee },
  { id: "waiting", label: "Sala de espera", icon: Armchair },
  { id: "accessibility", label: "Acessibilidade", icon: Accessibility },
  { id: "tv", label: "TV", icon: Tv },
  { id: "music", label: "Música ambiente", icon: Music },
  { id: "spa", label: "Ambiente relaxante", icon: Sparkles },
];

export const StepAmenities = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepAmenitiesProps) => {
  const toggleAmenity = (amenityId: string) => {
    const isSelected = data.amenities.includes(amenityId);
    if (isSelected) {
      onUpdate({ amenities: data.amenities.filter((a) => a !== amenityId) });
    } else {
      onUpdate({ amenities: [...data.amenities, amenityId] });
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Comodidades
        </h2>
        <p className="text-muted-foreground">
          Quais comodidades esta unidade oferece aos clientes?
        </p>
      </div>

      {/* Amenities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {amenitiesList.map((amenity) => {
          const isSelected = data.amenities.includes(amenity.id);
          const Icon = amenity.icon;

          return (
            <div
              key={amenity.id}
              onClick={() => toggleAmenity(amenity.id)}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center transition-colors",
                    isSelected ? "bg-primary/10" : "bg-secondary"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-5 w-5",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                </div>
                <span
                  className={cn(
                    "font-medium transition-colors",
                    isSelected ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {amenity.label}
                </span>
              </div>
              <Switch
                checked={isSelected}
                onCheckedChange={() => toggleAmenity(amenity.id)}
              />
            </div>
          );
        })}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        {data.amenities.length === 0
          ? "Nenhuma comodidade selecionada"
          : `${data.amenities.length} comodidade${
              data.amenities.length !== 1 ? "s" : ""
            } selecionada${data.amenities.length !== 1 ? "s" : ""}`}
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
