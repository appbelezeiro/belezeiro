import { useState } from "react";
import { Clock, Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OnboardingFormData } from "@/pages/Onboarding";
import { OnboardingStepWorkingHours } from "./OnboardingStepWorkingHours";
import { AvailabilityRuleCard } from "./availability/AvailabilityRuleCard";
import { AvailabilityExceptionCard } from "./availability/AvailabilityExceptionCard";
import type { AvailabilityRuleInput, AvailabilityExceptionInput } from "@/features/units/types/unit-availability.types";

interface OnboardingStepWorkingHoursAdvancedProps {
  data: OnboardingFormData & {
    availability_rules?: AvailabilityRuleInput[];
    availability_exceptions?: AvailabilityExceptionInput[];
    useAdvancedMode?: boolean;
  };
  onUpdate: (data: Partial<OnboardingFormData & {
    availability_rules?: AvailabilityRuleInput[];
    availability_exceptions?: AvailabilityExceptionInput[];
    useAdvancedMode?: boolean;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepWorkingHoursAdvanced = ({
  data,
  onUpdate,
  onNext,
  onBack
}: OnboardingStepWorkingHoursAdvancedProps) => {
  const [mode, setMode] = useState<'simple' | 'advanced'>(
    data.useAdvancedMode ? 'advanced' : 'simple'
  );

  const handleModeChange = (newMode: 'simple' | 'advanced') => {
    setMode(newMode);
    onUpdate({ useAdvancedMode: newMode === 'advanced' });
  };

  const handleAddWeeklyRule = () => {
    const newRule: AvailabilityRuleInput = {
      type: 'weekly',
      weekday: 1, // Monday
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 30,
      is_active: true,
    };

    onUpdate({
      availability_rules: [...(data.availability_rules || []), newRule],
    });
  };

  const handleAddSpecificDateRule = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const newRule: AvailabilityRuleInput = {
      type: 'specific_date',
      date: dateStr,
      start_time: '09:00',
      end_time: '18:00',
      slot_duration_minutes: 30,
      is_active: true,
    };

    onUpdate({
      availability_rules: [...(data.availability_rules || []), newRule],
    });
  };

  const handleUpdateRule = (index: number, updates: Partial<AvailabilityRuleInput>) => {
    const rules = [...(data.availability_rules || [])];
    rules[index] = { ...rules[index], ...updates };
    onUpdate({ availability_rules: rules });
  };

  const handleDeleteRule = (index: number) => {
    const rules = [...(data.availability_rules || [])];
    rules.splice(index, 1);
    onUpdate({ availability_rules: rules });
  };

  const handleAddException = (type: 'block' | 'override') => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const newException: AvailabilityExceptionInput = {
      date: dateStr,
      type,
      ...(type === 'override' ? {
        start_time: '09:00',
        end_time: '18:00',
        slot_duration_minutes: 30,
      } : {}),
    };

    onUpdate({
      availability_exceptions: [...(data.availability_exceptions || []), newException],
    });
  };

  const handleUpdateException = (index: number, updates: Partial<AvailabilityExceptionInput>) => {
    const exceptions = [...(data.availability_exceptions || [])];
    exceptions[index] = { ...exceptions[index], ...updates };
    onUpdate({ availability_exceptions: exceptions });
  };

  const handleDeleteException = (index: number) => {
    const exceptions = [...(data.availability_exceptions || [])];
    exceptions.splice(index, 1);
    onUpdate({ availability_exceptions: exceptions });
  };

  // Simple mode: use the existing component
  if (mode === 'simple') {
    return (
      <div className="space-y-6">
        <div className="flex justify-center mb-4">
          <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'simple' | 'advanced')} className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="simple">
                <Clock className="h-4 w-4 mr-2" />
                Modo Simples
              </TabsTrigger>
              <TabsTrigger value="advanced">
                <Calendar className="h-4 w-4 mr-2" />
                Modo Avançado
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <OnboardingStepWorkingHours
          data={data}
          onUpdate={onUpdate}
          onNext={onNext}
          onBack={onBack}
        />
      </div>
    );
  }

  // Advanced mode: availability rules and exceptions
  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Calendar className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Horários de funcionamento (Avançado)
        </h2>
        <p className="text-muted-foreground">
          Configure regras de disponibilidade flexíveis para sua unidade
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <Tabs value={mode} onValueChange={(v) => handleModeChange(v as 'simple' | 'advanced')} className="w-full max-w-md">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simple">
              <Clock className="h-4 w-4 mr-2" />
              Modo Simples
            </TabsTrigger>
            <TabsTrigger value="advanced">
              <Calendar className="h-4 w-4 mr-2" />
              Modo Avançado
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Info Box */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-sm text-muted-foreground">
          No modo avançado, você pode criar regras semanais recorrentes ou regras para datas específicas.
          Também é possível adicionar exceções para bloquear ou sobrescrever horários em dias específicos.
        </p>
      </div>

      {/* Availability Rules */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Regras de Disponibilidade</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddWeeklyRule}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Regra Semanal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddSpecificDateRule}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Data Específica
            </Button>
          </div>
        </div>

        {(!data.availability_rules || data.availability_rules.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhuma regra criada. Clique em "Regra Semanal" ou "Data Específica" para começar.</p>
          </div>
        )}

        <div className="space-y-3">
          {data.availability_rules?.map((rule, index) => (
            <AvailabilityRuleCard
              key={index}
              rule={rule}
              onUpdate={(updates) => handleUpdateRule(index, updates)}
              onDelete={() => handleDeleteRule(index)}
            />
          ))}
        </div>
      </div>

      {/* Availability Exceptions */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Exceções</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddException('block')}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Bloquear Dia
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddException('override')}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Sobrescrever
            </Button>
          </div>
        </div>

        {(!data.availability_exceptions || data.availability_exceptions.length === 0) && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            <p>Nenhuma exceção criada.</p>
          </div>
        )}

        <div className="space-y-3">
          {data.availability_exceptions?.map((exception, index) => (
            <AvailabilityExceptionCard
              key={index}
              exception={exception}
              onUpdate={(updates) => handleUpdateException(index, updates)}
              onDelete={() => handleDeleteException(index)}
            />
          ))}
        </div>
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
