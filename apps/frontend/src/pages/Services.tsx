import { useState, useMemo } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ProfessionsList } from "@/components/services/ProfessionsList";
import { ServicesList } from "@/components/services/ServicesList";
import { useToast } from "@/hooks/use-toast";
import { professions as catalogProfessions } from "@/data/professions";

export interface ServiceData {
  id: string;
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface ProfessionData {
  id: string;
  name: string;
  icon: string;
  services: ServiceData[];
}

// Mock data - will be replaced with real data from backend
const initialProfessions: ProfessionData[] = [
  {
    id: "cabeleireiro",
    name: "Cabeleireiro(a)",
    icon: "✂️",
    services: [
      { id: "corte-cabelo", name: "Corte de Cabelo", price: 50, duration: 30 },
      { id: "escova", name: "Escova", price: 40, duration: 45 },
      { id: "coloracao", name: "Coloração", price: 120, duration: 90 },
      { id: "hidratacao", name: "Hidratação", price: 80, duration: 60 },
      { id: "progressiva", name: "Progressiva", price: 200, duration: 180 },
    ],
  },
  {
    id: "barbeiro",
    name: "Barbeiro(a)",
    icon: "💈",
    services: [
      { id: "corte-barba", name: "Corte de Barba", price: 30, duration: 20 },
      { id: "corte-masculino", name: "Corte Masculino", price: 45, duration: 30 },
      { id: "barba-completa", name: "Barba Completa", price: 50, duration: 40 },
    ],
  },
  {
    id: "manicure",
    name: "Manicure",
    icon: "💅",
    services: [
      { id: "manicure-simples", name: "Manicure Simples", price: 35, duration: 40 },
      { id: "pedicure", name: "Pedicure", price: 45, duration: 50 },
      { id: "esmaltacao-gel", name: "Esmaltação em Gel", price: 80, duration: 60 },
    ],
  },
  {
    id: "esteticista",
    name: "Esteticista",
    icon: "✨",
    services: [
      { id: "limpeza-pele", name: "Limpeza de Pele", price: 90, duration: 60 },
      { id: "peeling", name: "Peeling", price: 150, duration: 45 },
    ],
  },
];

const Services = () => {
  const { toast } = useToast();
  const [professions, setProfessions] = useState<ProfessionData[]>(initialProfessions);
  const [selectedProfessionId, setSelectedProfessionId] = useState<string>(professions[0]?.id || "");

  const selectedProfession = useMemo(
    () => professions.find((p) => p.id === selectedProfessionId),
    [professions, selectedProfessionId]
  );

  // Get available professions from catalog that aren't already added
  const availableProfessions = useMemo(() => {
    const addedIds = professions.map(p => p.id);
    return catalogProfessions.filter(p => !addedIds.includes(p.id));
  }, [professions]);

  const handleSaveService = (professionId: string, serviceId: string, updates: Partial<ServiceData>) => {
    setProfessions((prev) =>
      prev.map((profession) => {
        if (profession.id !== professionId) return profession;
        return {
          ...profession,
          services: profession.services.map((service) =>
            service.id === serviceId ? { ...service, ...updates } : service
          ),
        };
      })
    );
    toast({
      title: "Serviço salvo",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleAddService = (professionId: string, serviceName: string, price?: number, duration?: number) => {
    const newService: ServiceData = {
      id: `service-${Date.now()}`,
      name: serviceName,
      price: price || 0,
      duration: duration || 30,
    };

    setProfessions((prev) =>
      prev.map((profession) => {
        if (profession.id !== professionId) return profession;
        return {
          ...profession,
          services: [...profession.services, newService],
        };
      })
    );
  };

  const handleRemoveService = (professionId: string, serviceId: string) => {
    setProfessions((prev) =>
      prev.map((profession) => {
        if (profession.id !== professionId) return profession;
        return {
          ...profession,
          services: profession.services.filter((s) => s.id !== serviceId),
        };
      })
    );
  };

  const handleAddProfession = (professionId: string, name: string, icon: string) => {
    const newProfession: ProfessionData = {
      id: professionId,
      name,
      icon,
      services: [],
    };
    setProfessions((prev) => [...prev, newProfession]);
    setSelectedProfessionId(newProfession.id);
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader activeNav="servicos" />

      <main className="content-container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Gerenciamento de Serviços</h1>
          <p className="text-muted-foreground mt-1">
            Organize os serviços oferecidos por profissão/especialidade
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-220px)]">
          {/* Left Column - Professions */}
          <div className="w-full lg:w-72 flex-shrink-0">
            <ProfessionsList
              professions={professions}
              availableProfessions={availableProfessions}
              selectedId={selectedProfessionId}
              onSelect={setSelectedProfessionId}
              onAddProfession={handleAddProfession}
            />
          </div>

          {/* Right Column - Services */}
          <div className="flex-1 flex flex-col">
            {selectedProfession ? (
              <ServicesList
                profession={selectedProfession}
                onSaveService={(serviceId, updates) =>
                  handleSaveService(selectedProfession.id, serviceId, updates)
                }
                onAddService={(name, price, duration) => 
                  handleAddService(selectedProfession.id, name, price, duration)
                }
                onRemoveService={(serviceId) =>
                  handleRemoveService(selectedProfession.id, serviceId)
                }
              />
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Selecione uma profissão para gerenciar os serviços
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Services;
