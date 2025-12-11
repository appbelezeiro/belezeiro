// ============================================================================
// PHONE INPUT STEP - Step to Enter Phone Number
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { phoneSchema } from "../schemas";
import { PhoneInput } from "@/shared/components/form";
import { extractDigits } from "@/lib/utils/phone";

interface PhoneInputStepProps {
  onSubmit: (phone: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function PhoneInputStep({
  onSubmit,
  isLoading = false,
  error,
}: PhoneInputStepProps) {
  const [phone, setPhone] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handlePhoneChange = (value: string) => {
    setPhone(value);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract digits only for validation
    const digits = extractDigits(phone);

    const result = phoneSchema.safeParse(digits);
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    onSubmit(digits);
  };

  const displayError = validationError || error || undefined;

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Olá! Vamos agendar?</CardTitle>
        <CardDescription className="text-base">
          Digite seu telefone para começar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <PhoneInput
            value={phone}
            onValueChange={handlePhoneChange}
            error={displayError}
            className="h-12 text-center text-lg"
            autoFocus
            disabled={isLoading}
          />

          <Button
            type="submit"
            className="w-full h-12"
            disabled={extractDigits(phone).length < 10 || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Usaremos seu telefone apenas para confirmar o agendamento
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
