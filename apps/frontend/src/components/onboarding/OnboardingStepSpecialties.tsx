import { useState, useMemo, useEffect } from "react";
import { Search, Plus, Briefcase, Check, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";
import { useSpecialties, useSearchSpecialties } from "@/features/specialties/hooks";
import { useServices } from "@/features/services/hooks/queries/useServices";
import type { Specialty } from "@/features/specialties/types/specialty.types";

interface OnboardingStepSpecialtiesProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepSpecialties = ({ data, onUpdate, onNext, onBack }: OnboardingStepSpecialtiesProps) => {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // Fetch specialties from API (with or without search)
  const shouldSearch = specialtySearch.trim().length > 0;

  const { data: specialtiesData, isLoading: isLoadingSpecialties } = useSpecialties({
    enabled: !shouldSearch,
  });

  const { data: searchData, isLoading: isSearching } = useSearchSpecialties(
    specialtySearch,
    { enabled: shouldSearch }
  );

  // Flatten specialties from infinite query
  const apiSpecialties = useMemo(() => {
    const pages = shouldSearch ? searchData?.pages : specialtiesData?.pages;
    if (!pages) return [];
    return pages.flatMap((page) => page.items);
  }, [specialtiesData, searchData, shouldSearch]);

  // Map API specialties to form structure
  const allSpecialties = useMemo(() => {
    const mapped = apiSpecialties.map((s: Specialty) => ({
      id: s.id,
      name: s.name,
      icon: s.icon,
    }));

    // Add custom specialties that user created
    const customSpecialties = data.professions.filter(
      (p) => !mapped.find((m) => m.id === p.id)
    );

    return [...mapped, ...customSpecialties];
  }, [apiSpecialties, data.professions]);

  // Get selected specialty IDs for fetching services
  const selectedSpecialtyIds = data.professions.map((p) => p.id);

  // Fetch services for each selected specialty
  const servicesQueries = selectedSpecialtyIds.map((specialtyId) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useServices({ specialtyId, enabled: !!specialtyId });
  });

  // Combine all services from selected specialties
  const availableServices = useMemo(() => {
    const servicesMap = new Map<string, { name: string; professionId: string; professionName: string }>();

    servicesQueries.forEach((query, index) => {
      const specialtyId = selectedSpecialtyIds[index];
      const specialty = data.professions.find((p) => p.id === specialtyId);

      if (!query.data?.pages || !specialty) return;

      const services = query.data.pages.flatMap((page) => page.items);
      services.forEach((service) => {
        const key = `${service.id}-${specialtyId}`;
        if (!servicesMap.has(key)) {
          servicesMap.set(key, {
            name: service.name,
            professionId: specialtyId,
            professionName: specialty.name,
          });
        }
      });
    });

    // Include custom services already added
    data.services.forEach((s) => {
      const key = `custom-${s.name}-${s.professionId}`;
      if (!servicesMap.has(key)) {
        const profession = data.professions.find((p) => p.id === s.professionId);
        if (profession) {
          servicesMap.set(key, {
            name: s.name,
            professionId: s.professionId,
            professionName: profession.name,
          });
        }
      }
    });

    return Array.from(servicesMap.values());
  }, [servicesQueries, selectedSpecialtyIds, data.professions, data.services]);

  // Filter services by search
  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return availableServices;
    return availableServices.filter((s) =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [availableServices, serviceSearch]);

  // Check if search term matches any existing specialty
  const specialtyExistsInSearch = useMemo(() => {
    if (!specialtySearch.trim()) return true;
    return allSpecialties.some((s) =>
      s.name.toLowerCase() === specialtySearch.toLowerCase()
    );
  }, [allSpecialties, specialtySearch]);

  // Check if search term matches any existing service
  const serviceExistsInSearch = useMemo(() => {
    if (!serviceSearch.trim()) return true;
    return availableServices.some((s) =>
      s.name.toLowerCase() === serviceSearch.toLowerCase()
    );
  }, [availableServices, serviceSearch]);

  const toggleSpecialty = (specialty: { id: string; name: string; icon: string }) => {
    const isSelected = data.professions.some((p) => p.id === specialty.id);

    if (isSelected) {
      onUpdate({
        professions: data.professions.filter((p) => p.id !== specialty.id),
        services: data.services.filter((s) => s.professionId !== specialty.id),
      });
    } else {
      onUpdate({
        professions: [...data.professions, specialty],
      });
    }
  };

  const toggleService = (serviceName: string, professionId: string) => {
    const isSelected = data.services.some(
      (s) => s.name === serviceName && s.professionId === professionId
    );

    if (isSelected) {
      onUpdate({
        services: data.services.filter(
          (s) => !(s.name === serviceName && s.professionId === professionId)
        ),
      });
    } else {
      onUpdate({
        services: [...data.services, { name: serviceName, professionId }],
      });
    }
  };

  const addCustomSpecialty = () => {
    if (specialtySearch.trim() && !specialtyExistsInSearch) {
      const newId = `custom-${Date.now()}`;
      onUpdate({
        professions: [
          ...data.professions,
          { id: newId, name: specialtySearch.trim(), icon: "✨" },
        ],
      });
      setSpecialtySearch("");
    }
  };

  const addCustomService = () => {
    if (serviceSearch.trim() && !serviceExistsInSearch && data.professions.length > 0) {
      // Add to the first selected profession
      const firstProfession = data.professions[0];
      onUpdate({
        services: [
          ...data.services,
          { name: serviceSearch.trim(), professionId: firstProfession.id },
        ],
      });
      setServiceSearch("");
    }
  };

  const isServiceSelected = (serviceName: string, professionId: string) => {
    return data.services.some(
      (s) => s.name === serviceName && s.professionId === professionId
    );
  };

  const selectAllServices = () => {
    const allServices = availableServices.map((s) => ({
      name: s.name,
      professionId: s.professionId,
    }));
    onUpdate({ services: allServices });
  };

  const deselectAllServices = () => {
    onUpdate({ services: [] });
  };

  const isValid = data.professions.length > 0 && data.services.length > 0;
  const isLoading = isLoadingSpecialties || isSearching;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Especialidades e Serviços
        </h2>
        <p className="text-muted-foreground">
          Pesquise e selecione suas especialidades e serviços do catálogo
        </p>
      </div>

      {/* Specialties Search */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Especialidades</Label>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar especialidade..."
            value={specialtySearch}
            onChange={(e) => setSpecialtySearch(e.target.value)}
            className="pl-10"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
          )}
        </div>

        {/* Create new specialty option */}
        {specialtySearch.trim() && !specialtyExistsInSearch && !isLoading && (
          <button
            onClick={addCustomSpecialty}
            className="w-full p-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-left transition-all hover:border-primary hover:bg-primary/10 flex items-center gap-2"
          >
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Criar especialidade personalizada "{specialtySearch.trim()}"
            </span>
          </button>
        )}

        {/* Specialties list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {isLoading && allSpecialties.length === 0 ? (
            <div className="col-span-full flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : allSpecialties.length === 0 ? (
            <div className="col-span-full text-center py-8 text-sm text-muted-foreground">
              Nenhuma especialidade encontrada
            </div>
          ) : (
            allSpecialties.map((specialty) => {
              const isSelected = data.professions.some((p) => p.id === specialty.id);
              return (
                <button
                  key={specialty.id}
                  onClick={() => toggleSpecialty(specialty)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all flex items-center gap-2",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                  <span className="text-xs mr-1">{specialty.icon}</span>
                  <span className="text-sm font-medium truncate">{specialty.name}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Selected specialties badges */}
        {data.professions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.professions.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
              >
                <span className="text-xs">{p.icon}</span>
                {p.name}
                <button
                  onClick={() => toggleSpecialty(p)}
                  className="hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Services Search */}
      {data.professions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Serviços</Label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={selectAllServices} className="text-xs">
                Selecionar todos
              </Button>
              <Button variant="ghost" size="sm" onClick={deselectAllServices} className="text-xs">
                Limpar
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Pesquisar serviço..."
              value={serviceSearch}
              onChange={(e) => setServiceSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create new service option */}
          {serviceSearch.trim() && !serviceExistsInSearch && (
            <button
              onClick={addCustomService}
              className="w-full p-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-left transition-all hover:border-primary hover:bg-primary/10 flex items-center gap-2"
            >
              <Plus className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Criar serviço personalizado "{serviceSearch.trim()}" em {data.professions[0].name}
              </span>
            </button>
          )}

          {/* Services list with checkboxes */}
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
            {servicesQueries.some((q) => q.isLoading) && availableServices.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredServices.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum serviço encontrado
              </p>
            ) : (
              filteredServices.map((service) => {
                const isSelected = isServiceSelected(service.name, service.professionId);
                return (
                  <label
                    key={`${service.name}-${service.professionId}`}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all",
                      isSelected
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleService(service.name, service.professionId)}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.professionName}</p>
                    </div>
                  </label>
                );
              })
            )}
          </div>

          <p className="text-sm text-muted-foreground">
            {data.services.length} serviço(s) selecionado(s)
          </p>
        </div>
      )}

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
