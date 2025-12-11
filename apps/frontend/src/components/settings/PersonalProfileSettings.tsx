import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/components/GoogleIcon";
import { FormInput, PhoneInput } from "@/shared/components/form";
import { personalProfileSchema } from "@/shared/schemas/settings.schemas";
import { z } from "zod";

export const PersonalProfileSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@gmail.com",
    phone: "(11) 99999-9999",
  });
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

  const handleSave = () => {
    try {
      personalProfileSchema.parse({
        name: formData.name.trim(),
        phone: formData.phone || undefined,
      });
      setErrors({});
      toast({
        title: "Alterações salvas",
        description: "Seu perfil foi atualizado com sucesso.",
      });
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

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-foreground">Meu perfil pessoal</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Gerencie suas informações pessoais
        </p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="h-20 w-20">
          <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=joao" />
          <AvatarFallback className="text-lg">JS</AvatarFallback>
        </Avatar>
        <div>
          <Button variant="outline" size="sm" className="gap-2">
            <Camera className="h-4 w-4" />
            Alterar foto
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            JPG, PNG ou GIF. Máximo 2MB.
          </p>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-5">
        <FormInput
          label="Nome completo"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            clearError("name");
          }}
          placeholder="Seu nome completo"
          error={errors.name}
        />

        <div className="space-y-2">
          <FormInput
            label="Email"
            type="email"
            value={formData.email}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado
          </p>
        </div>

        <PhoneInput
          label="Telefone"
          value={formData.phone}
          onValueChange={(value) => {
            setFormData({ ...formData, phone: value });
            clearError("phone");
          }}
          error={errors.phone}
        />
      </div>

      {/* Connection Method */}
      <div className="bg-muted/50 rounded-lg p-4 border border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-card flex items-center justify-center border border-border">
            <GoogleIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">Conectado via Google</p>
            <p className="text-xs text-muted-foreground">joao.silva@gmail.com</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-border">
        <Button onClick={handleSave} className="w-full sm:w-auto">
          Salvar alterações
        </Button>
      </div>
    </div>
  );
};
