import { useState } from "react";
import { ChevronRight, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Service {
  id: string;
  name: string;
  enabled: boolean;
}

interface Profession {
  id: string;
  name: string;
  services: Service[];
}

const mockProfessions: Profession[] = [
  {
    id: "1",
    name: "Cabeleireiro(a)",
    services: [
      { id: "1", name: "Corte masculino", enabled: true },
      { id: "2", name: "Corte feminino", enabled: true },
      { id: "3", name: "Escova progressiva", enabled: true },
      { id: "4", name: "Coloração", enabled: true },
      { id: "5", name: "Hidratação", enabled: false },
      { id: "6", name: "Luzes", enabled: true },
      { id: "7", name: "Penteado", enabled: false },
      { id: "8", name: "Tratamento capilar", enabled: true },
    ],
  },
  {
    id: "2",
    name: "Manicure",
    services: [
      { id: "9", name: "Manicure simples", enabled: true },
      { id: "10", name: "Manicure com esmaltação em gel", enabled: true },
      { id: "11", name: "Pedicure", enabled: true },
      { id: "12", name: "Unha decorada", enabled: false },
    ],
  },
  {
    id: "3",
    name: "Barbeiro",
    services: [
      { id: "13", name: "Corte navalhado", enabled: true },
      { id: "14", name: "Barba completa", enabled: true },
      { id: "15", name: "Pigmentação", enabled: true },
    ],
  },
];

export const ProfessionalProfileSettings = () => {
  const { toast } = useToast();
  const [professions, setProfessions] = useState<Profession[]>(mockProfessions);
  const [selectedProfession, setSelectedProfession] = useState<Profession | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState("");

  const handleOpenModal = (profession: Profession) => {
    setSelectedProfession(profession);
    setIsModalOpen(true);
  };

  const handleToggleService = (serviceId: string) => {
    if (!selectedProfession) return;
    
    setProfessions(prev => 
      prev.map(prof => {
        if (prof.id === selectedProfession.id) {
          return {
            ...prof,
            services: prof.services.map(service => 
              service.id === serviceId 
                ? { ...service, enabled: !service.enabled }
                : service
            ),
          };
        }
        return prof;
      })
    );
    
    setSelectedProfession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        services: prev.services.map(service => 
          service.id === serviceId 
            ? { ...service, enabled: !service.enabled }
            : service
        ),
      };
    });
  };

  const handleAddService = () => {
    if (!selectedProfession || !newServiceName.trim()) return;
    
    const newService: Service = {
      id: `new-${Date.now()}`,
      name: newServiceName.trim(),
      enabled: true,
    };
    
    setProfessions(prev => 
      prev.map(prof => {
        if (prof.id === selectedProfession.id) {
          return {
            ...prof,
            services: [...prof.services, newService],
          };
        }
        return prof;
      })
    );
    
    setSelectedProfession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        services: [...prev.services, newService],
      };
    });
    
    setNewServiceName("");
  };

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "Seu perfil profissional foi atualizado.",
    });
  };

  const getEnabledCount = (services: Service[]) => 
    services.filter(s => s.enabled).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Meu perfil profissional</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas profissões e serviços oferecidos
        </p>
      </div>

      {/* Professions List */}
      <div className="space-y-4">
        {professions.map((profession) => {
          const enabledCount = getEnabledCount(profession.services);
          const previewServices = profession.services.filter(s => s.enabled).slice(0, 3);
          
          return (
            <button
              key={profession.id}
              onClick={() => handleOpenModal(profession)}
              className="w-full text-left bg-muted/30 hover:bg-muted/50 rounded-lg p-5 border border-border transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-foreground">{profession.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {enabledCount} {enabledCount === 1 ? 'serviço' : 'serviços'}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {previewServices.map((service) => (
                  <span
                    key={service.id}
                    className="text-xs text-muted-foreground bg-background px-2 py-1 rounded"
                  >
                    {service.name}
                  </span>
                ))}
                {enabledCount > 3 && (
                  <span className="text-xs text-primary font-medium">
                    +{enabledCount - 3} mais
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Salvar alterações
        </Button>
      </div>

      {/* Services Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>{selectedProfession?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 pr-2">
            <p className="text-sm text-muted-foreground">
              Ative ou desative os serviços que você oferece
            </p>
            
            <div className="space-y-2">
              {selectedProfession?.services.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border"
                >
                  <Checkbox
                    id={service.id}
                    checked={service.enabled}
                    onCheckedChange={() => handleToggleService(service.id)}
                  />
                  <Label
                    htmlFor={service.id}
                    className="flex-1 cursor-pointer text-sm"
                  >
                    {service.name}
                  </Label>
                </div>
              ))}
            </div>
            
            {/* Add New Service */}
            <div className="pt-4 border-t border-border">
              <Label className="text-sm font-medium">Adicionar novo serviço</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  value={newServiceName}
                  onChange={(e) => setNewServiceName(e.target.value)}
                  placeholder="Nome do serviço"
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddService();
                  }}
                />
                <Button
                  size="icon"
                  onClick={handleAddService}
                  disabled={!newServiceName.trim()}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
