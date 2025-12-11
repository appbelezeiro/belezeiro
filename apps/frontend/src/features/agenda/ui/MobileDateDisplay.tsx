import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface MobileDateDisplayProps {
  selectedDate: Date;
}

export function MobileDateDisplay({ selectedDate }: MobileDateDisplayProps) {
  const formattedDate = format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <div className="sm:hidden px-4 py-2 bg-muted/30 border-b">
      <h2 className="text-base font-semibold text-foreground text-center">
        {capitalizedDate}
      </h2>
    </div>
  );
}
