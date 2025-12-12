import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Scissors, CalendarX, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useUnit } from "@/contexts/UnitContext";
import { dashboardService } from "../api/dashboard.service";
import type { DashboardAppointment } from "../types";

type AppointmentStatus = "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled" | "no_show";

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  scheduled: {
    label: "Agendado",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  confirmed: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  in_progress: {
    label: "Em andamento",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Concluido",
    className: "bg-secondary text-secondary-foreground border-border",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  no_show: {
    label: "Nao compareceu",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function AppointmentSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-11 w-11 rounded-full bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-muted rounded animate-pulse" />
        <div className="h-3 w-48 bg-muted rounded animate-pulse" />
      </div>
      <div className="text-right space-y-2">
        <div className="h-4 w-12 bg-muted rounded animate-pulse" />
        <div className="h-3 w-8 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

export function AppointmentsList() {
  const { selectedUnit } = useUnit();

  const {
    data: appointmentsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["dashboard", "appointments", selectedUnit?.id],
    queryFn: () => dashboardService.getTodayAppointments(selectedUnit!.id),
    enabled: !!selectedUnit?.id,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });

  const appointments = appointmentsData?.items ?? [];

  // Loading state
  if (isLoading || !selectedUnit) {
    return (
      <Card className="bg-card border border-border shadow-soft">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Proximos Agendamentos
            </CardTitle>
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {[...Array(3)].map((_, i) => (
              <AppointmentSkeleton key={i} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Proximos Agendamentos
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            {appointmentsData?.total ?? 0} hoje
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isError || appointments.length === 0 ? (
          <div className="p-8 text-center">
            <CalendarX className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="font-medium text-foreground mb-1">Nenhum agendamento para hoje</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Aproveite para organizar sua agenda ou atrair novos clientes.
            </p>
            <Button variant="outline" size="sm">
              Ver agenda completa
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {appointments.map((appointment: DashboardAppointment) => {
              const status = (appointment.status as AppointmentStatus) || "scheduled";
              const config = statusConfig[status] || statusConfig.scheduled;

              return (
                <div
                  key={appointment.id}
                  className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
                >
                  <Avatar className="h-11 w-11 flex-shrink-0">
                    <AvatarImage src={appointment.client.photo ?? undefined} alt={appointment.client.name} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                      {getInitials(appointment.client.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground text-sm truncate">
                        {appointment.client.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-2 py-0", config.className)}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {appointment.service && (
                        <span className="flex items-center gap-1">
                          <Scissors className="h-3 w-3" />
                          {appointment.service.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                      {formatTime(appointment.startAt)}
                    </div>
                    <span className="text-xs text-muted-foreground">Hoje</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
