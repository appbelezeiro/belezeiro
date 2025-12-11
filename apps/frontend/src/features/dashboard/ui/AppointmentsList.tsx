import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Scissors, User, CalendarX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/contexts/AppContext";

interface Appointment {
  id: string;
  clientName: string;
  clientAvatar?: string;
  clientInitials: string;
  professional: string;
  service: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "in_progress" | "completed";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    clientName: "Maria Santos",
    clientInitials: "MS",
    professional: "Ana Costa",
    service: "Corte + Escova",
    date: "Hoje",
    time: "14:00",
    status: "in_progress",
  },
  {
    id: "2",
    clientName: "Pedro Oliveira",
    clientInitials: "PO",
    professional: "Carlos Lima",
    service: "Barba",
    date: "Hoje",
    time: "14:30",
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Juliana Ferreira",
    clientInitials: "JF",
    professional: "Ana Costa",
    service: "Coloração",
    date: "Hoje",
    time: "15:00",
    status: "pending",
  },
  {
    id: "4",
    clientName: "Lucas Mendes",
    clientInitials: "LM",
    professional: "Carlos Lima",
    service: "Corte Masculino",
    date: "Hoje",
    time: "15:30",
    status: "confirmed",
  },
  {
    id: "5",
    clientName: "Carla Souza",
    clientInitials: "CS",
    professional: "Ana Costa",
    service: "Manicure",
    date: "Hoje",
    time: "16:00",
    status: "confirmed",
  },
];

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Pendente",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "Em andamento",
    className: "bg-primary/10 text-primary border-primary/20",
  },
  completed: {
    label: "Concluído",
    className: "bg-secondary text-secondary-foreground border-border",
  },
};

export function AppointmentsList() {
  const { emptyStates } = useApp();
  const appointments = emptyStates.appointments ? [] : mockAppointments;

  return (
    <Card className="bg-card border border-border shadow-soft">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Próximos Agendamentos
          </CardTitle>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
            {appointments.length} hoje
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {appointments.length === 0 ? (
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
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center gap-4 p-4 hover:bg-secondary/30 transition-colors"
              >
                <Avatar className="h-11 w-11 flex-shrink-0">
                  <AvatarImage src={appointment.clientAvatar} alt={appointment.clientName} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-medium">
                    {appointment.clientInitials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm truncate">
                      {appointment.clientName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] px-2 py-0", statusConfig[appointment.status].className)}
                    >
                      {statusConfig[appointment.status].label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Scissors className="h-3 w-3" />
                      {appointment.service}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {appointment.professional}
                    </span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center gap-1 text-sm font-medium text-foreground">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    {appointment.time}
                  </div>
                  <span className="text-xs text-muted-foreground">{appointment.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
