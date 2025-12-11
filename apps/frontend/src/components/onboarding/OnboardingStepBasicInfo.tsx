import { useState } from "react";
import { Upload, X, Plus, Phone, Building2, Store, Lock, Eye, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "@/pages/Onboarding";
import { cn } from "@/lib/utils";
import { FormInput, PhoneInput } from "@/shared/components/form";
import { basicInfoSchema, onboardingErrors } from "@/shared/schemas/onboarding.schemas";
import { z } from "zod";

interface OnboardingStepBasicInfoProps {
  data: OnboardingFormData;
  onUpdate: (data: Partial<OnboardingFormData>) => void;
  onNext: () => void;
}

export const OnboardingStepBasicInfo = ({ data, onUpdate, onNext }: OnboardingStepBasicInfoProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate({ logo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          if (newImages.length === files.length) {
            onUpdate({ gallery: [...(data.gallery || []), ...newImages] });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...(data.gallery || [])];
    newGallery.splice(index, 1);
    onUpdate({ gallery: newGallery });
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleNext = () => {
    try {
      basicInfoSchema.parse({
        businessName: data.businessName,
        unitName: data.unitName,
        logo: data.logo,
        gallery: data.gallery,
        whatsapp: data.whatsapp,
        phone: data.phone,
      });
      setErrors({});
      onNext();
    } catch (err) {
      if (err instanceof z.ZodError) {
        console.error('[Onboarding] Validation errors:', err.errors);
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

  const isValid = data.businessName && data.unitName && data.whatsapp;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Vamos configurar seu espaço
        </h2>
        <p className="text-muted-foreground">
          Comece definindo as informações básicas do seu negócio
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Business Name */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
              <Building2 className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Nome do Negócio</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Privado — não aparece para seus clientes
              </p>
            </div>
          </div>
          <FormInput
            placeholder="Ex: Meu Salão de Beleza"
            value={data.businessName}
            onChange={(e) => {
              onUpdate({ businessName: e.target.value });
              clearError("businessName");
            }}
            className="h-12"
            error={errors.businessName}
          />
        </div>

        {/* Unit Name with Logo */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-secondary">
              <Store className="h-5 w-5 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Unidade</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Público — seus clientes verão essa unidade
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            {/* Logo Upload */}
            <div className="shrink-0">
              <Label className="text-xs mb-2 block text-muted-foreground">Logo</Label>
              <div
                className={cn(
                  "relative w-16 h-16 border-2 border-dashed rounded-xl transition-colors cursor-pointer hover:border-primary/50 overflow-hidden",
                  data.logo ? "border-primary/30 bg-primary/5" : "border-border"
                )}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                {data.logo ? (
                  <img
                    src={data.logo}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>

            {/* Unit Name */}
            <div className="flex-1">
              <FormInput
                label="Nome da unidade"
                placeholder="Ex: Unidade Jardins"
                value={data.unitName}
                onChange={(e) => {
                  onUpdate({ unitName: e.target.value });
                  clearError("unitName");
                }}
                className="h-12"
                error={errors.unitName}
              />
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-secondary/50 rounded-lg">
            <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              Se você possui apenas uma unidade, use algo como: <span className="font-medium text-foreground">Unidade Centro</span> para facilitar a identificação.
            </p>
          </div>
        </div>

        {/* Gallery Upload */}
        <div className="space-y-2">
          <Label>Galeria de fotos</Label>
          <p className="text-sm text-muted-foreground">
            Adicione fotos do ambiente, atendimentos, serviços e mais
          </p>

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 mt-3">
            {(data.gallery || []).map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={img}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            ))}

            <div
              className={cn(
                "relative aspect-square border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:border-primary/50 flex flex-col items-center justify-center gap-1",
                "border-border bg-secondary/20"
              )}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Plus className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>

        {/* Phone Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Telefones de contato</Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <PhoneInput
                label="WhatsApp *"
                value={data.whatsapp}
                onValueChange={(value) => {
                  onUpdate({ whatsapp: value });
                  clearError("whatsapp");
                }}
                error={errors.whatsapp}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Principal meio de contato
              </p>
            </div>
            <div>
              <PhoneInput
                label="Telefone secundário"
                value={data.phone}
                onValueChange={(value) => {
                  onUpdate({ phone: value });
                  clearError("phone");
                }}
                error={errors.phone}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Opcional - fixo ou celular
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4">
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="w-full h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};
