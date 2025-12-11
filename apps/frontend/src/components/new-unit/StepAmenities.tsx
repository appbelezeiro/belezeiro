import { useState, useMemo } from "react";
import * as LucideIcons from "lucide-react";
import { Search, Loader2, AlertCircle, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { UnitFormData } from "@/pages/NewUnit";
import { cn } from "@/lib/utils";
import { useAmenities, useSearchAmenities } from "@/features/amenities";
import { CreateAmenityDialog } from "@/features/amenities/components/CreateAmenityDialog";
import { useDebounce } from "@/shared/hooks";

interface StepAmenitiesProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
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

export const StepAmenities = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepAmenitiesProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery.trim(), 300);

  // Determine if we should use search or list
  const isSearching = debouncedSearchQuery.length > 0;

  // Fetch all amenities (when not searching)
  const {
    data: amenitiesData,
    isLoading: isLoadingAll,
    isError: isErrorAll,
    error: errorAll,
  } = useAmenities({ limit: 100, enabled: !isSearching });

  // Search amenities (when searching)
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    isFetching: isFetchingSearch,
    isError: isErrorSearch,
    error: errorSearch,
  } = useSearchAmenities(debouncedSearchQuery, {
    limit: 100,
    enabled: isSearching,
  });

  // Determine loading and error states
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;
  const isSearchLoading = isSearching && isFetchingSearch;
  const isError = isSearching ? isErrorSearch : isErrorAll;
  const error = isSearching ? errorSearch : errorAll;

  // Flatten amenities from all pages
  const amenities = useMemo(() => {
    const sourceData = isSearching ? searchData : amenitiesData;
    if (!sourceData?.pages) return [];
    return sourceData.pages.flatMap((page) => page.items);
  }, [isSearching, searchData, amenitiesData]);

  const toggleAmenity = (amenityId: string) => {
    const isSelected = data.amenities.includes(amenityId);
    if (isSelected) {
      onUpdate({ amenities: data.amenities.filter((a) => a !== amenityId) });
    } else {
      onUpdate({ amenities: [...data.amenities, amenityId] });
    }
  };

  // Handler for when a new amenity is created - auto-select it
  const handleAmenityCreated = (amenityId: string) => {
    if (!data.amenities.includes(amenityId)) {
      onUpdate({ amenities: [...data.amenities, amenityId] });
    }
  };

  // Get error message
  const getErrorMessage = () => {
    if (error?.message) {
      return error.message;
    }
    return "Erro ao carregar comodidades. Tente novamente.";
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Comodidades</h2>
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
            className="pl-9 pr-9"
          />
          {/* Search loading indicator inside input */}
          {isSearchLoading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>
        <CreateAmenityDialog onAmenityCreated={handleAmenityCreated} />
      </div>

      {/* Initial Loading State */}
      {isLoading && !isSearchLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Carregando comodidades...
          </p>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="flex flex-col items-center justify-center gap-3 py-12">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-destructive" />
          </div>
          <div className="text-center">
            <p className="font-medium text-destructive">
              Erro ao carregar comodidades
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {getErrorMessage()}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="mt-2"
          >
            Tentar novamente
          </Button>
        </div>
      )}

      {/* Amenities Grid */}
      {!isLoading && !isError && (
        <>
          {amenities.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <SearchX className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">
                  Nenhuma comodidade encontrada
                </p>
                {searchQuery ? (
                  <p className="text-sm text-muted-foreground mt-1">
                    Não encontramos resultados para "{searchQuery}".
                    <br />
                    Tente buscar com outros termos ou crie uma nova comodidade.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">
                    Crie a primeira comodidade para sua unidade.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {amenities.map((amenity) => {
                const isSelected = data.amenities.includes(amenity.id);
                const IconComponent = getIconComponent(amenity.icon);

                return (
                  <div
                    key={amenity.id}
                    onClick={() => toggleAmenity(amenity.id)}
                    className={cn(
                      "flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center transition-colors shrink-0",
                          isSelected ? "bg-primary/10" : "bg-secondary"
                        )}
                      >
                        <IconComponent
                          className={cn(
                            "h-5 w-5",
                            isSelected ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className={cn(
                            "font-medium transition-colors block",
                            isSelected ? "text-foreground" : "text-muted-foreground"
                          )}
                        >
                          {amenity.name}
                        </span>
                        {amenity.description && (
                          <span className="text-xs text-muted-foreground block line-clamp-3 mt-0.5">
                            {amenity.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <Switch
                      checked={isSelected}
                      onCheckedChange={() => toggleAmenity(amenity.id)}
                      className="shrink-0 ml-2"
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
        <p className="text-center text-sm text-muted-foreground">
          {data.amenities.length === 0
            ? "Nenhuma comodidade selecionada"
            : `${data.amenities.length} comodidade${
                data.amenities.length !== 1 ? "s" : ""
              } selecionada${data.amenities.length !== 1 ? "s" : ""}`}
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
