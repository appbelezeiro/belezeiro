// ============================================================================
// REGISTRATION STEP - Step to Register New Client
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
import { UserPlus, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { clientRegistrationSchema } from "../schemas";
import { FormInput } from "@/shared/components/form";
import { z } from "zod";

interface RegistrationStepProps {
  phone: string;
  onSubmit: (name: string, email: string) => void;
  onBack: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function RegistrationStep({
  phone,
  onSubmit,
  onBack,
  isLoading = false,
  error,
}: RegistrationStepProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      clientRegistrationSchema.parse({ name, email: email || undefined, phone });
      setValidationErrors({});
      onSubmit(name, email);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            errors[e.path[0] as string] = e.message;
          }
        });
        setValidationErrors(errors);
      }
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <UserPlus className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">Complete seu cadastro</CardTitle>
        <CardDescription className="text-base">
          Precisamos de algumas informações para continuar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            label="Nome completo *"
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
            autoFocus
            disabled={isLoading}
            error={validationErrors.name}
          />

          <div>
            <FormInput
              label="E-mail (opcional)"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              disabled={isLoading}
              error={validationErrors.email}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Você receberá confirmação e lembretes do agendamento
            </p>
          </div>

          {error && (
            <p className="text-center text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12"
              onClick={onBack}
              disabled={isLoading}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <Button
              type="submit"
              className="flex-1 h-12"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
