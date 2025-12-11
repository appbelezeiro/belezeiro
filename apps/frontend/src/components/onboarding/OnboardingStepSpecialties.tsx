import { useState, useMemo } from "react";
import { Search, Plus, Briefcase, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { OnboardingFormData } from "@/pages/Onboarding";
import { professions as defaultProfessions, services as defaultServices, getServicesByProfession } from "@/data/professions";
import { cn } from "@/lib/utils";

interface OnboardingStepSpecialtiesProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepSpecialties = ({ data, onUpdate, onNext, onBack }: OnboardingStepSpecialtiesProps) => {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [serviceSearch, setServiceSearch] = useState("");

  // All professions including custom ones
  const allProfessions = useMemo(() => [
    ...defaultProfessions.map((p) => ({ id: p.id, name: p.name, icon: p.icon })),
    ...data.professions.filter((p) => !defaultProfessions.find((dp) => dp.id === p.id)),
  ], [data.professions]);

  // Filter professions by search
  const filteredProfessions = useMemo(() => {
    if (!specialtySearch.trim()) return allProfessions;
    return allProfessions.filter((p) =>
      p.name.toLowerCase().includes(specialtySearch.toLowerCase())
    );
  }, [allProfessions, specialtySearch]);

  // Check if search term matches any existing profession
  const specialtyExistsInSearch = useMemo(() => {
    if (!specialtySearch.trim()) return true;
    return allProfessions.some((p) =>
      p.name.toLowerCase() === specialtySearch.toLowerCase()
    );
  }, [allProfessions, specialtySearch]);

  // Get all services for selected professions
  const availableServices = useMemo(() => {
    const servicesMap = new Map<string, { name: string; professionId: string; professionName: string }>();
    
    data.professions.forEach((profession) => {
      const professionServices = getServicesByProfession(profession.id);
      professionServices.forEach((s) => {
        const key = `${s.name}-${profession.id}`;
        if (!servicesMap.has(key)) {
          servicesMap.set(key, { name: s.name, professionId: profession.id, professionName: profession.name });
        }
      });
      
      // Include custom services already added
      data.services
        .filter((s) => s.professionId === profession.id)
        .forEach((s) => {
          const key = `${s.name}-${profession.id}`;
          if (!servicesMap.has(key)) {
            servicesMap.set(key, { name: s.name, professionId: profession.id, professionName: profession.name });
          }
        });
    });
    
    return Array.from(servicesMap.values());
  }, [data.professions, data.services]);

  // Filter services by search
  const filteredServices = useMemo(() => {
    if (!serviceSearch.trim()) return availableServices;
    return availableServices.filter((s) =>
      s.name.toLowerCase().includes(serviceSearch.toLowerCase())
    );
  }, [availableServices, serviceSearch]);

  // Check if search term matches any existing service
  const serviceExistsInSearch = useMemo(() => {
    if (!serviceSearch.trim()) return true;
    return availableServices.some((s) =>
      s.name.toLowerCase() === serviceSearch.toLowerCase()
    );
  }, [availableServices, serviceSearch]);

  const toggleProfession = (profession: { id: string; name: string; icon: string }) => {
    const isSelected = data.professions.some((p) => p.id === profession.id);

    if (isSelected) {
      onUpdate({
        professions: data.professions.filter((p) => p.id !== profession.id),
        services: data.services.filter((s) => s.professionId !== profession.id),
      });
    } else {
      onUpdate({
        professions: [...data.professions, profession],
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
          { id: newId, name: specialtySearch.trim(), icon: "Briefcase" },
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
          Pesquise e selecione suas especialidades e serviços
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
        </div>

        {/* Create new specialty option */}
        {specialtySearch.trim() && !specialtyExistsInSearch && (
          <button
            onClick={addCustomSpecialty}
            className="w-full p-3 rounded-lg border-2 border-dashed border-primary/50 bg-primary/5 text-left transition-all hover:border-primary hover:bg-primary/10 flex items-center gap-2"
          >
            <Plus className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Criar "{specialtySearch.trim()}"
            </span>
          </button>
        )}

        {/* Specialties list */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
          {filteredProfessions.map((profession) => {
            const isSelected = data.professions.some((p) => p.id === profession.id);
            return (
              <button
                key={profession.id}
                onClick={() => toggleProfession(profession)}
                className={cn(
                  "p-3 rounded-lg border-2 text-left transition-all flex items-center gap-2",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                <span className="text-sm font-medium truncate">{profession.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected specialties badges */}
        {data.professions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.professions.map((p) => (
              <span
                key={p.id}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-sm"
              >
                {p.name}
                <button
                  onClick={() => toggleProfession(p)}
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
                Criar "{serviceSearch.trim()}" em {data.professions[0].name}
              </span>
            </button>
          )}

          {/* Services list with checkboxes */}
          <div className="space-y-2 max-h-64 overflow-y-auto border rounded-lg p-3 bg-muted/30">
            {filteredServices.length === 0 ? (
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
