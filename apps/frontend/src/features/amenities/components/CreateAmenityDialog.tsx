import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput } from "@/shared/components/form";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateAmenity } from "@/features/amenities";
import { useToast } from "@/hooks/use-toast";
import * as LucideIcons from "lucide-react";

// Available icons for amenities
const ICON_OPTIONS = [
  { value: "wifi", label: "Wi-Fi", icon: LucideIcons.Wifi },
  { value: "car", label: "Estacionamento", icon: LucideIcons.Car },
  { value: "coffee", label: "Café", icon: LucideIcons.Coffee },
  { value: "wind", label: "Ar-condicionado", icon: LucideIcons.Wind },
  { value: "cookie", label: "Snacks", icon: LucideIcons.Cookie },
  { value: "sofa", label: "Sala de espera", icon: LucideIcons.Sofa },
  { value: "accessibility", label: "Acessibilidade", icon: LucideIcons.Accessibility },
  { value: "sparkles", label: "Limpeza", icon: LucideIcons.Sparkles },
  { value: "music", label: "Música", icon: LucideIcons.Music },
  { value: "monitor", label: "TV", icon: LucideIcons.Monitor },
  { value: "phone", label: "Telefone", icon: LucideIcons.Phone },
  { value: "baby", label: "Espaço Kids", icon: LucideIcons.Baby },
  { value: "gift", label: "Brindes", icon: LucideIcons.Gift },
  { value: "shield-check", label: "Segurança", icon: LucideIcons.ShieldCheck },
];

// Function to slugify name to code
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9]+/g, "_") // Replace non-alphanumeric with underscore
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

interface CreateAmenityDialogProps {
  trigger?: React.ReactNode;
  onAmenityCreated?: (amenityId: string) => void;
}

export const CreateAmenityDialog = ({ trigger, onAmenityCreated }: CreateAmenityDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<string>(ICON_OPTIONS[0].value);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { toast } = useToast();
  const createAmenity = useCreateAmenity();

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setIcon(ICON_OPTIONS[0].value);
    setErrors({});
  };

  const handleSubmit = async () => {
    // Validate
    const newErrors: Record<string, string> = {};
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }
    if (!icon) {
      newErrors.icon = "Ícone é obrigatório";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const code = slugify(name);
      const createdAmenity = await createAmenity.mutateAsync({
        code,
        name: name.trim(),
        description: description.trim() || undefined,
        icon,
      });

      toast({
        title: "Comodidade criada",
        description: "A nova comodidade foi criada com sucesso.",
      });

      // Call the callback to auto-select the new amenity
      if (onAmenityCreated && createdAmenity?.id) {
        onAmenityCreated(createdAmenity.id);
      }

      resetForm();
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Erro ao criar comodidade",
        description: error.message || "Ocorreu um erro ao criar a comodidade.",
        variant: "destructive",
      });
    }
  };

  const isValid = name.trim() && icon;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Comodidade
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Comodidade</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <FormInput
            label="Nome *"
            placeholder="Ex: Spa Privativo"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            error={errors.name}
          />

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Descreva a comodidade..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Ícone *</Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger id="icon">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ICON_OPTIONS.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {errors.icon && (
              <p className="text-sm text-destructive">{errors.icon}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              onClick={handleSubmit}
              disabled={!isValid || createAmenity.isPending}
              className="w-full"
            >
              {createAmenity.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Comodidade"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
