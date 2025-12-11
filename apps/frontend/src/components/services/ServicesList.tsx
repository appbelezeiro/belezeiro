import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServiceCard } from "./ServiceCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getServicesByProfession } from "@/data/professions";
import type { ProfessionData, ServiceData } from "@/pages/Services";

interface ServicesListProps {
  profession: ProfessionData;
  onSaveService: (serviceId: string, updates: Partial<ServiceData>) => void;
  onAddService: (name: string, price?: number, duration?: number) => void;
  onRemoveService: (serviceId: string) => void;
}

export const ServicesList = ({
  profession,
  onSaveService,
  onAddService,
  onRemoveService,
}: ServicesListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Get catalog services for the current profession
  const catalogServices = useMemo(() => {
    const services = getServicesByProfession(profession.id);
    // Filter out services that are already added
    const addedNames = profession.services.map(s => s.name.toLowerCase());
    return services.filter(s => !addedNames.includes(s.name.toLowerCase()));
  }, [profession.id, profession.services]);

  // Filter catalog services by search query
  const filteredCatalogServices = useMemo(() => {
    if (!searchQuery.trim()) return catalogServices;
    return catalogServices.filter(s => 
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [catalogServices, searchQuery]);

  const handleAddNew = () => {
    if (newServiceName.trim()) {
      onAddService(newServiceName.trim());
      setNewServiceName("");
      setSearchQuery("");
      setIsModalOpen(false);
    }
  };

  const handleSelectCatalogService = (serviceName: string) => {
    onAddService(serviceName);
    setSearchQuery("");
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewServiceName("");
    setSearchQuery("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{profession.icon}</span>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{profession.name}</h2>
            <p className="text-sm text-muted-foreground">
              {profession.services.length} serviço{profession.services.length !== 1 ? "s" : ""} cadastrado{profession.services.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Novo serviço
        </Button>
      </div>

      {/* Services Grid */}
      {profession.services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 flex-1 content-start">
          {profession.services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSave={(updates) => onSaveService(service.id, updates)}
              onRemove={() => onRemoveService(service.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-12 bg-muted/20 rounded-xl border border-dashed border-border">
          <span className="text-4xl mb-3">📋</span>
          <p className="text-muted-foreground font-medium">Nenhum serviço cadastrado</p>
          <p className="text-sm text-muted-foreground/70 mt-1 mb-4">
            Adicione o primeiro serviço para esta profissão
          </p>
          <Button variant="outline" size="sm" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar serviço
          </Button>
        </div>
      )}

      {/* Add Service Modal */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            {/* Search/Create Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar ou criar novo serviço..."
                value={searchQuery || newServiceName}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setNewServiceName(e.target.value);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAddNew()}
                className="pl-10"
                autoFocus
              />
            </div>

            {/* Catalog Services */}
            {filteredCatalogServices.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Serviços sugeridos para {profession.name}
                </p>
                <ScrollArea className="h-48">
                  <div className="flex flex-wrap gap-2">
                    {filteredCatalogServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleSelectCatalogService(service.name)}
                        className="px-3 py-2 rounded-lg bg-secondary/50 hover:bg-secondary text-sm font-medium text-foreground transition-colors border border-border hover:border-primary/30"
                      >
                        {service.name}
                      </button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Create New Option */}
            {newServiceName.trim() && !catalogServices.some(s => 
              s.name.toLowerCase() === newServiceName.toLowerCase()
            ) && (
              <Button onClick={handleAddNew} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Criar "{newServiceName}"
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
