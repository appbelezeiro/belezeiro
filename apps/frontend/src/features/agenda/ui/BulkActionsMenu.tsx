import { Zap, RefreshCw, XCircle, CheckCircle, Bell, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionsMenuProps {
  onRescheduleMultiple: () => void;
  onCancelMultiple: () => void;
  onConfirmAllPending: () => void;
  onSendBulkReminder: () => void;
  onBlockTime: () => void;
}

export function BulkActionsMenu({
  onRescheduleMultiple,
  onCancelMultiple,
  onConfirmAllPending,
  onSendBulkReminder,
  onBlockTime,
}: BulkActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Zap className="h-4 w-4" />
          <span className="hidden sm:inline">Ações Rápidas</span>
          <span className="sm:hidden">Ações</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={onConfirmAllPending} className="gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          Confirmar todos pendentes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onSendBulkReminder} className="gap-2">
          <Bell className="h-4 w-4 text-blue-600" />
          Enviar lembrete em massa
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onRescheduleMultiple} className="gap-2">
          <RefreshCw className="h-4 w-4 text-amber-600" />
          Reagendar múltiplos
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onCancelMultiple} className="gap-2">
          <XCircle className="h-4 w-4 text-red-600" />
          Cancelar múltiplos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onBlockTime} className="gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          Bloquear horário
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
