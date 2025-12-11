import { useState } from "react";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "@/pages/Onboarding";

interface OnboardingStepAddressProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export const OnboardingStepAddress = ({ data, onUpdate, onNext, onBack }: OnboardingStepAddressProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    onUpdate({ cep: cleanCep });

    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const result = await response.json();
        if (!result.erro) {
          onUpdate({
            street: result.logradouro || "",
            neighborhood: result.bairro || "",
            city: result.localidade || "",
            state: result.uf || "",
          });
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const formatCep = (value: string) => {
    const clean = value.replace(/\D/g, "");
    if (clean.length <= 5) return clean;
    return `${clean.slice(0, 5)}-${clean.slice(5, 8)}`;
  };

  const isValid = data.cep.length === 8 && data.number && data.street;

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
          <Label htmlFor="cep">CEP</Label>
          <Input
            id="cep"
            placeholder="00000-000"
            value={formatCep(data.cep)}
            onChange={(e) => handleCepChange(e.target.value)}
            maxLength={9}
            className={isLoadingCep ? "animate-pulse" : ""}
          />
        </div>

        {/* Street */}
        <div className="space-y-2">
          <Label htmlFor="street">Rua</Label>
          <Input
            id="street"
            placeholder="Nome da rua"
            value={data.street}
            onChange={(e) => onUpdate({ street: e.target.value })}
            disabled={isLoadingCep}
          />
        </div>

        {/* Number and Complement */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="number">Número *</Label>
            <Input
              id="number"
              placeholder="123"
              value={data.number}
              onChange={(e) => onUpdate({ number: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="complement">Complemento</Label>
            <Input
              id="complement"
              placeholder="Sala 101"
              value={data.complement}
              onChange={(e) => onUpdate({ complement: e.target.value })}
            />
          </div>
        </div>

        {/* Neighborhood and City */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="neighborhood">Bairro</Label>
            <Input
              id="neighborhood"
              placeholder="Bairro"
              value={data.neighborhood}
              onChange={(e) => onUpdate({ neighborhood: e.target.value })}
              disabled={isLoadingCep}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              placeholder="Cidade"
              value={data.city}
              onChange={(e) => onUpdate({ city: e.target.value })}
              disabled={isLoadingCep}
            />
          </div>
        </div>

        {/* State */}
        <div className="space-y-2 max-w-[100px]">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            placeholder="UF"
            value={data.state}
            onChange={(e) => onUpdate({ state: e.target.value })}
            disabled={isLoadingCep}
            maxLength={2}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} className="flex-1 h-12">
          Voltar
        </Button>
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="flex-1 h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
