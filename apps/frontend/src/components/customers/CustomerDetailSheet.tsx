import { Phone, Mail, Calendar, Clock, User, MessageCircle, Edit, Trash2, TrendingUp } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Customer } from "./CustomerCard";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerDetailSheetProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onWhatsApp: (id: string) => void;
}

// Mock recent appointments for customer
const mockRecentAppointments = [
  { id: "1", service: "Corte de Cabelo", date: "28/11/2024", time: "14:00", professional: "João Santos" },
  { id: "2", service: "Coloração", date: "15/11/2024", time: "10:00", professional: "Maria Silva" },
  { id: "3", service: "Corte de Cabelo", date: "01/11/2024", time: "14:00", professional: "João Santos" },
  { id: "4", service: "Hidratação", date: "18/10/2024", time: "15:30", professional: "Maria Silva" },
];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export const CustomerDetailSheet = ({
  customer,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  onWhatsApp,
}: CustomerDetailSheetProps) => {
  const isMobile = useIsMobile();

  if (!customer) return null;

  const content = (
    <div className="space-y-6">
      {/* Customer Header */}
      <div className="flex items-start gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xl">
            {getInitials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl font-semibold text-foreground">{customer.name}</h3>
            <Badge
              variant="outline"
              className={cn(
                "text-xs",
                customer.status === "active"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-muted text-muted-foreground border-border"
              )}
            >
              {customer.status === "active" ? "Ativo" : "Inativo"}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Cliente desde {customer.createdAt}
          </p>
        </div>
      </div>

      <Separator />

      {/* Contact Info */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <User className="h-4 w-4" />
          Informações de Contato
        </h4>
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{customer.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">{customer.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-foreground">Cadastrado em {customer.createdAt}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" />
          Estatísticas
        </h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-primary">{customer.totalAppointments}</p>
            <p className="text-xs text-muted-foreground">Total de agendamentos</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-foreground">
              {customer.averageFrequencyDays || "—"}
            </p>
            <p className="text-xs text-muted-foreground">Dias entre visitas</p>
          </div>
        </div>
        {customer.favoriteTime && (
          <div className="mt-3 bg-muted/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Horário favorito</span>
            </div>
            <span className="text-sm font-medium text-foreground">{customer.favoriteTime}</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Recent Appointments */}
      <div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Últimos Agendamentos
        </h4>
        <div className="space-y-2">
          {mockRecentAppointments.slice(0, 4).map((apt) => (
            <div
              key={apt.id}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{apt.service}</p>
                <p className="text-xs text-muted-foreground">
                  {apt.professional} • {apt.time}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{apt.date}</span>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Actions */}
      <div className="space-y-3">
        <Button
          variant="default"
          className="w-full gap-2"
          onClick={() => onWhatsApp(customer.id)}
        >
          <MessageCircle className="h-4 w-4" />
          Enviar WhatsApp
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => onEdit(customer.id)}
          >
            <Edit className="h-4 w-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
                Remover
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover cliente?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todos os dados do cliente serão removidos permanentemente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(customer.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh]">
          <DrawerHeader className="pb-2">
            <DrawerTitle>Detalhes do Cliente</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="pb-4">
          <SheetTitle>Detalhes do Cliente</SheetTitle>
        </SheetHeader>
        {content}
      </SheetContent>
    </Sheet>
  );
};
