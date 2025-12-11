import { Progress } from "@/components/ui/progress";
import { BookingStep } from "@/pages/PublicBooking";

interface BookingProgressProps {
  progress: number;
  currentStep: BookingStep;
}

const stepLabels: Record<BookingStep, string> = {
  PHONE_INPUT: "Identificação",
  OTP_VERIFICATION: "Verificação",
  REGISTRATION: "Cadastro",
  SERVICE_SELECTION: "Serviços",
  TIME_SELECTION: "Horário",
  CONFIRMATION: "Confirmação",
  SUCCESS: "Concluído",
};

export function BookingProgress({ progress, currentStep }: BookingProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <Progress value={progress} className="h-1 flex-1" />
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {stepLabels[currentStep]}
      </span>
    </div>
  );
}
