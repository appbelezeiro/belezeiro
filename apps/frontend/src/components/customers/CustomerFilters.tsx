import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface CustomerFiltersProps {
  appointmentsFilter: string;
  periodFilter: string;
  statusFilter: string;
  onAppointmentsChange: (value: string) => void;
  onPeriodChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onClearFilters: () => void;
}

export const CustomerFilters = ({
  appointmentsFilter,
  periodFilter,
  statusFilter,
  onAppointmentsChange,
  onPeriodChange,
  onStatusChange,
  onClearFilters,
}: CustomerFiltersProps) => {
  const hasActiveFilters =
    appointmentsFilter !== "all" || periodFilter !== "all" || statusFilter !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Appointments filter */}
      <Select value={appointmentsFilter} onValueChange={onAppointmentsChange}>
        <SelectTrigger className="w-[160px] h-9 text-sm">
          <SelectValue placeholder="Agendamentos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="0">Nenhum (0)</SelectItem>
          <SelectItem value="1-5">1 a 5</SelectItem>
          <SelectItem value="5+">Mais de 5</SelectItem>
        </SelectContent>
      </Select>

      {/* Period filter */}
      <Select value={periodFilter} onValueChange={onPeriodChange}>
        <SelectTrigger className="w-[180px] h-9 text-sm">
          <SelectValue placeholder="Período" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os períodos</SelectItem>
          <SelectItem value="30">Últimos 30 dias</SelectItem>
          <SelectItem value="90">Últimos 90 dias</SelectItem>
          <SelectItem value="inactive">Sem visita há 90+ dias</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-[140px] h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="active">Ativos</SelectItem>
          <SelectItem value="inactive">Inativos</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="h-9 gap-1 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}

      {/* Active filters badges */}
      {hasActiveFilters && (
        <div className="flex gap-2 ml-2">
          {appointmentsFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {appointmentsFilter === "0" && "Sem agendamentos"}
              {appointmentsFilter === "1-5" && "1-5 agendamentos"}
              {appointmentsFilter === "5+" && "5+ agendamentos"}
            </Badge>
          )}
          {periodFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {periodFilter === "30" && "Últimos 30 dias"}
              {periodFilter === "90" && "Últimos 90 dias"}
              {periodFilter === "inactive" && "Inativos 90+ dias"}
            </Badge>
          )}
          {statusFilter !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {statusFilter === "active" ? "Ativos" : "Inativos"}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};
