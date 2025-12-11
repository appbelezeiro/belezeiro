import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OnboardingFormData } from "@/pages/Onboarding";
import { FormInput, CepInput } from "@/shared/components/form";
import { addressStepSchema } from "@/shared/schemas/onboarding.schemas";
import { type Address } from "@/services/api/cep.service";
import { formatCep } from "@/services/api/cep.service";
import { z } from "zod";

interface OnboardingStepAddressProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepAddress = ({ data, onUpdate, onNext, onBack }: OnboardingStepAddressProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleAddressFound = (address: Address) => {
    onUpdate({
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    });
    // Clear related errors
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.street;
      delete newErrors.neighborhood;
      delete newErrors.city;
      delete newErrors.state;
      return newErrors;
    });
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

  const isValid = data.cep.replace(/\D/g, "").length === 8 && data.number && data.street;

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
        <CepInput
          label="CEP"
          value={formatCep(data.cep)}
          onValueChange={(value) => {
            onUpdate({ cep: value.replace(/\D/g, "") });
            clearError("cep");
          }}
          onAddressFound={handleAddressFound}
          error={errors.cep}
        />

        {/* Street */}
        <FormInput
          label="Rua"
          placeholder="Nome da rua"
          value={data.street}
          onChange={(e) => {
            onUpdate({ street: e.target.value });
            clearError("street");
          }}
          error={errors.street}
        />

        {/* Number and Complement */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Número *"
            placeholder="123"
            value={data.number}
            onChange={(e) => {
              onUpdate({ number: e.target.value });
              clearError("number");
            }}
            error={errors.number}
          />
          <FormInput
            label="Complemento"
            placeholder="Sala 101"
            value={data.complement}
            onChange={(e) => {
              onUpdate({ complement: e.target.value });
              clearError("complement");
            }}
            error={errors.complement}
          />
        </div>

        {/* Neighborhood and City */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="Bairro"
            placeholder="Bairro"
            value={data.neighborhood}
            onChange={(e) => {
              onUpdate({ neighborhood: e.target.value });
              clearError("neighborhood");
            }}
            error={errors.neighborhood}
          />
          <FormInput
            label="Cidade"
            placeholder="Cidade"
            value={data.city}
            onChange={(e) => {
              onUpdate({ city: e.target.value });
              clearError("city");
            }}
            error={errors.city}
          />
        </div>

        {/* State */}
        <div className="max-w-[100px]">
          <FormInput
            label="Estado"
            placeholder="UF"
            value={data.state}
            onChange={(e) => {
              onUpdate({ state: e.target.value.toUpperCase() });
              clearError("state");
            }}
            maxLength={2}
            error={errors.state}
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
