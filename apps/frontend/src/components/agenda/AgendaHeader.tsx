import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { BulkActionsMenu } from "./BulkActionsMenu";

interface AgendaHeaderProps {
  selectedDate: Date;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onToday: () => void;
  onRescheduleMultiple: () => void;
  onCancelMultiple: () => void;
  onConfirmAllPending: () => void;
  onSendBulkReminder: () => void;
  onBlockTime: () => void;
}

export const AgendaHeader = ({
  selectedDate,
  onPreviousDay,
  onNextDay,
  onToday,
  onRescheduleMultiple,
  onCancelMultiple,
  onConfirmAllPending,
  onSendBulkReminder,
  onBlockTime,
}: AgendaHeaderProps) => {
  const formattedDate = format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-card border-b">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPreviousDay}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={onToday}
          className="px-4"
        >
          Hoje
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={onNextDay}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <h2 className="text-lg font-semibold text-foreground hidden sm:block">
        {capitalizedDate}
      </h2>

      <BulkActionsMenu
        onRescheduleMultiple={onRescheduleMultiple}
        onCancelMultiple={onCancelMultiple}
        onConfirmAllPending={onConfirmAllPending}
        onSendBulkReminder={onSendBulkReminder}
        onBlockTime={onBlockTime}
      />
    </div>
  );
};
