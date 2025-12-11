import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Appointment } from "../types";

interface AppointmentCardProps {
  appointment: Appointment;
  style?: React.CSSProperties;
  onClick?: (e?: React.MouseEvent) => void;
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

export function AppointmentCard({ appointment, style, onClick }: AppointmentCardProps) {
  const status = statusConfig[appointment.status];

  return (
    <div
      onClick={onClick}
      style={style}
      className={cn(
        "absolute left-0 right-0 mx-1 p-2 rounded-lg cursor-pointer transition-all",
        "bg-primary/10 border border-primary/20 hover:bg-primary/15 hover:shadow-md",
        "overflow-hidden"
      )}
    >
      <div className="flex flex-col gap-1 h-full">
        <div className="flex items-start justify-between gap-1">
          <span className="font-medium text-sm text-foreground truncate">
            {appointment.clientName}
          </span>
          <Badge variant="outline" className={cn("text-[10px] px-1.5 py-0 shrink-0", status.className)}>
            {status.label}
          </Badge>
        </div>

        <span className="text-xs text-muted-foreground truncate">
          {appointment.service}
        </span>

        <span className="text-xs text-muted-foreground truncate">
          {appointment.professional}
        </span>

        <span className="text-xs font-medium text-primary mt-auto">
          {appointment.startTime} – {appointment.endTime}
        </span>
      </div>
    </div>
  );
}
