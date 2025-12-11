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
import type { AvailabilityRuleInput } from "@/features/units/types/unit-availability.types";

interface OnboardingStepWorkingHoursProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const days = [
  { weekday: 1, label: "Segunda" },
  { weekday: 2, label: "Terça" },
  { weekday: 3, label: "Quarta" },
  { weekday: 4, label: "Quinta" },
  { weekday: 5, label: "Sexta" },
  { weekday: 6, label: "Sábado" },
  { weekday: 0, label: "Domingo" },
];

const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minute = i % 2 === 0 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
});

export const OnboardingStepWorkingHours = ({ data, onUpdate, onNext, onBack }: OnboardingStepWorkingHoursProps) => {
  const { toast } = useToast();

  // Find the rule for a specific weekday
  const getRuleForWeekday = (weekday: number): AvailabilityRuleInput | undefined => {
    return data.availability_rules.find(
      (rule) => rule.type === 'weekly' && rule.weekday === weekday
    );
  };

  // Update a specific rule for a weekday
  const updateRule = (weekday: number, field: keyof AvailabilityRuleInput, value: any) => {
    const updatedRules = data.availability_rules.map((rule) => {
      if (rule.type === 'weekly' && rule.weekday === weekday) {
        return { ...rule, [field]: value };
      }
      return rule;
    });
    onUpdate({ availability_rules: updatedRules });
  };

  // Toggle a day on/off
  const toggleDay = (weekday: number, enabled: boolean) => {
    if (enabled) {
      // Add a new rule if enabling
      const existingRule = getRuleForWeekday(weekday);
      if (!existingRule) {
        onUpdate({
          availability_rules: [
            ...data.availability_rules,
            {
              type: 'weekly' as const,
              weekday,
              start_time: '09:00',
              end_time: '18:00',
              slot_duration_minutes: 30,
              is_active: true,
            },
          ],
        });
      } else {
        updateRule(weekday, 'is_active', true);
      }
    } else {
      // Remove the rule or mark as inactive
      updateRule(weekday, 'is_active', false);
    }
  };

  const copyHoursToAll = (sourceWeekday: number) => {
    const sourceRule = getRuleForWeekday(sourceWeekday);
    if (!sourceRule) return;

    const updatedRules = days.map(({ weekday }) => {
      if (weekday === sourceWeekday) {
        return sourceRule; // Keep source as is
      }
      const existingRule = getRuleForWeekday(weekday);
      if (existingRule) {
        // Update existing rule with source times
        return {
          ...existingRule,
          start_time: sourceRule.start_time,
          end_time: sourceRule.end_time,
          slot_duration_minutes: sourceRule.slot_duration_minutes,
        };
      } else {
        // Create new rule with source times
        return {
          type: 'weekly' as const,
          weekday,
          start_time: sourceRule.start_time,
          end_time: sourceRule.end_time,
          slot_duration_minutes: sourceRule.slot_duration_minutes,
          is_active: true,
        };
      }
    });

    onUpdate({ availability_rules: updatedRules });
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

      {/* Days */}
      <div className="space-y-2">
        {days.map(({ weekday, label }) => {
          const rule = getRuleForWeekday(weekday);
          const isEnabled = rule?.is_active !== false;
          return (
            <div
              key={weekday}
              className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-xl border border-border"
            >
              <div className="flex items-center gap-3 flex-1">
                <Switch
                  checked={isEnabled}
                  onCheckedChange={(checked) => toggleDay(weekday, checked)}
                />
                <span className="text-sm font-medium w-20">{label}</span>
              </div>

              {isEnabled && rule && (
                <div className="flex items-center gap-2 ml-11 sm:ml-0">
                  <Select
                    value={rule.start_time}
                    onValueChange={(v) => updateRule(weekday, 'start_time', v)}
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
                    value={rule.end_time}
                    onValueChange={(v) => updateRule(weekday, 'end_time', v)}
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
                    onClick={() => copyHoursToAll(weekday)}
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
