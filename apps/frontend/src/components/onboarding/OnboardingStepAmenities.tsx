import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Sparkles, Search, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";
import { useAmenities } from "@/features/amenities";
import { CreateAmenityDialog } from "@/features/amenities/components/CreateAmenityDialog";

interface OnboardingStepAmenitiesProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

// Map icon string to Lucide component
const getIconComponent = (iconName: string) => {
  const iconMap: Record<string, any> = {
    wifi: LucideIcons.Wifi,
    car: LucideIcons.Car,
    coffee: LucideIcons.Coffee,
    wind: LucideIcons.Wind,
    cookie: LucideIcons.Cookie,
    sofa: LucideIcons.Sofa,
    accessibility: LucideIcons.Accessibility,
    sparkles: LucideIcons.Sparkles,
    music: LucideIcons.Music,
    monitor: LucideIcons.Monitor,
    phone: LucideIcons.Phone,
    baby: LucideIcons.Baby,
    gift: LucideIcons.Gift,
    "shield-check": LucideIcons.ShieldCheck,
  };

  return iconMap[iconName] || LucideIcons.Star;
};

export const OnboardingStepAmenities = ({ data, onUpdate, onNext, onBack }: OnboardingStepAmenitiesProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch amenities from API
  const { data: amenitiesData, isLoading, isError } = useAmenities({ limit: 100 });

  // Flatten all pages of amenities
  const allAmenities = useMemo(() => {
    if (!amenitiesData?.pages) return [];
    return amenitiesData.pages.flatMap(page => page.items);
  }, [amenitiesData]);

  // Filter amenities by search query
  const filteredAmenities = useMemo(() => {
    if (!searchQuery.trim()) return allAmenities;
    const query = searchQuery.toLowerCase();
    return allAmenities.filter(amenity =>
      amenity.name.toLowerCase().includes(query) ||
      amenity.description?.toLowerCase().includes(query)
    );
  }, [allAmenities, searchQuery]);

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

      {/* Search and Create */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar comodidades..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <CreateAmenityDialog />
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex items-center justify-center gap-2 py-12 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p>Erro ao carregar comodidades. Tente novamente.</p>
        </div>
      )}

      {/* Amenities Grid */}
      {!isLoading && !isError && (
        <>
          {filteredAmenities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Nenhuma comodidade encontrada.</p>
              {searchQuery && (
                <p className="text-sm mt-2">
                  Tente buscar com outros termos ou crie uma nova comodidade.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredAmenities.map((amenity) => {
                const isSelected = data.amenities.includes(amenity.id);
                const IconComponent = getIconComponent(amenity.icon);

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
                    <IconComponent
                      className={cn(
                        "h-5 w-5 shrink-0",
                        isSelected ? "text-primary" : "text-muted-foreground"
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-medium block truncate">{amenity.name}</span>
                      {amenity.description && (
                        <span className="text-xs text-muted-foreground block truncate">
                          {amenity.description}
                        </span>
                      )}
                    </div>
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Selected Count */}
      {!isLoading && !isError && (
        <p className="text-sm text-muted-foreground text-center">
          {data.amenities.length} comodidade(s) selecionada(s)
        </p>
      )}

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
