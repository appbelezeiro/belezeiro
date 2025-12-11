import { Clock, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OnboardingFormData } from "@/pages/Onboarding";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface OnboardingStepWorkingHoursProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const days = [
  { key: "monday", label: "Segunda" },
  { key: "tuesday", label: "Terça" },
  { key: "wednesday", label: "Quarta" },
  { key: "thursday", label: "Quinta" },
  { key: "friday", label: "Sexta" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const OnboardingStepWorkingHours = ({ data, onUpdate, onNext, onBack }: OnboardingStepWorkingHoursProps) => {
  const { toast } = useToast();

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    onUpdate({
      workingHours: {
        ...data.workingHours,
        [day]: { ...data.workingHours[day], [field]: value },
      },
    });
  };

  const updateLunchBreak = (field: string, value: string | boolean) => {
    onUpdate({
      lunchBreak: { ...data.lunchBreak, [field]: value },
    });
  };

  const copyHoursToAll = (sourceDay: string) => {
    const source = data.workingHours[sourceDay];
    const updated = { ...data.workingHours };
    days.forEach(({ key }) => {
      if (key !== sourceDay) {
        updated[key] = { ...source };
      }
    });
    onUpdate({ workingHours: updated });
    toast({ title: "Horários copiados para todos os dias" });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Horários de funcionamento
        </h2>
        <p className="text-muted-foreground">
          Configure os horários de atendimento da sua unidade
        </p>
      </div>

      {/* Lunch Break */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border">
        <div className="flex items-center gap-3 flex-1">
          <Switch
            checked={data.lunchBreak.enabled}
            onCheckedChange={(checked) => updateLunchBreak("enabled", checked)}
          />
          <span className="text-sm font-medium">Pausa para almoço</span>
        </div>
        {data.lunchBreak.enabled && (
          <div className="flex items-center gap-2">
            <Select
              value={data.lunchBreak.start}
              onValueChange={(v) => updateLunchBreak("start", v)}
            >
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-muted-foreground text-xs">às</span>
            <Select
              value={data.lunchBreak.end}
              onValueChange={(v) => updateLunchBreak("end", v)}
            >
              <SelectTrigger className="w-20 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeOptions.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Days */}
      <div className="space-y-2">
        {days.map(({ key, label }) => {
          const day = data.workingHours[key];
          return (
            <div
              key={key}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-border"
            >
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  checked={day.enabled}
                  onCheckedChange={(checked) => updateWorkingHours(key, "enabled", checked)}
                />
                <span className="text-sm font-medium w-20">{label}</span>
              </div>

              {day.enabled && (
                <div className="flex items-center gap-2 ml-11 sm:ml-0">
                  <Select
                    value={day.open}
                    onValueChange={(v) => updateWorkingHours(key, "open", v)}
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground text-xs">às</span>
                  <Select
                    value={day.close}
                    onValueChange={(v) => updateWorkingHours(key, "close", v)}
                  >
                    <SelectTrigger className="w-20 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeOptions.map((t) => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyHoursToAll(key)}
                    className="h-8 px-2 text-xs gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span className="hidden sm:inline">Copiar</span>
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button onClick={onNext} className="flex-1 h-12 text-base">
          Continuar
        </Button>
      </div>
    </div>
  );
};
