import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UnitFormData } from "@/pages/NewUnit";
import { professions as defaultProfessions, getServicesByProfession } from "@/data/professions";
import { cn } from "@/lib/utils";

interface StepSpecialtiesProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepSpecialties = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepSpecialtiesProps) => {
  const [newServiceName, setNewServiceName] = useState("");
  const [selectedProfessionForService, setSelectedProfessionForService] = useState("");
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false);
  const [isSpecialtyDialogOpen, setIsSpecialtyDialogOpen] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState("");

  // Combine default professions with custom ones
  const allProfessions = [
    ...defaultProfessions,
    ...data.professions.filter(p => !defaultProfessions.find(dp => dp.id === p.id))
  ];

  const toggleProfession = (profession: { id: string; name: string; icon: string }) => {
    const isSelected = data.professions.some(p => p.id === profession.id);
    let newProfessions: typeof data.professions;
    let newServices: typeof data.services;

    if (isSelected) {
      newProfessions = data.professions.filter((p) => p.id !== profession.id);
      newServices = data.services.filter((s) => s.professionId !== profession.id);
    } else {
      newProfessions = [...data.professions, profession];
      const servicesForProfession = getServicesByProfession(profession.id);
      const serviceEntries = servicesForProfession.map((s) => ({
        name: s.name,
        professionId: profession.id,
      }));
      newServices = [...data.services, ...serviceEntries];
    }

    onUpdate({ professions: newProfessions, services: newServices });
  };

  const toggleService = (serviceName: string, professionId: string) => {
    const existingIndex = data.services.findIndex(
      s => s.name === serviceName && s.professionId === professionId
    );
    
    if (existingIndex >= 0) {
      const newServices = [...data.services];
      newServices.splice(existingIndex, 1);
      onUpdate({ services: newServices });
    } else {
      onUpdate({ services: [...data.services, { name: serviceName, professionId }] });
    }
  };

  const addCustomService = () => {
    if (newServiceName.trim() && selectedProfessionForService) {
      const exists = data.services.some(
        s => s.name === newServiceName.trim() && s.professionId === selectedProfessionForService
      );
      if (!exists) {
        onUpdate({
          services: [...data.services, { name: newServiceName.trim(), professionId: selectedProfessionForService }]
        });
      }
      setNewServiceName("");
      setSelectedProfessionForService("");
      setIsServiceDialogOpen(false);
    }
  };

  const addCustomSpecialty = () => {
    if (newSpecialtyName.trim()) {
      const id = `custom-${Date.now()}`;
      const newProfession = {
        id,
        name: newSpecialtyName.trim(),
        icon: "✨",
      };
      onUpdate({
        professions: [...data.professions, newProfession]
      });
      setNewSpecialtyName("");
      setIsSpecialtyDialogOpen(false);
    }
  };

  const getServicesForProfession = (professionId: string) => {
    const defaultServices = getServicesByProfession(professionId).map(s => s.name);
    const customServices = data.services
      .filter(s => s.professionId === professionId && !defaultServices.includes(s.name))
      .map(s => s.name);
    return [...new Set([...defaultServices, ...customServices])];
  };

  const isServiceSelected = (serviceName: string, professionId: string) => {
    return data.services.some(s => s.name === serviceName && s.professionId === professionId);
  };

  const isValid = data.professions.length > 0 && data.services.length > 0;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Especialidades e Serviços
        </h2>
        <p className="text-muted-foreground">
          Selecione as especialidades e serviços oferecidos nesta unidade
        </p>
      </div>

      {/* Professions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Especialidades</h3>
          <Dialog open={isSpecialtyDialogOpen} onOpenChange={setIsSpecialtyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Nova especialidade
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nova Especialidade</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Nome da especialidade</Label>
                  <Input
                    placeholder="Ex: Podologia, Massoterapia..."
                    value={newSpecialtyName}
                    onChange={(e) => setNewSpecialtyName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addCustomSpecialty()}
                  />
                </div>
                <Button onClick={addCustomSpecialty} className="w-full" disabled={!newSpecialtyName.trim()}>
                  Criar especialidade
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {allProfessions.map((profession) => {
            const isSelected = data.professions.some(p => p.id === profession.id);
            return (
              <button
                key={profession.id}
                onClick={() => toggleProfession(profession)}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <span className="text-2xl">{profession.icon}</span>
                <span className="text-sm font-medium text-center">
                  {profession.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services by Profession */}
      {data.professions.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Serviços</h3>
            <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Adicionar serviço
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Serviço</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Especialidade</Label>
                    <Select value={selectedProfessionForService} onValueChange={setSelectedProfessionForService}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a especialidade" />
                      </SelectTrigger>
                      <SelectContent>
                        {data.professions.map((prof) => (
                          <SelectItem key={prof.id} value={prof.id}>
                            {prof.icon} {prof.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nome do serviço</Label>
                    <Input
                      placeholder="Nome do serviço"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addCustomService()}
                    />
                  </div>
                  <Button 
                    onClick={addCustomService} 
                    className="w-full"
                    disabled={!newServiceName.trim() || !selectedProfessionForService}
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Services grouped by profession */}
          {data.professions.map((profession) => {
            const services = getServicesForProfession(profession.id);
            if (services.length === 0) return null;
            
            return (
              <div key={profession.id} className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <span>{profession.icon}</span>
                  <span>{profession.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {services.map((serviceName) => {
                    const isSelected = isServiceSelected(serviceName, profession.id);
                    return (
                      <Badge
                        key={`${profession.id}-${serviceName}`}
                        variant={isSelected ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all px-3 py-1.5 text-sm",
                          isSelected
                            ? "bg-primary hover:bg-primary/90"
                            : "hover:border-primary/50"
                        )}
                        onClick={() => toggleService(serviceName, profession.id)}
                      >
                        {serviceName}
                        {isSelected && (
                          <X className="h-3 w-3 ml-1.5 hover:text-destructive" />
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <p className="text-sm text-muted-foreground">
            {data.services.length} serviço{data.services.length !== 1 ? "s" : ""}{" "}
            selecionado{data.services.length !== 1 ? "s" : ""}
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