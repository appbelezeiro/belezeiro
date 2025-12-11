import { Phone, Mail, Calendar, Clock, User, MessageCircle, Edit, RefreshCw, X, Check } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Appointment } from "../types";

interface AppointmentDetailSheetProps {
  appointment: Appointment | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (id: string) => void;
  onEdit: (id: string) => void;
  onReschedule: (id: string) => void;
  onCancel: (id: string) => void;
  onWhatsApp: (id: string) => void;
}

const statusConfig = {
  confirmed: {
    label: "Confirmado",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  pending: {
    label: "Aguardando",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Cancelado",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const calculateDuration = (startTime: string, endTime: string) => {
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const totalMinutes = (endH * 60 + endM) - (startH * 60 + startM);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes}min`;
  if (minutes === 0) return `${hours}h`;
  return `${hours}h ${minutes}min`;
};

export function AppointmentDetailSheet({
  appointment,
  isOpen,
  onClose,
  onConfirm,
  onEdit,
  onReschedule,
  onCancel,
  onWhatsApp,
}: AppointmentDetailSheetProps) {
  if (!appointment) return null;

  const status = statusConfig[appointment.status];
  const duration = calculateDuration(appointment.startTime, appointment.endTime);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle className="text-left">Detalhes do Agendamento</SheetTitle>
        </SheetHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Informações do Cliente
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground text-lg">
                  {appointment.clientName}
                </span>
                <Badge variant="outline" className={cn("text-xs", status.className)}>
                  {status.label}
                </Badge>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{appointment.clientPhone || "(11) 99999-9999"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{appointment.clientEmail || "cliente@email.com"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Cliente desde: {appointment.clientSince || "Jan/2024"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  <span>{appointment.totalAppointments || 12} agendamentos anteriores</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Detalhes do Agendamento
            </h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Serviço</span>
                  <p className="font-medium text-foreground">{appointment.service}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Profissional</span>
                  <p className="font-medium text-foreground">{appointment.professional}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Horário</span>
                  <p className="font-medium text-foreground">
                    {appointment.startTime} - {appointment.endTime}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duração</span>
                  <p className="font-medium text-foreground">{duration}</p>
                </div>
              </div>

              {appointment.price && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Valor</span>
                  <p className="font-semibold text-foreground text-lg">
                    R$ {appointment.price.toFixed(2)}
                  </p>
                </div>
              )}

              {appointment.notes && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground text-sm">Observações</span>
                  <p className="text-foreground text-sm mt-1">{appointment.notes}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-3">
              Ações Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {appointment.status !== "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => onConfirm(appointment.id)}
                >
                  <Check className="h-4 w-4" />
                  Confirmar
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onEdit(appointment.id)}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => onReschedule(appointment.id)}
              >
                <RefreshCw className="h-4 w-4" />
                Remarcar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-destructive hover:text-destructive"
                onClick={() => onCancel(appointment.id)}
              >
                <X className="h-4 w-4" />
                Cancelar
              </Button>
            </div>
            <Button
              variant="default"
              size="sm"
              className="w-full mt-2 gap-2"
              onClick={() => onWhatsApp(appointment.id)}
            >
              <MessageCircle className="h-4 w-4" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
