// ============================================================================
// BOOKING PROGRESS - Progress Indicator for Booking Flow
// ============================================================================

import { Progress } from "@/components/ui/progress";
import type { BookingStep } from "../types";

interface BookingProgressProps {
  progress: number;
  currentStep: BookingStep;
}

const stepLabels: Record<BookingStep, string> = {
  PHONE_INPUT: "Telefone",
  OTP_VERIFICATION: "Verificação",
  REGISTRATION: "Cadastro",
  SERVICE_SELECTION: "Serviços",
  TIME_SELECTION: "Horário",
  CONFIRMATION: "Confirmação",
  SUCCESS: "Concluído",
};

export function BookingProgress({ progress, currentStep }: BookingProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {stepLabels[currentStep]}
        </span>
        <span className="font-medium">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
