import { useState, useCallback } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/pages/Onboarding";
import { FormInput } from "@/shared/components/form";
import { addressStepSchema } from "@/shared/schemas/onboarding.schemas";
import {
  formatCep,
  extractCepDigits,
  fetchAddressByCep,
  type CepServiceError,
} from "@/services/api/cep.service";
import { z } from "zod";
import { cn } from "@/lib/utils";

interface OnboardingStepAddressProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepAddress = ({ data, onUpdate, onNext, onBack }: OnboardingStepAddressProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);
  const [hasCepBeenSearched, setHasCepBeenSearched] = useState(false);

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCepChange = useCallback(async (rawValue: string) => {
    const digits = extractCepDigits(rawValue);
    const limitedDigits = digits.slice(0, 8);

    setCepError(null);
    onUpdate({ cep: limitedDigits });
    clearError("cep");

    // Busca endereço quando tiver 8 dígitos
    if (limitedDigits.length === 8 && !isManualMode) {
      setIsLoadingCep(true);
      try {
        const address = await fetchAddressByCep(limitedDigits);

        // Preenche os campos retornados pela API
        onUpdate({
          street: address.street || "",
          neighborhood: address.neighborhood || "",
          city: address.city || "",
          state: address.state || "",
        });

        setHasCepBeenSearched(true);

        // Limpa erros dos campos preenchidos
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (address.street) delete newErrors.street;
          if (address.neighborhood) delete newErrors.neighborhood;
          if (address.city) delete newErrors.city;
          if (address.state) delete newErrors.state;
          return newErrors;
        });
      } catch (err) {
        const cepServiceError = err as CepServiceError;
        setCepError(cepServiceError.message);
        setHasCepBeenSearched(true);
      } finally {
        setIsLoadingCep(false);
      }
    }
  }, [isManualMode, onUpdate]);

  const handleManualMode = () => {
    setIsManualMode(true);
    setCepError(null);
    setHasCepBeenSearched(true); // Libera os campos para edição
  };

  const handleNext = () => {
    try {
      addressStepSchema.parse({
        cep: formatCep(data.cep),
        street: data.street,
        number: data.number,
        complement: data.complement,
        neighborhood: data.neighborhood,
        city: data.city,
        state: data.state,
      });
      setErrors({});
      onNext();
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error('[Onboarding] Address validation errors:', err.errors);
        const newErrors: Record<string, string> = {};
        err.errors.forEach((e) => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  // Verifica se os campos de endereço estão desabilitados
  const isAddressFieldDisabled = () => {
    if (isManualMode) return false;
    if (!hasCepBeenSearched) return true; // Bloqueia até buscar CEP
    return false; // Após busca, campos ficam editáveis
  };

  const isValid = data.cep.replace(/\D/g, "").length === 8 && data.number && data.street && data.neighborhood && data.city && data.state;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <MapPin className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Onde fica sua unidade?
        </h2>
        <p className="text-muted-foreground">
          Informe o endereço da sua unidade
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* CEP */}
        <div className="space-y-2">
          <FormInput
            label="CEP *"
            placeholder="00000-000"
            value={formatCep(data.cep)}
            onChange={(e) => handleCepChange(e.target.value)}
            error={errors.cep || cepError || undefined}
            maxLength={9}
            rightElement={isLoadingCep ? <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /> : undefined}
          />
          {!isManualMode && (
            <button
              type="button"
              onClick={handleManualMode}
              className="text-xs text-primary hover:underline"
            >
              Inserir manualmente
            </button>
          )}
        </div>

        {/* Street */}
        <div className={cn(isAddressFieldDisabled() && "opacity-50")}>
          <FormInput
            label="Rua *"
            placeholder="Nome da rua"
            value={data.street}
            onChange={(e) => {
              onUpdate({ street: e.target.value });
              clearError("street");
            }}
            error={errors.street}
            disabled={isAddressFieldDisabled()}
          />
        </div>

        {/* Number and Complement */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(isAddressFieldDisabled() && "opacity-50")}>
            <FormInput
              label="Número *"
              placeholder="123"
              value={data.number}
              onChange={(e) => {
                onUpdate({ number: e.target.value });
                clearError("number");
              }}
              error={errors.number}
              disabled={isAddressFieldDisabled()}
            />
          </div>
          <div className={cn(isAddressFieldDisabled() && "opacity-50")}>
            <FormInput
              label="Complemento"
              placeholder="Sala 101"
              value={data.complement}
              onChange={(e) => {
                onUpdate({ complement: e.target.value });
                clearError("complement");
              }}
              error={errors.complement}
              disabled={isAddressFieldDisabled()}
            />
          </div>
        </div>

        {/* Neighborhood and City */}
        <div className="grid grid-cols-2 gap-4">
          <div className={cn(isAddressFieldDisabled() && "opacity-50")}>
            <FormInput
              label="Bairro *"
              placeholder="Bairro"
              value={data.neighborhood}
              onChange={(e) => {
                onUpdate({ neighborhood: e.target.value });
                clearError("neighborhood");
              }}
              error={errors.neighborhood}
              disabled={isAddressFieldDisabled()}
            />
          </div>
          <div className={cn(isAddressFieldDisabled() && "opacity-50")}>
            <FormInput
              label="Cidade *"
              placeholder="Cidade"
              value={data.city}
              onChange={(e) => {
                onUpdate({ city: e.target.value });
                clearError("city");
              }}
              error={errors.city}
              disabled={isAddressFieldDisabled()}
            />
          </div>
        </div>

        {/* State */}
        <div className={cn("max-w-[100px]", isAddressFieldDisabled() && "opacity-50")}>
          <FormInput
            label="Estado *"
            placeholder="UF"
            value={data.state}
            onChange={(e) => {
              onUpdate({ state: e.target.value.toUpperCase() });
              clearError("state");
            }}
            maxLength={2}
            error={errors.state}
            disabled={isAddressFieldDisabled()}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="flex-1 h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
