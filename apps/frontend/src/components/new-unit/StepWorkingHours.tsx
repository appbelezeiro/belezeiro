import { useState } from "react";
import { Copy, Coffee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { UnitFormData } from "@/pages/NewUnit";
import { cn } from "@/lib/utils";

interface StepWorkingHoursProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const days = [
  { id: "monday", label: "Segunda-feira", short: "Seg" },
  { id: "tuesday", label: "Terça-feira", short: "Ter" },
  { id: "wednesday", label: "Quarta-feira", short: "Qua" },
  { id: "thursday", label: "Quinta-feira", short: "Qui" },
  { id: "friday", label: "Sexta-feira", short: "Sex" },
  { id: "saturday", label: "Sábado", short: "Sáb" },
  { id: "sunday", label: "Domingo", short: "Dom" },
];

const hours = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return [`${hour}:00`, `${hour}:30`];
}).flat();

export const StepWorkingHours = ({
  data,
  onUpdate,
  onNext,
  onBack,
}: StepWorkingHoursProps) => {
  const [copyFromDay, setCopyFromDay] = useState<string | null>(null);
  const [selectedDaysToCopy, setSelectedDaysToCopy] = useState<string[]>([]);

  const updateDayHours = (
    dayId: string,
    field: "open" | "close" | "enabled",
    value: string | boolean
  ) => {
    const newHours = {
      ...data.workingHours,
      [dayId]: {
        ...data.workingHours[dayId],
        [field]: value,
      },
    };
    onUpdate({ workingHours: newHours });
  };

  const copyHoursToSelectedDays = () => {
    if (!copyFromDay || selectedDaysToCopy.length === 0) return;

    const sourceHours = data.workingHours[copyFromDay];
    const newHours = { ...data.workingHours };

    selectedDaysToCopy.forEach((dayId) => {
      newHours[dayId] = { ...sourceHours };
    });

    onUpdate({ workingHours: newHours });
    setCopyFromDay(null);
    setSelectedDaysToCopy([]);
  };

  const toggleLunchBreak = (enabled: boolean) => {
    onUpdate({
      lunchBreak: { ...data.lunchBreak, enabled },
    });
  };

  const updateLunchBreak = (field: "start" | "end", value: string) => {
    onUpdate({
      lunchBreak: { ...data.lunchBreak, [field]: value },
    });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Horários de Funcionamento
        </h2>
        <p className="text-muted-foreground">
          Configure os horários de atendimento desta unidade
        </p>
      </div>

      {/* Working Hours */}
      <div className="space-y-3">
        {days.map((day) => {
          const dayData = data.workingHours[day.id];
          return (
            <div
              key={day.id}
              className={cn(
                "p-4 rounded-xl border transition-colors",
                dayData.enabled
                  ? "border-border bg-card"
                  : "border-border/50 bg-secondary/30"
              )}
            >
              {/* Header row - Switch + Day name */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Switch
                    checked={dayData.enabled}
                    onCheckedChange={(checked) =>
                      updateDayHours(day.id, "enabled", checked)
                    }
                  />
                  <span
                    className={cn(
                      "font-medium",
                      dayData.enabled ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    <span className="hidden sm:inline">{day.label}</span>
                    <span className="sm:hidden">{day.short}</span>
                  </span>
                </div>

                {!dayData.enabled && (
                  <span className="text-sm text-muted-foreground">
                    Fechado
                  </span>
                )}

                {/* Copy button - desktop only in header */}
                {dayData.enabled && (
                  <div className="hidden sm:block">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCopyFromDay(day.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Copiar para:</p>
                          {days
                            .filter((d) => d.id !== day.id)
                            .map((d) => (
                              <div
                                key={d.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`copy-${d.id}`}
                                  checked={selectedDaysToCopy.includes(d.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedDaysToCopy([
                                        ...selectedDaysToCopy,
                                        d.id,
                                      ]);
                                    } else {
                                      setSelectedDaysToCopy(
                                        selectedDaysToCopy.filter(
                                          (id) => id !== d.id
                                        )
                                      );
                                    }
                                    setCopyFromDay(day.id);
                                  }}
                                />
                                <label
                                  htmlFor={`copy-${d.id}`}
                                  className="text-sm"
                                >
                                  {d.label}
                                </label>
                              </div>
                            ))}
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={copyHoursToSelectedDays}
                            disabled={selectedDaysToCopy.length === 0}
                          >
                            Aplicar
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Time selectors row */}
              {dayData.enabled && (
                <div className="flex items-center gap-2 mt-3 sm:mt-0 sm:absolute sm:relative">
                  <div className="flex items-center gap-2 flex-1 sm:flex-none">
                    <Select
                      value={dayData.open}
                      onValueChange={(v) => updateDayHours(day.id, "open", v)}
                    >
                      <SelectTrigger className="w-full sm:w-24 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground text-sm">às</span>
                    <Select
                      value={dayData.close}
                      onValueChange={(v) => updateDayHours(day.id, "close", v)}
                    >
                      <SelectTrigger className="w-full sm:w-24 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((h) => (
                          <SelectItem key={h} value={h}>
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Copy button - mobile only */}
                  <div className="sm:hidden">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9"
                          onClick={() => setCopyFromDay(day.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56" align="end">
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Copiar para:</p>
                          {days
                            .filter((d) => d.id !== day.id)
                            .map((d) => (
                              <div
                                key={d.id}
                                className="flex items-center gap-2"
                              >
                                <Checkbox
                                  id={`copy-mobile-${d.id}`}
                                  checked={selectedDaysToCopy.includes(d.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedDaysToCopy([
                                        ...selectedDaysToCopy,
                                        d.id,
                                      ]);
                                    } else {
                                      setSelectedDaysToCopy(
                                        selectedDaysToCopy.filter(
                                          (id) => id !== d.id
                                        )
                                      );
                                    }
                                    setCopyFromDay(day.id);
                                  }}
                                />
                                <label
                                  htmlFor={`copy-mobile-${d.id}`}
                                  className="text-sm"
                                >
                                  {d.short}
                                </label>
                              </div>
                            ))}
                          <Button
                            size="sm"
                            className="w-full"
                            onClick={copyHoursToSelectedDays}
                            disabled={selectedDaysToCopy.length === 0}
                          >
                            Aplicar
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Lunch Break */}
      <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Coffee className="h-5 w-5 text-primary" />
            </div>
            <div>
              <Label className="font-medium">Pausa para almoço</Label>
              <p className="text-sm text-muted-foreground">
                Horário de intervalo
              </p>
            </div>
          </div>
          <Switch
            checked={data.lunchBreak.enabled}
            onCheckedChange={toggleLunchBreak}
          />
        </div>

        {data.lunchBreak.enabled && (
          <div className="flex items-center gap-3 pt-2">
            <Select
              value={data.lunchBreak.start}
              onValueChange={(v) => updateLunchBreak("start", v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground">às</span>
            <Select
              value={data.lunchBreak.end}
              onValueChange={(v) => updateLunchBreak("end", v)}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hours.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 text-base">
          Criar Unidade
        </Button>
      </div>
    </div>
  );
};
