import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AvailabilityRuleInput } from "@/features/units/types/unit-availability.types";
import { WEEKDAY_NAMES } from "@/features/units/types/unit-availability.types";

interface AvailabilityRuleCardProps {
  rule: AvailabilityRuleInput;
  onUpdate: (updates: Partial<AvailabilityRuleInput>) => void;
  onDelete: () => void;
}

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

const slotDurationOptions = [15, 30, 45, 60, 90, 120];

export const AvailabilityRuleCard = ({
  rule,
  onUpdate,
  onDelete
}: AvailabilityRuleCardProps) => {
  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3 flex-1">
          <Switch
            checked={rule.is_active !== false}
            onCheckedChange={(checked) => onUpdate({ is_active: checked })}
          />
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {rule.type === 'weekly' ? 'Regra Semanal' : 'Data Específica'}
            </span>
            <span className="text-xs text-muted-foreground">
              {rule.type === 'weekly' && rule.weekday !== undefined
                ? WEEKDAY_NAMES[rule.weekday]
                : rule.date || 'Sem data'}
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
        {/* Type-specific field */}
        {rule.type === 'weekly' ? (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Dia da Semana
            </label>
            <Select
              value={rule.weekday?.toString()}
              onValueChange={(v) => onUpdate({ weekday: parseInt(v) })}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Selecione o dia" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(WEEKDAY_NAMES).map(([key, name]) => (
                  <SelectItem key={key} value={key}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">
              Data (YYYY-MM-DD)
            </label>
            <Input
              type="date"
              value={rule.date || ''}
              onChange={(e) => onUpdate({ date: e.target.value })}
              className="h-9"
            />
          </div>
        )}

        {/* Slot Duration */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Duração do Slot (minutos)
          </label>
          <Select
            value={rule.slot_duration_minutes?.toString()}
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

        {/* Start Time */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">
            Horário Início
          </label>
          <Select
            value={rule.start_time}
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
            value={rule.end_time}
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
      </div>
    </div>
  );
};
