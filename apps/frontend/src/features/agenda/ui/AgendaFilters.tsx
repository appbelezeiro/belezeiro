import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AgendaFiltersProps {
  selectedProfessional: string;
  selectedService: string;
  showOnlyConfirmed: boolean;
  onProfessionalChange: (value: string) => void;
  onServiceChange: (value: string) => void;
  onShowOnlyConfirmedChange: (value: boolean) => void;
  onClearFilters: () => void;
}

const professionals = [
  { id: "all", name: "Todos os profissionais" },
  { id: "1", name: "Maria Silva" },
  { id: "2", name: "João Santos" },
  { id: "3", name: "Ana Oliveira" },
];

const services = [
  { id: "all", name: "Todos os serviços" },
  { id: "1", name: "Corte de Cabelo" },
  { id: "2", name: "Coloração" },
  { id: "3", name: "Manicure" },
  { id: "4", name: "Pedicure" },
];

export function AgendaFilters({
  selectedProfessional,
  selectedService,
  showOnlyConfirmed,
  onProfessionalChange,
  onServiceChange,
  onShowOnlyConfirmedChange,
  onClearFilters,
}: AgendaFiltersProps) {
  const hasActiveFilters =
    selectedProfessional !== "all" ||
    selectedService !== "all" ||
    showOnlyConfirmed;

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-muted/30 border-b">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span className="text-sm font-medium hidden sm:inline">Filtros:</span>
      </div>

      <Select value={selectedProfessional} onValueChange={onProfessionalChange}>
        <SelectTrigger className="w-[180px] h-9 bg-background">
          <SelectValue placeholder="Profissional" />
        </SelectTrigger>
        <SelectContent>
          {professionals.map((prof) => (
            <SelectItem key={prof.id} value={prof.id}>
              {prof.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedService} onValueChange={onServiceChange}>
        <SelectTrigger className="w-[160px] h-9 bg-background">
          <SelectValue placeholder="Serviço" />
        </SelectTrigger>
        <SelectContent>
          {services.map((service) => (
            <SelectItem key={service.id} value={service.id}>
              {service.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center gap-2">
        <Checkbox
          id="confirmed-only"
          checked={showOnlyConfirmed}
          onCheckedChange={(checked) => onShowOnlyConfirmedChange(checked as boolean)}
        />
        <Label
          htmlFor="confirmed-only"
          className="text-sm cursor-pointer text-muted-foreground"
        >
          Somente confirmados
        </Label>
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3 w-3" />
          Limpar
        </Button>
      )}
    </div>
  );
}
