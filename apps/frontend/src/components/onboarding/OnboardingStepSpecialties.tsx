import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Plus, Briefcase, Check, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useSpecialties, useSearchSpecialties } from "@/features/specialties/hooks";
import { queryKeys } from "@/shared/constants/query-keys";
import { servicesService } from "@/features/services/api";
import type { Specialty } from "@/features/specialties/types/specialty.types";
import type { ServicesResponse } from "@/features/services/types/service.types";
import { OnboardingSpecialitiesSidebar } from "@/features/onboarding/ui/specialities-sidebar";

interface OnboardingStepSpecialtiesProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepSpecialties = ({ data, onUpdate, onNext, onBack }: OnboardingStepSpecialtiesProps) => {
  const [specialtySearch, setSpecialtySearch] = useState("");
  const [activeSpecialtyId, setActiveSpecialtyId] = useState<string | null>(null);
  const [openAccordions, setOpenAccordions] = useState<Set<string>>(new Set());
  const [customServiceInputs, setCustomServiceInputs] = useState<Record<string, string>>({});

  // Track which specialties have had their services auto-selected
  const autoSelectedSpecialtiesRef = useRef<Set<string>>(new Set());

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
    const customSpecialties = data.especialidades.filter(
      (p) => !mapped.find((m) => m.id === p.id)
    );

    return [...mapped, ...customSpecialties];
  }, [apiSpecialties, data.especialidades]);

  // Filtered specialties based on search
  const filteredSpecialties = useMemo(() => {
    if (!specialtySearch.trim()) return allSpecialties;
    return allSpecialties.filter((p) =>
      p.name.toLowerCase().includes(specialtySearch.toLowerCase())
    );
  }, [allSpecialties, specialtySearch]);

  // Get selected specialty IDs for fetching services
  const selectedSpecialtyIds = data.especialidades.map((p) => p.id);

  // Fetch services for ALL specialties (not just selected ones)
  const allSpecialtyIds = allSpecialties.map((s) => s.id);

  const servicesQueries = useQueries({
    queries: allSpecialtyIds.map((specialtyId) => ({
      queryKey: queryKeys.servicesGlobal.list({ specialty_id: specialtyId, limit: 50 }),
      queryFn: () => servicesService.getServices(specialtyId, undefined, 50),
      // enabled: !!specialtyId && !specialtyId.startsWith('custom-'),
      enabled: false,
      staleTime: 5 * 60 * 1000,
    })),
  });

  // Get services count for a specialty
  const getServicesCount = (specialtyId: string) => {
    const index = allSpecialtyIds.indexOf(specialtyId);
    if (index === -1) return 0;
    const response = servicesQueries[index]?.data as ServicesResponse | undefined;
    return response?.items?.length || 0;
  };

  // Get selected services count for a specialty
  const getSelectedServicesCount = (specialtyId: string) => {
    return data.services.filter((s) => s.especialidadeId === specialtyId).length;
  };

  // Get services for a specialty
  const getServicesForSpecialty = (specialtyId: string) => {
    const index = allSpecialtyIds.indexOf(specialtyId);
    const response = index !== -1 ? servicesQueries[index]?.data as ServicesResponse | undefined : undefined;
    const apiServices = response?.items || [];

    // Custom services for this specialty
    const customServices = data.services
      .filter((s) => s.especialidadeId === specialtyId)
      .filter((s) => !apiServices.some((as) => as.id === s.id));

    return [
      ...apiServices.map((s) => ({ id: s.id, name: s.name, isCustom: false })),
      ...customServices.map((s) => ({ id: s.id, name: s.name, isCustom: true })),
    ];
  };

  // Auto-select all services when clicking a specialty for the first time
  const handleSpecialtyClick = (specialtyId: string) => {
    setActiveSpecialtyId(specialtyId);

    // Open the accordion for this specialty
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      newSet.add(specialtyId);
      return newSet;
    });

    // Check if specialty already has selected services
    const hasSelectedServices = data.services.some((s) => s.especialidadeId === specialtyId);

    // If no services selected yet, select all services for this specialty
    if (!hasSelectedServices) {
      const specialty = allSpecialties.find((p) => p.id === specialtyId);
      const allServicesForSpecialty = getServicesForSpecialty(specialtyId);

      if (specialty && allServicesForSpecialty.length > 0) {
        const newServices = allServicesForSpecialty.map((s) => ({
          id: s.id,
          name: s.name,
          especialidadeId: specialtyId,
        }));

        // Add specialty if not exists
        const specialtyExists = data.especialidades.some((p) => p.id === specialtyId);

        if (!specialtyExists) {
          onUpdate({
            especialidades: [...data.especialidades, specialty],
            services: [...data.services, ...newServices],
          });
        } else {
          onUpdate({
            services: [...data.services, ...newServices],
          });
        }
      }
    }

    // Scroll to the accordion
    setTimeout(() => {
      const element = document.getElementById(`accordion-${specialtyId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Toggle accordion open/close
  const toggleAccordion = (specialtyId: string) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(specialtyId)) {
        newSet.delete(specialtyId);
      } else {
        newSet.add(specialtyId);
      }
      return newSet;
    });
  };

  // Toggle service selection
  const toggleService = (serviceId: string, serviceName: string, especialidadeId: string) => {
    const isSelected = data.services.some((s) => s.id === serviceId);

    if (isSelected) {
      onUpdate({
        services: data.services.filter((s) => s.id !== serviceId),
      });
    } else {
      // Also add specialty if not already added
      const specialtyExists = data.especialidades.some((p) => p.id === especialidadeId);
      const specialty = allSpecialties.find((p) => p.id === especialidadeId);

      if (!specialtyExists && specialty) {
        onUpdate({
          especialidades: [...data.especialidades, specialty],
          services: [...data.services, { id: serviceId, name: serviceName, especialidadeId }],
        });
      } else {
        onUpdate({
          services: [...data.services, { id: serviceId, name: serviceName, especialidadeId }],
        });
      }
    }
  };

  // Check if service is selected
  const isServiceSelected = (serviceId: string) => {
    return data.services.some((s) => s.id === serviceId);
  };

  // Add custom service
  const addCustomService = (specialtyId: string) => {
    const serviceName = customServiceInputs[specialtyId]?.trim();
    if (!serviceName) return;

    // Check if service already exists
    const servicesForSpecialty = getServicesForSpecialty(specialtyId);
    if (servicesForSpecialty.some((s) => s.name.toLowerCase() === serviceName.toLowerCase())) {
      return;
    }

    const customId = `custom_serv_${Date.now()}`;

    // Also add specialty if not already added
    const specialtyExists = data.especialidades.some((p) => p.id === specialtyId);
    const specialty = allSpecialties.find((p) => p.id === specialtyId);

    if (!specialtyExists && specialty) {
      onUpdate({
        especialidades: [...data.especialidades, specialty],
        services: [...data.services, { id: customId, name: serviceName, especialidadeId: specialtyId }],
      });
    } else {
      onUpdate({
        services: [...data.services, { id: customId, name: serviceName, especialidadeId: specialtyId }],
      });
    }

    // Clear input
    setCustomServiceInputs((prev) => ({ ...prev, [specialtyId]: "" }));
  };

  const isValid = data.services.length > 0;
  const isLoading = isLoadingSpecialties || isSearching;

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Briefcase className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Especialidades e Servicos
        </h2>
        <p className="text-muted-foreground">
          Selecione suas especialidades e escolha os servicos que voce oferece
        </p>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-5xl mx-auto">
        {/* Left Column - Specialties Cards */}
        {/* <div className="lg:col-span-4 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Especialidades
          </h3>

          {/* Search Input 
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar especialidade..."
              value={specialtySearch}
              onChange={(e) => setSpecialtySearch(e.target.value)}
              className="pl-9 h-10"
            />
            {isLoading && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          <div className="space-y-2 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading && filteredSpecialties.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              filteredSpecialties.map((specialty) => {
                const servicesCount = getServicesCount(specialty.id);
                const selectedCount = getSelectedServicesCount(specialty.id);
                const isActive = activeSpecialtyId === specialty.id;
                const hasSelection = selectedCount > 0;

                return (
                  <button
                    key={specialty.id}
                    onClick={() => handleSpecialtyClick(specialty.id)}
                    className={cn(
                      "w-full p-4 rounded-xl border-2 text-left transition-all duration-200",
                      "flex items-center gap-3 group",
                      isActive
                        ? "border-primary bg-primary/5 shadow-md"
                        : hasSelection
                        ? "border-primary/50 bg-primary/5"
                        : "border-border hover:border-primary/30 hover:bg-muted/50"
                    )}
                  >
                    <span className="text-2xl flex-shrink-0">{specialty.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className={cn(
                        "font-medium truncate transition-colors",
                        isActive ? "text-primary" : "text-foreground"
                      )}>
                        {specialty.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {servicesCount} servicos disponiveis
                      </p>
                    </div>
                    {hasSelection && (
                      <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        {selectedCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
            {filteredSpecialties.length === 0 && !isLoading && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma especialidade encontrada
              </p>
            )}
          </div>
        </div> */}

        <OnboardingSpecialitiesSidebar />

        {/* Right Column - Services Accordions */}
        {/* <div className="lg:col-span-8 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Servicos por Especialidade
          </h3>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {allSpecialties.map((specialty) => {
              const services = getServicesForSpecialty(specialty.id);
              const selectedCount = getSelectedServicesCount(specialty.id);
              const isOpen = openAccordions.has(specialty.id);
              const isActive = activeSpecialtyId === specialty.id;
              const queryIndex = allSpecialtyIds.indexOf(specialty.id);
              const isLoadingServices = queryIndex !== -1 && servicesQueries[queryIndex]?.isLoading;

              return (
                <Collapsible
                  key={specialty.id}
                  id={`accordion-${specialty.id}`}
                  open={isOpen}
                  onOpenChange={() => toggleAccordion(specialty.id)}
                >
                  <div
                    className={cn(
                      "rounded-xl border-2 transition-all duration-200 overflow-hidden",
                      isActive
                        ? "border-primary shadow-md"
                        : selectedCount > 0
                        ? "border-primary/30"
                        : "border-border"
                    )}
                  >
                    {/* Accordion Header 
                    <CollapsibleTrigger asChild>
                      <div
                        className={cn(
                          "w-full p-4 flex items-center justify-between cursor-pointer transition-colors",
                          isOpen ? "bg-muted/50" : "hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{specialty.icon}</span>
                          <div className="text-left">
                            <p className="font-semibold text-foreground">
                              {specialty.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {selectedCount} servico(s) selecionado(s)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs text-primary hover:text-primary hover:bg-primary/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isOpen) {
                                toggleAccordion(specialty.id);
                              }
                              setTimeout(() => {
                                const input = document.getElementById(`custom-input-${specialty.id}`);
                                input?.focus();
                              }, 100);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Criar servico
                          </Button>
                          {isOpen ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    {/* Accordion Content
                    <CollapsibleContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                      <div className="p-4 pt-0 space-y-3">
                        {/* Custom Service Input
                        <div className="flex gap-2">
                          <Input
                            id={`custom-input-${specialty.id}`}
                            placeholder="Nome do servico personalizado..."
                            value={customServiceInputs[specialty.id] || ""}
                            onChange={(e) =>
                              setCustomServiceInputs((prev) => ({
                                ...prev,
                                [specialty.id]: e.target.value,
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                addCustomService(specialty.id);
                              }
                            }}
                            className="flex-1 h-9 text-sm"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addCustomService(specialty.id)}
                            disabled={!customServiceInputs[specialty.id]?.trim()}
                            className="h-9"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Services List 
                        {isLoadingServices ? (
                          <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {services.map((service) => {
                              const isSelected = isServiceSelected(service.id);

                              return (
                                <button
                                  key={`${specialty.id}-${service.id}`}
                                  onClick={() => toggleService(service.id, service.name, specialty.id)}
                                  className={cn(
                                    "flex items-center gap-3 p-3 rounded-lg transition-all duration-150 text-left",
                                    isSelected
                                      ? "bg-primary/10 border border-primary/40"
                                      : "bg-muted/30 border border-transparent hover:bg-muted/50"
                                  )}
                                >
                                  {/* Checkbox indicator 
                                  <div
                                    className={cn(
                                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0",
                                      isSelected
                                        ? "bg-primary border-primary"
                                        : "border-muted-foreground/40"
                                    )}
                                  >
                                    {isSelected && (
                                      <Check className="h-3 w-3 text-primary-foreground" />
                                    )}
                                  </div>
                                  <span
                                    className={cn(
                                      "text-sm truncate",
                                      isSelected ? "text-foreground font-medium" : "text-muted-foreground"
                                    )}
                                  >
                                    {service.name}
                                    {service.isCustom && (
                                      <span className="ml-1 text-xs text-primary">(personalizado)</span>
                                    )}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        </div> */}
      </div>

      {/* Summary */}
      <div className="bg-muted/50 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">
            {data.services.length} servico(s) selecionado(s)
          </p>
          <p className="text-xs text-muted-foreground">
            em {data.especialidades.length} especialidade(s)
          </p>
        </div>
        {data.services.length > 0 && (
          <div className="flex flex-wrap gap-1 max-w-[60%] justify-end">
            {data.especialidades.slice(0, 3).map((p) => (
              <span
                key={p.id}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
              >
                {p.name}
              </span>
            ))}
            {data.especialidades.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{data.especialidades.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
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
