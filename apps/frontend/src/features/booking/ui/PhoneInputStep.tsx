// ============================================================================
// PHONE INPUT STEP - Step to Enter Phone Number
// ============================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Phone, ArrowRight, Loader2 } from "lucide-react";
import { phoneSchema } from "../schemas";

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

  const formatPhone = (value: string) => {
    // Remove non-digits
    const digits = value.replace(/\D/g, "");

    // Format as (XX) XXXXX-XXXX
    if (digits.length <= 2) {
      return digits;
    }
    if (digits.length <= 7) {
      return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    }
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setPhone(formatted);
    setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Extract digits only for validation
    const digits = phone.replace(/\D/g, "");

    const result = phoneSchema.safeParse(digits);
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      return;
    }

    onSubmit(digits);
  };

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
          <div className="space-y-2">
            <Input
              type="tel"
              placeholder="(11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              className="h-12 text-center text-lg"
              maxLength={16}
              autoFocus
              disabled={isLoading}
            />
            {(validationError || error) && (
              <p className="text-center text-sm text-destructive">
                {validationError || error}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12"
            disabled={phone.replace(/\D/g, "").length < 10 || isLoading}
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
