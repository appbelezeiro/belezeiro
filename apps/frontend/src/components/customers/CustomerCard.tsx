import { Phone, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  createdAt: string;
  lastAppointment: string | null;
  totalAppointments: number;
  status: "active" | "inactive";
  favoriteTime?: string;
  averageFrequencyDays?: number;
}

interface CustomerCardProps {
  customer: Customer;
  onClick: (customer: Customer) => void;
}

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const CustomerCard = ({ customer, onClick }: CustomerCardProps) => {
  return (
    <div
      onClick={() => onClick(customer)}
      className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group"
    >
      {/* Avatar */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
          {getInitials(customer.name)}
        </AvatarFallback>
      </Avatar>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
            {customer.name}
          </h3>
          <Badge
            variant="outline"
            className={cn(
              "text-xs flex-shrink-0",
              customer.status === "active"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-muted text-muted-foreground border-border"
            )}
          >
            {customer.status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {customer.phone}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="hidden sm:flex items-center gap-6 text-sm">
        <div className="text-center">
          <p className="font-semibold text-foreground">{customer.totalAppointments}</p>
          <p className="text-xs text-muted-foreground">Agendamentos</p>
        </div>
        <div className="text-center min-w-[100px]">
          <p className="font-medium text-foreground flex items-center justify-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
            {customer.lastAppointment || "—"}
          </p>
          <p className="text-xs text-muted-foreground">Último</p>
        </div>
      </div>
    </div>
  );
};
