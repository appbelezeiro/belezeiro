import { useState } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/components/GoogleIcon";

export const PersonalProfileSettings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "João Silva",
    email: "joao.silva@gmail.com",
    phone: "(11) 99999-9999",
  });

  const handleSave = () => {
    toast({
      title: "Alterações salvas",
      description: "Seu perfil foi atualizado com sucesso.",
    });
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
        <div className="space-y-2">
          <Label htmlFor="name">Nome completo</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Seu nome completo"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            disabled
            className="bg-muted cursor-not-allowed"
          />
          <p className="text-xs text-muted-foreground">
            O email não pode ser alterado
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="(00) 00000-0000"
          />
        </div>
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
