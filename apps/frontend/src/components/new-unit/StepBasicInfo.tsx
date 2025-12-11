import { useState } from "react";
import { Upload, MapPin, Info, X, Plus, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnitFormData } from "@/pages/NewUnit";
import { cn } from "@/lib/utils";

interface StepBasicInfoProps {
  data: UnitFormData;
  onUpdate: (data: Partial<UnitFormData>) => void;
  onNext: () => void;
}

export const StepBasicInfo = ({ data, onUpdate, onNext }: StepBasicInfoProps) => {
  const [isLoadingCep, setIsLoadingCep] = useState(false);

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

  const isValid = data.name && data.cep.length === 8 && data.number && data.street && data.whatsapp;

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">
          Informações da Unidade
        </h2>
        <p className="text-muted-foreground">
          Comece definindo os dados básicos da sua nova unidade
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Logo + Name Row */}
        <div className="flex gap-4 items-start">
          {/* Logo Upload */}
          <div className="shrink-0">
            <Label className="text-sm mb-2 block">Logo</Label>
            <div
              className={cn(
                "relative w-20 h-20 border-2 border-dashed rounded-xl transition-colors cursor-pointer hover:border-primary/50 overflow-hidden",
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
                  <Upload className="h-5 w-5 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* Unit Name */}
          <div className="flex-1 space-y-2">
            <Label htmlFor="name">Nome da unidade</Label>
            <Input
              id="name"
              placeholder="Ex: Unidade Jardins"
              value={data.name}
              onChange={(e) => onUpdate({ name: e.target.value })}
            />
          </div>
        </div>

        {/* Name Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-lg bg-secondary/50">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              O nome da unidade é público e será exibido aos seus clientes.
            </p>
            <p className="text-xs text-muted-foreground/70">
              Sugestão: Se for sua única unidade, use algo como "Unidade Jardins" ou "Studio Centro"
            </p>
          </div>
        </div>

        {/* Phone Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Telefones</Label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp *</Label>
              <Input
                id="whatsapp"
                placeholder="(11) 99999-9999"
                value={data.whatsapp}
                onChange={(e) => onUpdate({ whatsapp: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Principal meio de contato com clientes
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone secundário</Label>
              <Input
                id="phone"
                placeholder="(11) 3333-4444"
                value={data.phone}
                onChange={(e) => onUpdate({ phone: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Opcional - fixo ou celular
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Upload */}
        <div className="space-y-2">
          <Label>Galeria de fotos</Label>
          <p className="text-sm text-muted-foreground">
            Adicione fotos do ambiente, atendimentos, serviços e mais
          </p>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
            {/* Existing Images */}
            {(data.gallery || []).map((img, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                <img
                  src={img}
                  alt={`Galeria ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeGalleryImage(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            
            {/* Add More Button */}
            <div
              className={cn(
                "relative aspect-square border-2 border-dashed rounded-lg transition-colors cursor-pointer hover:border-primary/50 flex flex-col items-center justify-center gap-1",
                "border-border bg-secondary/30"
              )}
            >
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Plus className="h-5 w-5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Adicionar</span>
            </div>
          </div>
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <Label className="text-base font-semibold">Endereço</Label>
          </div>

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
      </div>

      {/* Actions */}
      <div className="pt-4">
        <Button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-12 text-base"
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};