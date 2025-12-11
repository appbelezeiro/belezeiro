import { Palette, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";

interface OnboardingStepPersonalizationProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

const presetColors = [
  { name: "Azul", value: "#3b82f6" },
  { name: "Verde", value: "#22c55e" },
  { name: "Roxo", value: "#8b5cf6" },
  { name: "Rosa", value: "#ec4899" },
  { name: "Laranja", value: "#f97316" },
  { name: "Vermelho", value: "#ef4444" },
  { name: "Ciano", value: "#06b6d4" },
  { name: "Dourado", value: "#eab308" },
  { name: "Índigo", value: "#6366f1" },
  { name: "Esmeralda", value: "#10b981" },
];

export const OnboardingStepPersonalization = ({ data, onUpdate, onNext, onBack, isSubmitting = false }: OnboardingStepPersonalizationProps) => {
  const handleColorChange = (color: string) => {
    onUpdate({ brandColor: color });
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
          <Palette className="h-8 w-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">
          Personalização
        </h2>
        <p className="text-muted-foreground">
          Escolha a cor da sua marca para personalizar a interface
        </p>
      </div>

      {/* Color Presets */}
      <div className="space-y-4">
        <Label>Cores pré-definidas</Label>
        <div className="grid grid-cols-5 gap-3">
          {presetColors.map((color) => {
            const isSelected = data.brandColor === color.value;
            return (
              <button
                key={color.value}
                onClick={() => handleColorChange(color.value)}
                className={cn(
                  "aspect-square rounded-xl border-2 transition-all relative flex items-center justify-center",
                  isSelected ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {isSelected && (
                  <Check className="h-5 w-5 text-white drop-shadow-md" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color */}
      <div className="space-y-3">
        <Label>Cor personalizada</Label>
        <div className="flex gap-3 items-center">
          <div
            className="w-12 h-12 rounded-xl border-2 border-border shrink-0"
            style={{ backgroundColor: data.brandColor }}
          />
          <Input
            type="text"
            value={data.brandColor}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder="#000000"
            className="font-mono"
          />
          <input
            type="color"
            value={data.brandColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Insira um código hexadecimal ou use o seletor de cores
        </p>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <Label>Pré-visualização</Label>
        <div className="p-6 rounded-xl border border-border bg-card">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: data.brandColor }}
              >
                <span className="text-white font-bold text-sm">
                  {data.unitName.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h4 className="font-semibold">{data.unitName || "Sua Unidade"}</h4>
                <p className="text-sm text-muted-foreground">{data.businessName || "Seu Negócio"}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                style={{ backgroundColor: data.brandColor }}
              >
                Agendar
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium border-2"
                style={{ borderColor: data.brandColor, color: data.brandColor }}
              >
                Ver serviços
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Notice */}
      <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
        <Palette className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-xs text-muted-foreground">
          Esta etapa é opcional. Você pode alterar a cor da sua marca a qualquer momento nas configurações.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting} className="flex-1 h-12">
          Voltar
        </Button>
        <Button onClick={onNext} disabled={isSubmitting} className="flex-1 h-12 text-base">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            "Finalizar configuração"
          )}
        </Button>
      </div>
    </div>
  );
};
