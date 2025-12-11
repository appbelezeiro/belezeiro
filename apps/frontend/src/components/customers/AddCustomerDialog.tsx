import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormInput, PhoneInput } from "@/shared/components/form";
import { addCustomerSchema } from "@/shared/schemas/customer.schemas";
import { extractDigits } from "@/lib/utils/phone";
import { z } from "zod";

interface AddCustomerDialogProps {
  onAdd: (customer: {
    name: string;
    phone: string;
    email: string;
  }) => void;
}

export const AddCustomerDialog = ({ onAdd }: AddCustomerDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
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

  const handleSubmit = () => {
    try {
      addCustomerSchema.parse({
        name: name.trim(),
        phone: phone,
        email: email.trim() || undefined,
      });
      setErrors({});
      onAdd({
        name: name.trim(),
        phone: extractDigits(phone),
        email: email.trim(),
      });
      setName("");
      setPhone("");
      setEmail("");
      setIsOpen(false);
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

  const isValid = name.trim() && extractDigits(phone).length >= 10;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          <span className="hidden sm:inline">Adicionar Cliente</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <FormInput
            label="Nome *"
            placeholder="Nome completo"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              clearError("name");
            }}
            error={errors.name}
          />
          <PhoneInput
            label="Telefone (WhatsApp) *"
            value={phone}
            onValueChange={(value) => {
              setPhone(value);
              clearError("phone");
            }}
            error={errors.phone}
          />
          <FormInput
            label="E-mail"
            type="email"
            placeholder="email@exemplo.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              clearError("email");
            }}
            error={errors.email}
          />
          <Button onClick={handleSubmit} disabled={!isValid} className="w-full">
            Adicionar Cliente
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
