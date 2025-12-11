// ============================================================================
// SERVICE SELECTION STEP - Step to Select Services
// ============================================================================

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, ArrowLeft, ArrowRight, Clock, DollarSign } from "lucide-react";
import type { Service } from "../types";

interface ServiceSelectionStepProps {
  services: Service[];
  selectedServices: Service[];
  onSelectServices: (services: Service[]) => void;
  onContinue: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function ServiceSelectionStep({
  services,
  selectedServices,
  onSelectServices,
  onContinue,
  onBack,
  isLoading = false,
}: ServiceSelectionStepProps) {
  const toggleService = (service: Service) => {
    const isSelected = selectedServices.some((s) => s.id === service.id);
    if (isSelected) {
      onSelectServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      onSelectServices([...selectedServices, service]);
    }
  };

  const totalPrice = useMemo(
    () => selectedServices.reduce((acc, s) => acc + s.price, 0),
    [selectedServices]
  );

  const totalDuration = useMemo(
    () => selectedServices.reduce((acc, s) => acc + s.duration, 0),
    [selectedServices]
  );

  // Group services by category
  const groupedServices = useMemo(() => {
    return services.reduce((acc, service) => {
      if (!acc[service.category]) {
        acc[service.category] = [];
      }
      acc[service.category].push(service);
      return acc;
    }, {} as Record<string, Service[]>);
  }, [services]);

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Escolha os serviços</CardTitle>
        <CardDescription className="text-base">
          Selecione um ou mais serviços para agendar
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="h-[320px] pr-4">
          <div className="space-y-6">
            {Object.entries(groupedServices).map(
              ([category, categoryServices]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    {category}
                  </h3>
                  <div className="space-y-2">
                    {categoryServices.map((service) => {
                      const isSelected = selectedServices.some(
                        (s) => s.id === service.id
                      );
                      return (
                        <div
                          key={service.id}
                          className={`
                            p-4 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }
                          `}
                          onClick={() => toggleService(service)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox checked={isSelected} className="mt-1" />
                            <div className="flex-1">
                              <p className="font-medium">{service.name}</p>
                              {service.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {service.description}
                                </p>
                              )}
                              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {service.duration}min
                                </span>
                                <span className="flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  R$ {service.price}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        {selectedServices.length > 0 && (
          <div className="p-4 bg-muted/50 rounded-lg space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                Serviços selecionados
              </span>
              <Badge variant="secondary">{selectedServices.length}</Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Duração total</span>
              <span className="font-medium">{totalDuration} min</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total</span>
              <span className="text-lg font-semibold">R$ {totalPrice}</span>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-12"
            onClick={onBack}
            disabled={isLoading}
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          <Button
            type="button"
            className="flex-1 h-12"
            disabled={selectedServices.length === 0 || isLoading}
            onClick={onContinue}
          >
            Escolher horário
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
