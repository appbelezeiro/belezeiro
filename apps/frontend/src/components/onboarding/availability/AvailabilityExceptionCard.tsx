import { Trash2, Ban, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AvailabilityExceptionInput } from "@/features/units/types/unit-availability.types";

interface AvailabilityExceptionCardProps {
  exception: AvailabilityExceptionInput;
  onUpdate: (updates: Partial<AvailabilityExceptionInput>) => void;
  onDelete: () => void;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const slotDurationOptions = [15, 30, 45, 60, 90, 120];

export const AvailabilityExceptionCard = ({
  exception,
  onUpdate,
  onDelete
}: AvailabilityExceptionCardProps) => {
  const isBlock = exception.type === 'block';

  return (
    <div className={`p-4 rounded-lg border ${isBlock ? 'border-destructive/50 bg-destructive/5' : 'border-warning/50 bg-warning/5'}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          {isBlock ? (
            <Ban className="h-5 w-5 text-destructive" />
          ) : (
            <RefreshCw className="h-5 w-5 text-warning" />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {isBlock ? 'Bloquear Dia' : 'Sobrescrever Horário'}
            </span>
            <span className="text-xs text-muted-foreground">
              {exception.date || 'Sem data'}
            </span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Date */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">
            Data (YYYY-MM-DD)
          </label>
          <Input
            type="date"
            value={exception.date || ''}
            onChange={(e) => onUpdate({ date: e.target.value })}
            className="h-9"
          />
        </div>

        {/* Override-specific fields */}
        {!isBlock && (
          <>
            {/* Start Time */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Horário Início
              </label>
              <Select
                value={exception.start_time || '09:00'}
                onValueChange={(v) => onUpdate({ start_time: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* End Time */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">
                Horário Fim
              </label>
              <Select
                value={exception.end_time || '18:00'}
                onValueChange={(v) => onUpdate({ end_time: v })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>
                      {time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Slot Duration */}
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground">
                Duração do Slot (minutos)
              </label>
              <Select
                value={exception.slot_duration_minutes?.toString() || '30'}
                onValueChange={(v) => onUpdate({ slot_duration_minutes: parseInt(v) })}
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Duração" />
                </SelectTrigger>
                <SelectContent>
                  {slotDurationOptions.map((duration) => (
                    <SelectItem key={duration} value={duration.toString()}>
                      {duration} min
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        {/* Reason (optional for both types) */}
        <div className="space-y-2 md:col-span-2">
          <label className="text-xs font-medium text-muted-foreground">
            Motivo (opcional)
          </label>
          <Textarea
            value={exception.reason || ''}
            onChange={(e) => onUpdate({ reason: e.target.value })}
            placeholder={isBlock ? "Ex: Feriado, Férias, etc." : "Ex: Evento especial, horário estendido, etc."}
            className="min-h-[60px] resize-none"
          />
        </div>
      </div>
    </div>
  );
};
